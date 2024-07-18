import { getData } from '$lib/server/utils/dataServices.js';

import type { CustomerDetails } from '$lib/models/customerDetails.js';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { selfConfigurationSchema } from '$lib/schema/selfConfigurationSchema.js';

export const load = async ({ locals }) => {
	const email = locals.user.email;
	const selfConfigurationForm = await superValidate(zod(selfConfigurationSchema));
	const customerDetailsResult = await getData<CustomerDetails>(
		`/api/customers/details?email=${email}`
	);
	if (customerDetailsResult.error) {
		return {
			selfConfigurationForm: selfConfigurationForm,
			error: true,
			customerDetails: {} as CustomerDetails
		};
	} else {
		return {
			selfConfigurationForm: selfConfigurationForm,
			error: false,
			customerDetails: customerDetailsResult.data!
		};
	}
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(selfConfigurationSchema));
		return { form };
	}
};
