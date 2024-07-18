import type { Configuration } from './configuration';

type SetupConfigurationItem = {
	productId: string;
	configuration: Configuration;
};

type SetupCropItem = {
	productId: string;
	cropId: string;
};

export type Customer = {
	customerId?: string;
	productIds?: string[];
	cropIds?: string[];
	customerName: string;
	customerEmail: string;
	customerPhone: string;
	customerAddress: string;
	setupState: string;
	setupCity: string;
	setupAddress: string;
	hasRegistered?: boolean;
	setupConfigurations?: SetupConfigurationItem[];
	setupCrops?: SetupCropItem[];
};
