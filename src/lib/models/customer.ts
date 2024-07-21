import type { Configuration } from './configuration';

type SetupConfigurationItem = {
	productId: string;
	configuration: Configuration;
};

type SetupCropItem = {
	productId: string;
	cropId: string;
};

type CustomerProduct = {
	productId: string;
	setupState: string;
	setupCity: string;
	setupAddress: string;
};

export type Customer = {
	customerId?: string;
	customerProducts: CustomerProduct[];
	customerCrops?: string[];
	customerName: string;
	customerEmail: string;
	customerPhone: string;
	customerAddress: string;
	hasRegistered?: boolean;
	setupConfigurations?: SetupConfigurationItem[];
	setupCrops?: SetupCropItem[];
};
