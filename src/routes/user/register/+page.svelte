<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button, Card, Label, Input, Helper, Modal, Spinner, Toast } from 'flowbite-svelte';
	import { locale } from 'svelte-i18n';
	import { EyeOutline, EyeSlashOutline } from 'flowbite-svelte-icons';
	import { CheckCircleSolid } from 'flowbite-svelte-icons';
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { registerSchema } from '$lib/schema/registerSchema.js';
	import { otpSchema } from '$lib/schema/otpSchema.js';

	let showPassword = false;
	let showConfirmPassword = false;
	let showOtpModal = false;
	let verificationError = false;
	let verificationErrorMessage = '';
	let registerError = false;
	let registerErrorMessage = '';
	let showToast = false;
	let successMessage = '';
	export let data;
	const { form, errors, enhance, submitting, message } = superForm(data.form, {
		validators: zod(registerSchema),
		resetForm: false,
		onSubmit: () => {
			$verifyForm.email = $form.email;
			$verifyForm.password = $form.password;
			console.log('Submitting');
		},
		onResult: ({ result }) => {
			if (result.type == 'success') {
				showOtpModal = true;
			}
			console.log('We got result');
		}
	});
	const {
		form: verifyForm,
		errors: verifyFormErrors,
		enhance: verifyFormEnhance,
		submitting: verifyFormSubmitting,
		message: verifyFormMessage
	} = superForm(data.verifyForm, {
		validators: zod(otpSchema),
		resetForm: false,
		onSubmit: () => {
			verificationError = false;
			verificationErrorMessage = '';
			console.log('Submitting');
		},
		onResult: ({ result }) => {
			if (result.type === 'success') {
				showOtpModal = false;
				showToast = true;
				successMessage = 'You have successfully created your account.Login to continue';
				setTimeout(() => {
					goto('/user/login');
					showToast = false;
					successMessage = '';
				}, 2500);
			}
		}
	});
	message.subscribe((message) => {
		if (message != 'SUCCESS' && message) {
			registerError = true;
			registerErrorMessage = message;
			console.log(message);
		}
	});
	form.subscribe((values) => {
		$verifyForm.email = values.email;
		$verifyForm.password = values.password;
	});
	verifyFormMessage.subscribe((message) => {
		if (message != 'SUCCESS' && message) {
			verificationError = true;
			verificationErrorMessage = message;
		}
	});
</script>

<div class="flex h-screen flex-col items-center justify-center px-4">
	<Card class="max-w-2xl space-y-6 p-6 md:max-w-[700px]">
		<div class="mb-8 flex justify-center">
			<img src="/logo.png" class="me-3 h-6 sm:h-9" alt="Pequrel Logo" />
		</div>
		<h5 class="mb-4 text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
			Create an Account
		</h5>
		<form class="flex flex-col gap-6" use:enhance method="POST" action="?/register">
			<div class="flex flex-col gap-4">
				<Label for="register-email">Email Address</Label>
				<Input
					id="register-email"
					type="email"
					placeholder="youremail@example.com"
					name="email"
					bind:value={$form.email}
				/>
				{#if $errors.email}
					<Helper color="red">{$errors.email}</Helper>
				{/if}
			</div>
			<div class="flex flex-col gap-4">
				<Label for="register-password">Password</Label>
				<Input
					name="password"
					id="show-password"
					type={showPassword ? 'text' : 'password'}
					placeholder="*****************"
					size="lg"
					bind:value={$form.password}
				>
					<button
						type="button"
						slot="left"
						on:click={() => (showPassword = !showPassword)}
						class="pointer-events-auto"
					>
						{#if showPassword}
							<EyeOutline class="h-6 w-6" />
						{:else}
							<EyeSlashOutline class="h-6 w-6" />
						{/if}
					</button>
				</Input>
				{#if $errors.password}
					<Helper color="red">{$errors.password}</Helper>
				{/if}
			</div>
			<div class="flex flex-col gap-4">
				<Label for="register-password">Retype Password</Label>
				<Input
					name="confirmPassword"
					id="show-password"
					type={showConfirmPassword ? 'text' : 'password'}
					placeholder="*****************"
					size="lg"
					bind:value={$form.confirmPassword}
				>
					<button
						type="button"
						slot="left"
						on:click={() => (showConfirmPassword = !showConfirmPassword)}
						class="pointer-events-auto"
					>
						{#if showConfirmPassword}
							<EyeOutline class="h-6 w-6" />
						{:else}
							<EyeSlashOutline class="h-6 w-6" />
						{/if}
					</button>
				</Input>
				{#if $errors.confirmPassword}
					<Helper color="red">{$errors.confirmPassword}</Helper>
				{/if}
			</div>
			<div class="flex justify-between gap-2">
				<Button class="w-fit" type="submit">
					{#if $submitting}
						<Spinner class="me-3" size="4" color="white" /> processing ...
					{:else}
						Register
					{/if}
				</Button>
				<button
					type="button"
					class="text-sm text-gray-500 hover:underline"
					on:click={() => goto('/user/login')}
				>
					Already have an account? Log in
				</button>
			</div>
			<div class="gap-2">
				{#if registerError}
					<Helper color="red">
						{registerErrorMessage}
					</Helper>
				{/if}
			</div>
		</form>
	</Card>
</div>

<Modal bind:open={showOtpModal} size="xs" title="Enter OTP sent to your email" autoclose={false}>
	<form method="POST" action="?/verify" use:verifyFormEnhance class="flex flex-col gap-6">
		<Input type="email" bind:value={$verifyForm.email} name="email" class="hidden" />
		<Input type="password" bind:value={$verifyForm.password} name="password" class="hidden" />
		<div class="flex flex-col gap-4">
			<Label>OTP</Label>
			<Input type="number" bind:value={$verifyForm.otp} name="otp" />
			{#if $verifyFormErrors.otp}
				<Helper color="red">{$verifyFormErrors.otp}</Helper>
			{/if}
		</div>

		<Button type="submit">
			{#if $verifyFormSubmitting}
				<Spinner class="me-3" size="4" color="white" /> processing ...
			{:else}
				Verify
			{/if}
		</Button>
		{#if $verifyFormMessage}
			<Helper color="red">
				{$verifyFormMessage}
			</Helper>
		{/if}
		{#if verificationError}
			<Helper color="red">
				{verificationErrorMessage}
			</Helper>
		{/if}
	</form>
</Modal>

{#if showToast}
	<div class="fixed bottom-10 right-10">
		<Toast color={'green'}>
			<div class="flex items-center gap-4">
				<CheckCircleSolid color="green" />

				{successMessage}
			</div>
		</Toast>
	</div>
{/if}
