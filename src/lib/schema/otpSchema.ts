import { z } from 'zod';

export const otpSchema = z.object({
	email: z.string().email({ message: 'Enter a valid email' }),
	otp: z.string().length(6, { message: 'Enter a valid otp' })
});
