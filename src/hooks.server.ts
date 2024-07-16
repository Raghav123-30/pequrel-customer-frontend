// hooks.server.ts
import { redirect, type Handle } from '@sveltejs/kit';
import { locale } from 'svelte-i18n';

export const handle: Handle = async ({ event, resolve }) => {
	const lang = event.request.headers.get('accept-language')?.split(',')[0];
	if (lang) {
		locale.set(lang);
	}
	console.log('Request reached');
	const authToken = event.cookies.get('authToken');
	if (authToken) {
		event.locals.user = {
			token: authToken
		};
	}
	const isPublicPath =
		event.url.pathname === '/' ||
		event.url.pathname === '/user/login' ||
		event.url.pathname === '/user/register';
	if (authToken && isPublicPath) {
		throw redirect(303, '/configure');
	}
	if (!authToken && !isPublicPath) {
		console.log('access denied');
		throw redirect(303, '/');
	}

	const response = await resolve(event);
	return response;
};
