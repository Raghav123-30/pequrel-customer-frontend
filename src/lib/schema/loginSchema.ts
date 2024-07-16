import * as z from 'zod';

export const loginSchema = z.object({
	email: z.string().email({ message: 'Enter a valid email' }),
	password: z
		.string()
		.min(8, 'Password must be at least 8 characters long')
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
			'Password must contain at least one uppercase letter, one lowercase letter, and one number'
		)
		.refine((value) => {
			return value.length <= 20;
		}, 'Password must be no more than 20 characters long')
});
