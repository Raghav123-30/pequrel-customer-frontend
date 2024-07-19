import { getData, postData } from '$lib/server/utils/dataServices.js';

import type { CustomerDetails } from '$lib/models/customerDetails.js';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { selfConfigurationSchema } from '$lib/schema/selfConfigurationSchema.js';
import type { CropDeployment } from '$lib/models/cropDeployment.js';
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
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod(selfConfigurationSchema));
		if (!form.valid) {
			return fail(400, form);
		} else {
			const deployment: CropDeployment = {
				productId: form.data.productId,
				mode: form.data.mode,
				customerEmail: locals.user.email,
				cropId: form.data.cropId
			};
			const deploymentResponse = await postData<CropDeployment>(
				'/api/customers/deployment',
				deployment
			);
			if (deploymentResponse.error) {
				return message(form, 'Failed to deploy your crop.Please try again later', { status: 403 });
			} else {
				return message(form, 'SUCCESS');
			}
		}
	}
};
