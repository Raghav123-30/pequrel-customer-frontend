<script lang="ts">
	import { Button, Input, Helper, Card, Label } from 'flowbite-svelte';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { verifyEmailSchema } from '$lib/schema/verifyEmailSchema.js';
	import { resetAccountSchema } from '$lib/schema/resetAccountSchema.js';
	export let data;
	const {
		form: resetAccountForm,
		errors: resetAccountFormErrors,
		submitting: resetAccountFormSubmitting,
		enhance: resetAccountFormEnahnce
	} = superForm(data.resetAccountForm, {
		validators: zod(resetAccountSchema),
		resetForm: false
	});
	let isOtpSent = false;
	const {
		form: verifyEmailForm,
		errors: verifyEmailFormErrors,
		submitting: verifyEmailFormsSubmitting,
		enhance: verifyEmailFormEnhane
	} = superForm(data.verifyEmailForm, {
		validators: zod(verifyEmailSchema),
		resetForm: false,
		onSubmit: () => {
			$resetAccountForm.email = $verifyEmailForm.email;
		},
		onResult: () => {
			isOtpSent = true;
		}
	});
	verifyEmailForm.subscribe((value) => {
		$resetAccountForm.email = value.email;
	});
</script>

<SuperDebug data={verifyEmailForm} />
<SuperDebug data={resetAccountForm} />
<div class="flex h-screen flex-col items-center justify-center px-4">
	<Card class="max-w-2xl space-y-6 p-6 md:max-w-[700px]">
		<div class="mb-8 flex justify-center">
			<img src="/logo.png" class="me-3 h-6 sm:h-9" alt="Pequrel Logo" />
		</div>
		<h5 class="mb-4 text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
			{!isOtpSent
				? 'Enter your email.We will send one time verification code to verify your email'
				: 'Enter OTP sent to your email and create new password'}
		</h5>
		<form
			class={`flex flex-col gap-6 ${!isOtpSent && 'hidden'}`}
			method="POST"
			action="?/verifyEmail"
			use:verifyEmailFormEnhane
		>
			<div class="flex flex-col gap-4">
				<Label for="email">Email Address</Label>
				<Input
					id="login-email"
					type="email"
					placeholder="youremail@example.com"
					name="email"
					bind:value={$verifyEmailForm.email}
				/>
				{#if $verifyEmailFormErrors.email}
					<Helper color="red">{$verifyEmailFormErrors.email}</Helper>
				{/if}
			</div>

			<div class="flex justify-between gap-2">
				<Button class="w-fit" type="submit">Request OTP</Button>
			</div>
		</form>
		<form
			class={`flex flex-col gap-6 ${isOtpSent && 'hidden'}`}
			method="POST"
			action="?/resetAccount"
			use:resetAccountFormEnahnce
		>
			<div class=" ">
				<Label for="email">Email</Label>

				<Input type="email" name="email" bind:value={$resetAccountForm.email} />
				{#if $resetAccountFormErrors.email}
					<Helper color="red">{$resetAccountFormErrors.email}</Helper>
				{/if}
			</div>
			<div class="flex flex-col gap-4">
				<Label for="otp">OTP</Label>

				<Input type="number" placeholder="XXXXXX" name="otp" bind:value={$resetAccountForm.otp} />
				{#if $resetAccountFormErrors.otp}
					<Helper color="red">{$resetAccountFormErrors.otp}</Helper>
				{/if}
			</div>
			<div class="flex flex-col gap-4">
				<Label for="password">Password</Label>

				<Input type="password" name="password" bind:value={$resetAccountForm.password} />
				{#if $resetAccountFormErrors.password}
					<Helper color="red">{$resetAccountFormErrors.password}</Helper>
				{/if}
			</div>
			<div class="flex flex-col gap-4">
				<Label for="confirmPassword">Retype Password</Label>

				<Input
					type="password"
					name="confirmPassword"
					bind:value={$resetAccountForm.confirmPassword}
				/>
				{#if $resetAccountFormErrors.confirmPassword}
					<Helper color="red">{$resetAccountFormErrors.confirmPassword}</Helper>
				{/if}
			</div>
			<div class="flex justify-between gap-2">
				<Button class="w-fit" type="submit">Reset</Button>
			</div>
		</form>
	</Card>
</div>
