export const load = async ({ locals }) => {
	console.log(locals.user);
	return {
		email: locals.user.email
	};
};

export const actions = {
	logout: async ({ cookies }) => {
		console.log('Logging out now...');
		cookies.set('authToken', '', { expires: new Date(), path: '/' });
	}
};
