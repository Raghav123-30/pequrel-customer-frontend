<script lang="ts">
	import { enhance } from '$app/forms';
	console.log('Protected route reached');
	export let data;
	import { Button } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { Modal, Checkbox } from 'flowbite-svelte';
	onMount(() => {
		console.log(data.customerDetails);
	});
	let hasUserReadInstructions = false;
	let showInstructionsModal = true;
	const instructions = [
		'First, select the product from the selection list',
		'Next, select the mode from the radio group',
		'Next, select the crop category from the dropdown menu.',
		'Next, choose the crop you want to deploy from the list of images that are displayed.Please note only those crops will be visible for which you have received training from Pequrel Engineers.',
		'Click the Submit button to confirm your selections. Ensure that the selected crop matches the crop deployed in the A3S setup.',
		'If there are any special instructions available, read them carefully and then click the Approve button.',
		'Wait for a few minutes while the A3S setup configuration adjusts to the chosen crop.'
	];
</script>

<div>
	<form method="POST" action="?/logout" use:enhance>
		<Button type="submit">Logout</Button>
	</form>
</div>

<Modal open={showInstructionsModal} autoclose={false} title="Instructions" dismissable={false}>
	<ol>
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
