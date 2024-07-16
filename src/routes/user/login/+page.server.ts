import { superValidate } from 'sveltekit-superforms';
import { loginSchema } from '$lib/schema/loginSchema';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => {
	const form = await superValidate(zod(loginSchema));
	return { form };
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(loginSchema));
		return { form };
	}
};
