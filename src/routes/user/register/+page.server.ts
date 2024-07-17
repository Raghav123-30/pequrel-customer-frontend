import { registerSchema } from '$lib/schema/registerSchema';
import { fail, message, superValidate } from 'sveltekit-superforms';

import { zod } from 'sveltekit-superforms/adapters';
// import { encrypt } from '$lib/utils.js';
// import { redirect } from '@sveltejs/kit';
import {
	AuthError,
	signUp,
	confirmSignUp,
	resetPassword,
	confirmResetPassword
} from 'aws-amplify/auth';
import awsmobile from '../../../aws-exports.js';
import { Amplify } from 'aws-amplify';
import { otpSchema } from '$lib/schema/otpSchema.js';

export const load = async () => {
	const form = await superValidate(zod(registerSchema));
	const verifyForm = await superValidate(zod(otpSchema));
	return { form, verifyForm };
};

export const actions = {
	register: async ({ request, cookies }) => {
		Amplify.configure(awsmobile);
		const form = await superValidate(request, zod(registerSchema));
		if (!form.valid) {
			console.log('form is invalid');
			return fail(400, { form });
		}
		try {
			const result = await signUp({
				username: form.data.email,
				password: form.data.password
			});
			console.log(result);
			return message(form, 'code sent');
			// if (result.nextStep.signUpStep) {
			// 	const authToken = await encrypt({ email: form.data.email });
			// 	cookies.set('authToken', authToken, { httpOnly: true, path: '/' });
			// 	throw redirect(303, '/configure');
			// }
		} catch (error) {
			console.log(error);

			if (error instanceof AuthError) {
				if (error.name === 'UsernameExistsException') {
					//check if registered from customers collection if found ask users to login
					const result = await resetPassword({
						username: form.data.email
					});

					const nextStep = result.nextStep;
					console.log(nextStep);
					console.log(`reset password result`, result);
					cookies.set('hasUserForgottenSecondStep', 'true', { httpOnly: true, path: '/' });
					return message(form, 'Code has been resent');
				}
			} else {
				return message(form, 'Something went wrong', { status: 400 });
			}
		}
	},
	verify: async ({ request, cookies }) => {
		console.log('Verification request reached here');
		try {
			const verifyForm = await superValidate(request, zod(otpSchema));
			if (!verifyForm.valid) {
				return fail(400, { verifyForm });
			} else {
				const hasUserForgottenSecondStep = cookies.get('hasUserForgottenSecondStep') || '';
				console.log(`hasUserForgottemSecondStep: ${hasUserForgottenSecondStep}`);
				console.log(`formData:`, verifyForm.data);
				if (hasUserForgottenSecondStep) {
					await confirmResetPassword({
						username: verifyForm.data.email,
						confirmationCode: verifyForm.data.otp,
						newPassword: verifyForm.data.password
					});
				} else {
					console.log('confirming now');
					console.log(verifyForm.data);
					const result = await confirmSignUp({
						username: verifyForm.data.email,

						confirmationCode: verifyForm.data.otp
					});
					console.log(`result : ${result}`);
				}
			}
		} catch (error) {
			console.log(error);
		}
	}
};
