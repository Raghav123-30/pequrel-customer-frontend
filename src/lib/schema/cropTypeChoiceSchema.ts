import { z } from 'zod';

export const CropTypeChoiceSchema = z.object({
	productId: z.string().min(2, { message: 'Please select a product' }),
	cropCategoryId: z.string().min(2, { message: 'Please select crop category' }),
	mode: z.string().min(2, { message: 'Please select a mode' })
});
