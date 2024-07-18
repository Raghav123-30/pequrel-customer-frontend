import { json } from '@sveltejs/kit';
import { Amplify } from 'aws-amplify';
import awsmobile from '../../../aws-exports.js';
import { signOut } from 'aws-amplify/auth';
export async function POST({ cookies }) {
	Amplify.configure(awsmobile);
	await signOut();
	console.log('Logging out now...');
	cookies.set('authToken', '', { expires: new Date(), path: '/' });
	return json({ message: 'Logged out successfully' }, { status: 200 });
}
