import { z } from 'zod';

export const selfConfigurationSchema = z.object({
	productId: z.string().min(2, { message: 'Select a product' }),
	mode: z.string().min(2, { message: 'Select a mode' }),
	cropCategoryId: z.string().min(2, { message: 'Select a crop category' }),
	cropId: z.string().min(2, { message: 'Select a crop' })
});
