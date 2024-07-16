import { fail, superValidate } from 'sveltekit-superforms';
import { loginSchema } from '$lib/schema/loginSchema';
import { zod } from 'sveltekit-superforms/adapters';
import { encrypt } from '$lib/utils.js';
import { redirect } from '@sveltejs/kit';

export const load = async () => {
	const form = await superValidate(zod(loginSchema));
	return { form };
};

export const actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(loginSchema));
		if (!form.valid) {
			console.log('form is invalid');
			return fail(400, { form });
		}
		const authToken = await encrypt({ email: form.data.email });
		cookies.set('authToken', authToken, { httpOnly: true, path: '/' });
		throw redirect(303, '/configure');
	}
};
