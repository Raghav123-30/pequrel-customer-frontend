<script lang="ts">
	console.log('Protected route reached');
	export let data;
	const { error, customerDetails, selfConfigurationForm } = data;
	import { Button, Card, Select, Label, Helper } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { Modal, Checkbox } from 'flowbite-svelte';
	import DisplayError from '$lib/components/utils/DisplayError.svelte';
	import { selfConfigurationSchema } from '$lib/schema/selfConfigurationSchema.js';
	let hasUserReadInstructions = false;
	let showInstructionsModal = true;
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import SuperDebug from 'sveltekit-superforms';
	let showCropImagesCarousel = false;
	import { Carousel, Thumbnails } from 'flowbite-svelte';

	const { customerCrops, customerProducts, cropCategories, customerData } = customerDetails;

	onMount(() => {
		if (data.error) {
			showInstructionsModal = false;
		}
	});

	const instructions = [
		'First, select the product from the selection list',
		'Next, select the mode from the radio group',
		'Next, select the crop category from the dropdown menu.',
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
	$: cropSelectionList = customerCrops
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
		});
	const { form, enhance, errors, submitting } = superForm(selfConfigurationForm, {
		validators: zod(selfConfigurationSchema),
		onSubmit: () => {
			console.log('Submitting');
		},
		onResult: ({ result }) => {
			console.log(result);
		}
	});
</script>

{#if error}
	<DisplayError
		message="Server is facing some issues.Please try again later.If the issue persists, please contact Pequrel team for support"
	/>
{:else if customerProducts.length === 0 || customerCrops.length === 0}
	<DisplayError
		message="It looks like you haven't received training to deploy any crops on your setup yet.If you believe its a mistake contact Pequrel team and ask them to add crops in your record"
	/>
{:else}
	<SuperDebug data={form} />
	<div class="px-4 py-10">
		<Card class="mx-auto max-w-4xl px-8">
			<h5 class="mb-4 text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
				Configure your setup
			</h5>
			<div>
				<form class="flex w-full flex-col gap-6" method="POST">
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
								showCropImagesCarousel = false;

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

					<input class="hidden" name="cropId" bind:value={$form.cropId} />
					{#if $form.cropCategoryId}
						<div>
							<Carousel images={cropSelectionList} {forward} let:Indicators let:Controls bind:index>
								<Indicators />
								<Thumbnails images={cropSelectionList} {forward} bind:index />
							</Carousel>
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
