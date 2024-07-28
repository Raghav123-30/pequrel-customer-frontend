<script lang="ts">
	console.log('Protected route reached');
	export let data;
	const { error, customerDetails, selfConfigurationForm } = data;
	import { Button, Card, Select, Label, Helper, Spinner } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { Modal, Checkbox } from 'flowbite-svelte';
	import DisplayError from '$lib/components/utils/DisplayError.svelte';
	import { selfConfigurationSchema } from '$lib/schema/selfConfigurationSchema.js';
	let hasUserReadInstructions = false;
	let showInstructionsModal = true;
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';

	let showCropImagesCarousel = false;
	import { Carousel, Thumbnails } from 'flowbite-svelte';
	import { ExclamationCircleOutline, CheckCircleSolid } from 'flowbite-svelte-icons';

	type CropImage = {
		name: string;
		title: string;
		alt: string;
		src: string;
		value: string;
	};
	let image: CropImage = {} as CropImage;
	console.log(`image ${image}`);
	const { customerCrops, customerProducts, cropCategories, customerData } = customerDetails;

	onMount(() => {
		if (data.error) {
			showInstructionsModal = false;
		}
	});

	const instructions = [
		'First, select the product from the selection list',
		'Next, select the mode from the selection list',
		'Next, select the crop category from the selection list.',
		'Next, choose the crop you want to deploy from the list of images that are displayed.Please note only those crops will be visible for which you have received training from Pequrel Engineers.',
		'Click the Submit button to confirm your selections. Ensure that the selected crop matches the crop deployed in the A3S setup.',
		'If there are any special instructions available, read them carefully and then click the Approve button.',
		'Wait for a few minutes while the A3S setup configuration adjusts to the chosen crop.'
	];

	const modeSelectionList = [
		{
			name: 'Drying',
			value: 'Drying'
		},
		{
			name: 'Growing',
			value: 'Growing'
		}
	];
	let index = 0;
	let forward = true;
	const productSelectionList = customerProducts.map((item) => {
		return {
			name: item.productName,
			value: item.productId
		};
	});
	const cropCategoriesSelectionList = cropCategories.map((item) => {
		return {
			name: item.cropCategoryNameEnglish,
			value: item.cropCategoryId
		};
	});
	let wasDeploymentSuccess = false;

	$: trainingCrops = customerCrops.filter((item) =>
		customerData.setupCrops
			?.filter((cat) => cat.productId == $form.productId)
			.map((cat) => cat.cropId)
			.includes(item.cropId!)
	);
	$: cropSelectionList = trainingCrops
		.filter(
			(item) =>
				item.cropCategoryId == $form.cropCategoryId &&
				item.cropId ==
					customerData.setupCrops?.find(
						(cat) => cat.productId == $form.productId && cat.cropId === item.cropId
					)?.cropId &&
				item.mode === $form.mode
		)
		.map((item) => {
			return {
				name: item.cropNameEnglish,
				value: item.cropId,

				alt: item.cropNameEnglish,
				src: item.imgUrl,
				title: item.cropNameEnglish
			};
		}) as CropImage[];
	let showConfigurationError = false;
	let configurationErrorMessage = '';
	const { form, enhance, errors, submitting, message } = superForm(selfConfigurationForm, {
		validators: zod(selfConfigurationSchema),
		resetForm: false,

		onSubmit: () => {
			showConfigurationError = false;
			configurationErrorMessage = '';
			console.log('Submitting');
		},
		onResult: ({ result }) => {
			if (result.type == 'success') {
				wasDeploymentSuccess = true;
				console.log(result);
			}
		}
	});
	message.subscribe((value) => {
		if (value && value != 'SUCCESS') {
			showConfigurationError = true;
			configurationErrorMessage = value;
		}
	});
</script>

{#if error}
	<DisplayError
		message="Server is facing some issues.Please try again later.If the issue persists, please contact Pequrel team for support"
	/>
{:else if wasDeploymentSuccess}
	<div class="center">
		<Card color="green" class="mx-auto  max-w-7xl px-2 md:max-w-4xl  md:px-8">
			<div class="flex flex-col items-center justify-between gap-4">
				<CheckCircleSolid color="green" size="xl" />
				<div class="flex flex-col items-center justify-between gap-4">
					<p>
						You have successfully deployed the crop '{image.name ? image.name : ''}' in your product
						'{customerProducts.find((item) => item.productId === $form.productId)?.productName}' in
						'{customerData.customerProducts.find((item) => item.productId === $form.productId)
							?.setupCity}'. It will take just a few minutes for configuration in your setup to be
						adjusted for the chosen crop.
					</p>
					<Button color="alternative" on:click={() => window.location.reload()}
						>Go back to homepage</Button
					>
				</div>
			</div>
		</Card>
	</div>
{:else if customerProducts.length === 0 || customerCrops.length === 0}
	<DisplayError
		message="It looks like you haven't received training to deploy any crops on your setup yet.If you believe its a mistake contact Pequrel team and ask them to add crops in your record"
	/>
{:else}
	<div class="px-4 py-10">
		<Card class="mx-auto max-w-4xl px-8">
			<h5 class="mb-4 text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
				Configure your setup
			</h5>
			<div>
				<form class="flex w-full flex-col gap-6" method="POST" use:enhance>
					<div class="flex flex-col gap-2">
						<Label>Products</Label>
						<Select
							items={productSelectionList}
							placeholder="Select product"
							bind:value={$form.productId}
							name="productId"
							on:change={() => {
								showCropImagesCarousel = false;
								$form.mode = '';
								$form.cropCategoryId = '';
								$form.cropId = '';
							}}
						/>
						{#if $errors.productId}
							<Helper color="red">
								{$errors.productId}
							</Helper>
						{/if}
					</div>
					<div class="flex flex-col gap-2">
						<Label>Mode</Label>
						<Select
							items={modeSelectionList}
							placeholder="Select mode"
							bind:value={$form.mode}
							name="mode"
							disabled={!$form.productId}
							on:change={() => {
								$form.cropId = '';
								$form.cropCategoryId = '';
								showCropImagesCarousel = false;
							}}
						/>
						{#if $errors.mode}
							<Helper color="red">
								{$errors.mode}
							</Helper>
						{/if}
					</div>
					<div class="flex flex-col gap-2">
						<Label>Crop categories</Label>
						<Select
							items={cropCategoriesSelectionList}
							placeholder="Select crop category"
							bind:value={$form.cropCategoryId}
							disabled={!$form.productId || !$form.mode}
							on:change={() => {
								showCropImagesCarousel = true;

								$form.cropId = '';
							}}
							name="cropCategoryId"
						/>
						{#if $errors.cropCategoryId}
							<Helper color="red">
								{$errors.cropCategoryId}
							</Helper>
						{/if}
					</div>
					{#if $form.cropId}
						<div class="flex flex-col items-center justify-center gap-3">
							<h2>You have selected {image.name ? image.name : ''}</h2>
							<img src={image.src} alt={image.alt} class="h-24 w-24" />
						</div>
					{/if}

					{#if $form.cropCategoryId && $form.cropId}
						<div class="space-y-2 text-center">
							<Helper color="green" class="space-y-2" helperClass="text-md">
								Upon clicking deploy, the crop '{image.name ? image.name : ''}' will be deployed in
								your product '{customerProducts.find((item) => item.productId === $form.productId)
									?.productName}' in '{customerData.customerProducts.find(
									(item) => item.productId === $form.productId
								)?.setupCity}'.
							</Helper>
						</div>
					{/if}

					<input class="hidden" name="cropId" bind:value={$form.cropId} />
					{#if $form.cropCategoryId && $form.cropId}
						<div class="flex justify-end">
							<Button type="submit" disabled={$submitting}>
								{#if $submitting}
									<Spinner class="me-3" size="4" color="white" /> Deploying....
								{:else}
									Deploy
								{/if}
							</Button>
						</div>
					{/if}
					{#if showConfigurationError}
						<div>
							<Helper color="red" class="space-y-2">
								{configurationErrorMessage}
							</Helper>
						</div>
					{/if}
				</form>
			</div>
		</Card>
	</div>
{/if}

<Modal open={showInstructionsModal} autoclose={false} title="Instructions" dismissable={false}>
	<ol class="space-y-2 text-left">
		{#each instructions as instruction, index}
			<li>
				{index + 1 + '. ' + instruction}
			</li>
		{/each}
	</ol>
	<div class="my-8 flex flex-col items-center justify-between gap-4 md:flex-row">
		<div class="flex gap-2">
			<Checkbox
				checked={hasUserReadInstructions}
				on:click={() => (hasUserReadInstructions = !hasUserReadInstructions)}
			/>
			I have read all the instructions and would like to proceed
		</div>
		<div>
			<Button on:click={() => (showInstructionsModal = false)} disabled={!hasUserReadInstructions}
				>Continue</Button
			>
		</div>
	</div>
</Modal>

<Modal
	open={showCropImagesCarousel}
	autoclose={false}
	dismissable={false}
	on:close={() => {
		console.log('closing');
		showCropImagesCarousel = false;
	}}
>
	<div>
		{#if cropSelectionList.length}
			<Carousel
				size="md"
				on:change={({ detail }) => {
					image = detail;
				}}
				images={cropSelectionList}
				{forward}
				let:Controls
				let:Indicators
				bind:index
			>
				<Controls class="items-center pt-4 text-slate-900 dark:text-slate-900" />
				<Indicators />
			</Carousel>

			<Button
				class="my-4 w-full"
				on:click={() => {
					$form.cropId = image.value;
					showCropImagesCarousel = false;
				}}
			>
				Select {image?.alt}
			</Button>
		{:else}
			<div>
				<ExclamationCircleOutline color="red" size="md" />
				<p>
					You have not received training for any crops for the product, mode, or category you have
					chosen. Try choosing different settings to load crops.
				</p>
				<Button
					class="w-fit"
					color="alternative"
					on:click={() => {
						$form.productId = '';
						$form.cropCategoryId = '';
						$form.cropId = '';
						$form.mode = '';
						showCropImagesCarousel = false;
					}}>Reset</Button
				>
			</div>
		{/if}
	</div>
</Modal>
