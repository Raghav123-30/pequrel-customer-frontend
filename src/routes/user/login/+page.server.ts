import { fail, message, superValidate } from 'sveltekit-superforms';
import { loginSchema } from '$lib/schema/loginSchema';
import { zod } from 'sveltekit-superforms/adapters';
import { encrypt } from '$lib/utils.js';
import { redirect } from '@sveltejs/kit';
import { AuthError, signIn } from 'aws-amplify/auth';
import awsmobile from '../../../aws-exports.js';
import { Amplify } from 'aws-amplify';

export const load = async () => {
	const form = await superValidate(zod(loginSchema));
	return { form };
};

export const actions = {
	default: async ({ request, cookies }) => {
		Amplify.configure(awsmobile);
		const form = await superValidate(request, zod(loginSchema));
		if (!form.valid) {
			console.log('form is invalid');
			return fail(400, { form });
		}
		try {
			await signIn({
				username: form.data.email,
				password: form.data.password
			});

			const authToken = await encrypt({ email: form.data.email });
			cookies.set('authToken', authToken, { httpOnly: true, path: '/' });
		} catch (error) {
			if (error instanceof AuthError) {
				if (error.name === 'NotAuthorizedException')
					return message(form, 'Invalid credentials', { status: 403 });
			} else {
				return message(form, 'Something went wrong', { status: 400 });
			}
		}
		return message(form, 'Success');
	}
};
