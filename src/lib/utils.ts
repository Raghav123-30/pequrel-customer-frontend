import { SignJWT, jwtVerify } from 'jose';

const secretKey = 'secret';
const key = new TextEncoder().encode(secretKey);

type Payload = {
	email: string;
};

export async function encrypt(payload: Payload) {
	return await new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime('90 days from now')
		.sign(key);
}

export async function decrypt(input: string): Promise<Payload> {
	try {
		const result = await jwtVerify(input, key, {
			algorithms: ['HS256']
		});
		const payload = result.payload as Payload;
		return payload;
	} catch {
		return {} as Payload;
	}
}

// export async function login(user: string) {
// 	const expires = new Date(Date.now() + 10 * 1000);
// 	const session = await encrypt({ user, expires });

// 	// Save the session in a cookie
// 	Cookies().set('session', session, { httpOnly: true });
// }

// export async function logout() {
// 	// Destroy the session
// 	cookies().set('session', '', { expires: new Date(0) });
// }

// export async function getSession() {
// 	const session = cookies().get('session')?.value;
// 	if (!session) return null;
// 	return await decrypt(session);
// }
