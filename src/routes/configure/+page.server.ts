import { getData } from '$lib/server/utils/dataServices.js';

import type { CustomerDetails } from '$lib/models/customerDetails.js';
export const load = async ({ locals }) => {
	const email = locals.user.email;
	const customerDetailsResult = await getData<CustomerDetails>(
		`/api/customers/details?email=${email}`
	);
	if (customerDetailsResult.error) {
		return {
			error: true,
			customerDetails: {} as CustomerDetails
		};
	} else {
		return {
			error: false,
			customerDetails: customerDetailsResult.data!
		};
	}
};
