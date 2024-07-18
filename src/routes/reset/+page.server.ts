import type { Customer } from '$lib/models/customer';
import { resetAccountSchema } from '$lib/schema/resetAccountSchema';
import { verifyEmailSchema } from '$lib/schema/verifyEmailSchema';
import { getData } from '$lib/server/utils/dataServices.js';
import { AuthError, confirmResetPassword } from 'aws-amplify/auth';
import { resetPassword } from 'aws-amplify/auth';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => {
	const resetAccountForm = await superValidate(zod(resetAccountSchema));
	const verifyEmailForm = await superValidate(zod(verifyEmailSchema));
	return { resetAccountForm, verifyEmailForm };
};

export const actions = {
	verifyEmail: async ({ request }) => {
		const verifyEmailForm = await superValidate(request, zod(verifyEmailSchema));
		const existingCustomerResult = await getData<Customer>(
			`/api/customers/email?email=${verifyEmailForm.data.email}`
		);

		if (existingCustomerResult.error) {
			return message(verifyEmailForm, 'This email is not registered at pequrel', {
				status: 404
			});
		} else if (!existingCustomerResult.data?.hasRegistered) {
			return message(verifyEmailForm, "You don't have an account yet.Please register", {
				status: 404
			});
		} else {
			try {
				const result = await resetPassword({
					username: verifyEmailForm.data.email
				});
				console.log(result);
				return message(verifyEmailForm, 'SUCCESS');
			} catch {
				return message(verifyEmailForm, 'Something went wrong,please try again later', {
					status: 404
				});
			}
		}
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
			return message(resetAccountForm, 'SUCCESS');
		} catch (error) {
			if (error instanceof AuthError) {
				if (error.name === 'CodeMismatchException') {
					return message(resetAccountForm, 'OTP you entered is incorrect', { status: 403 });
				} else {
					return message(resetAccountForm, 'Something went wrong,please try again later', {
						status: 404
					});
				}
			}
		}
		return message(resetAccountForm, 'Something went wrong,please try again later', {
			status: 404
		});
	}
};
