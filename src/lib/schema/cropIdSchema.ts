import { z } from 'zod';

export const cropIdSchema = z.object({
	cropId: z.string().min(2, { message: 'Please select crop' })
});
