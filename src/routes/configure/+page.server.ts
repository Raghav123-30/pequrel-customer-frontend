import { Amplify } from 'aws-amplify';
import awsmobile from '../../aws-exports.js';
import { signOut } from 'aws-amplify/auth';

export const load = async ({ locals }) => {
	console.log(locals.user);
	return {
		email: locals.user.email
	};
};

export const actions = {
	logout: async ({ cookies }) => {
		Amplify.configure(awsmobile);
		await signOut();
		console.log('Logging out now...');
		cookies.set('authToken', '', { expires: new Date(), path: '/' });
	}
};
