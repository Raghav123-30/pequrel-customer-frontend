import type { Crop } from './crop';
import type { CropCategory } from './cropCategory';
import type { Customer } from './customer';
import type { Product } from './product';

export type CustomerDetails = {
	customerProducts: Product[];
	customerCrops: Crop[];
	customerData: Customer;
	cropCategories: CropCategory[];
};
