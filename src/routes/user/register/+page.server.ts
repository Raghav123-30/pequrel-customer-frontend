import { registerSchema } from '$lib/schema/registerSchema';
import { fail, message, superValidate } from 'sveltekit-superforms';

import { zod } from 'sveltekit-superforms/adapters';
// import { encrypt } from '$lib/utils.js';
// import { redirect } from '@sveltejs/kit';
import { AuthError, signUp, confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';
import awsmobile from '../../../aws-exports.js';
import { Amplify } from 'aws-amplify';
import { otpSchema } from '$lib/schema/otpSchema.js';
import { getData, putData } from '$lib/server/utils/dataServices.js';
import type { Customer } from '$lib/models/customer.js';

export const load = async () => {
	const form = await superValidate(zod(registerSchema));
	const verifyForm = await superValidate(zod(otpSchema));
	return { form, verifyForm };
};

const updateCustomer = async (customer: Customer) => {
	const updateCustomerResult = await putData<Customer>(`/api/customers/${customer.customerId}`, {
		...customer,
		hasRegistered: true
	});
	return updateCustomerResult.error;
};

export const actions = {
	register: async ({ request, cookies }) => {
		Amplify.configure(awsmobile);
		const form = await superValidate(request, zod(registerSchema));
		const existingCustomerResult = await getData<Customer>(
			`/api/customers/email?email=${form.data.email}`
		);

		if (!form.valid) {
			return fail(400, { form });
		} else if (existingCustomerResult.error) {
			return message(form, 'Your email is not registered at Pequrel', { status: 403 });
		} else {
			const customer = existingCustomerResult.data!;

			if (customer.hasRegistered) {
				return message(form, 'You already have an account.Login to continue', { status: 403 });
			} else {
				try {
					await signUp({
						username: form.data.email,
						password: form.data.password
					});

					return message(form, 'SUCCESS');
				} catch (error) {
					if (error instanceof AuthError) {
						if (error.name === 'UsernameExistsException') {
							await resendSignUpCode({
								username: form.data.email
							});

							cookies.set('hasUserForgottenSecondStep', 'true', { httpOnly: true, path: '/' });
							return message(form, 'SUCCESS');
						}
					} else {
						return message(form, 'Something went wrong', { status: 400 });
					}
				}
			}
		}
	},
	verify: async ({ request, cookies }) => {
		const verifyForm = await superValidate(request, zod(otpSchema));
		try {
			const existingCustomerResult = await getData<Customer>(
				`/api/customers/email?email=${verifyForm.data.email}`
			);
			if (!verifyForm.valid) {
				return fail(400, { verifyForm });
			} else {
				if (existingCustomerResult.error) {
					return message(verifyForm, 'Something went wrong', { status: 400 });
				} else {
					const hasUserForgottenSecondStep = cookies.get('hasUserForgottenSecondStep') || '';

					if (hasUserForgottenSecondStep) {
						try {
							await confirmSignUp({
								username: verifyForm.data.email,
								confirmationCode: verifyForm.data.otp
							});
							await updateCustomer(existingCustomerResult.data!);
							return message(verifyForm, 'success');
						} catch {
							return message(verifyForm, 'Something went wrong', { status: 400 });
						}
					} else {
						try {
							await confirmSignUp({
								username: verifyForm.data.email,

								confirmationCode: verifyForm.data.otp
							});
							await updateCustomer(existingCustomerResult.data!);
							return message(verifyForm, 'success');
						} catch {
							return message(verifyForm, 'Something went wrong', { status: 400 });
						}
					}
				}
			}
		} catch {
			return message(verifyForm, 'Something went wrong', { status: 403 });
		}
	}
};
