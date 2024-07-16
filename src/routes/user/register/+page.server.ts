import { registerSchema } from '$lib/schema/registerSchema';
import { fail, message, superValidate } from 'sveltekit-superforms';

import { zod } from 'sveltekit-superforms/adapters';
// import { encrypt } from '$lib/utils.js';
// import { redirect } from '@sveltejs/kit';
import { AuthError, signUp, confirmSignUp } from 'aws-amplify/auth';
import awsmobile from '../../../aws-exports.js';
import { Amplify } from 'aws-amplify';
import { otpSchema } from '$lib/schema/otpSchema.js';

export const load = async () => {
	const form = await superValidate(zod(registerSchema));
	const verifyForm = await superValidate(zod(otpSchema));
	return { form, verifyForm };
};

export const actions = {
	register: async ({ request }) => {
		console.log('Request reached here');
		console.log(request);
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
			return message(form, 'OTP has been sent');
			// if (result.nextStep.signUpStep) {
			// 	const authToken = await encrypt({ email: form.data.email });
			// 	cookies.set('authToken', authToken, { httpOnly: true, path: '/' });
			// 	throw redirect(303, '/configure');
			// }
		} catch (error) {
			if (error instanceof AuthError) {
				if (error.name === 'UsernameExistsException')
					return message(form, 'You already have an account.Please login to continue', {
						status: 403
					});
			} else {
				return message(form, 'Something went wrong', { status: 400 });
			}
		}
	},
	verify: async ({ request }) => {
		console.log('Verification request received');
		try {
			const verifyForm = await superValidate(request, zod(otpSchema));
			if (!verifyForm.valid) {
				return fail(400, { verifyForm });
			} else {
				const result = await confirmSignUp({
					username: 'raghavendrabhat2018@gmail.com',
					confirmationCode: verifyForm.data.otp
				});
				console.log(result);
			}
		} catch (error) {
			console.log(error);
		}
	}
};
