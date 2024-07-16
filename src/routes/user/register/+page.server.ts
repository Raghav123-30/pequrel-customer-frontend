import { superValidate } from 'sveltekit-superforms';
import { registerSchema } from '$lib/schema/registerSchema';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => {
	const form = await superValidate(zod(registerSchema));
	return { form };
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(registerSchema));
		return { form };
	}
};
