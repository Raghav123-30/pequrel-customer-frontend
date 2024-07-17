import { resetAccountSchema } from '$lib/schema/resetAccountSchema';
import { verifyEmailSchema } from '$lib/schema/verifyEmailSchema';
import { confirmResetPassword } from 'aws-amplify/auth';
import { resetPassword } from 'aws-amplify/auth';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => {
	const resetAccountForm = await superValidate(zod(resetAccountSchema));
	const verifyEmailForm = await superValidate(zod(verifyEmailSchema));
	return { resetAccountForm, verifyEmailForm };
};

export const actions = {
	verifyEmail: async ({ request }) => {
		const verifyEmailForm = await superValidate(request, zod(verifyEmailSchema));
		try {
			const result = await resetPassword({
				username: verifyEmailForm.data.email
			});
			console.log(result);
			return message(verifyEmailForm, 'success');
		} catch (error) {
			console.log(error);
		}
		return fail(400, { message: 'failed to send OTP' });
	},
	resetAccount: async ({ request }) => {
		const resetAccountForm = await superValidate(request, zod(resetAccountSchema));
		try {
			const result = await confirmResetPassword({
				username: resetAccountForm.data.email,
				newPassword: resetAccountForm.data.password,
				confirmationCode: resetAccountForm.data.otp
			});
			console.log(result);
			return message(resetAccountForm, 'success');
		} catch (error) {
			console.log(error);
		}
		return fail(400, { message: 'failed to reset your account' });
	}
};
