<script lang="ts">
	import { Button, Input, Helper, Card, Label, Spinner } from 'flowbite-svelte';
	import { message, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { verifyEmailSchema } from '$lib/schema/verifyEmailSchema.js';
	import { resetAccountSchema } from '$lib/schema/resetAccountSchema.js';
	import { Toast } from 'flowbite-svelte';
	import { CheckCircleSolid } from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';
	export let data;
	let showPassword = false;
	let showConfirmPassword = false;
	import { EyeOutline, EyeSlashOutline } from 'flowbite-svelte-icons';
	const {
		form: resetAccountForm,
		errors: resetAccountFormErrors,
		submitting: resetAccountFormSubmitting,
		enhance: resetAccountFormEnahnce,
		message: resetAccountFormMessage
	} = superForm(data.resetAccountForm, {
		validators: zod(resetAccountSchema),
		resetForm: false,
		onSubmit: () => {
			resetError = false;
			resetErrorMessage = '';
		},

		onResult: ({ result }) => {
			if (result.type === 'success') {
				showToast = true;
				successMessage = 'You have successfully reset your password.Login to continue';
				setTimeout(() => {
					goto('/user/login');
					showToast = false;
					successMessage = '';
				}, 1500);
			}
		}
	});
	let isOtpSent = false;
	const {
		form: verifyEmailForm,
		errors: verifyEmailFormErrors,
		submitting: verifyEmailFormsSubmitting,
		enhance: verifyEmailFormEnhane,
		message: verifyEmailFormMessage
	} = superForm(data.verifyEmailForm, {
		validators: zod(verifyEmailSchema),
		resetForm: false,
		onSubmit: () => {
			$resetAccountForm.email = $verifyEmailForm.email;
		},
		onResult: ({ result }) => {
			if (result.type == 'success') {
				isOtpSent = true;
			}
		}
	});
	verifyEmailForm.subscribe((value) => {
		$resetAccountForm.email = value.email;
	});
	let resetError = false;
	let resetErrorMessage = '';
	let verificationError = false;
	let verificationErrorMessage = '';
	let showToast = false;
	let successMessage = '';
	verifyEmailFormMessage.subscribe((value) => {
		if (value && value != 'SUCCESS') {
			verificationError = true;
			verificationErrorMessage = value;
		}
	});
	resetAccountFormMessage.subscribe((value) => {
		if (value && value != 'SUCCESS') {
			resetError = true;
			resetErrorMessage = value;
		}
	});
</script>

<div class="absolute inset-0 z-[-30] bg-gradient-to-r from-slate-800 to-blue-900 opacity-70"></div>
<div class="absolute inset-0 z-[-40]">
	<img
		src="/background.png"
		alt="background"
		class="h-full w-full object-cover brightness-75 filter"
	/>
</div>
<div class="flex h-screen flex-col items-center justify-center px-4">
	<Card class="max-w-2xl space-y-6 p-6 md:max-w-[700px]">
		<div class="mb-8 flex justify-center">
			<img src="/logo.png" class="me-3 h-6 sm:h-9" alt="Pequrel Logo" />
		</div>
		<h5 class="mb-4 text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
			{!isOtpSent
				? 'Enter your email for account verification'
				: 'Confirm your identity with the verification code and create a new password'}
		</h5>
		<form
			class={`flex flex-col gap-6 ${isOtpSent && 'hidden'}`}
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

			<div class="flex items-center justify-between gap-2">
				<Button class="w-fit" type="submit">
					{#if $verifyEmailFormsSubmitting}
						<Spinner class="me-3" size="4" color="white" /> sending otp
					{:else}
						Request otp
					{/if}
				</Button>
				<button
					type="button"
					class="text-sm text-gray-500 hover:underline"
					on:click={() => goto('/')}
				>
					Go back to home page
				</button>
			</div>
			<div class="gap-2">
				{#if verificationError}
					<Helper color="red">{verificationErrorMessage}</Helper>
				{/if}
			</div>
		</form>
		<form
			class={`flex flex-col gap-6 ${!isOtpSent && 'hidden'}`}
			method="POST"
			action="?/resetAccount"
			use:resetAccountFormEnahnce
		>
			<div class=" hidden">
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
				<Label for="register-password">Password</Label>
				<Input
					name="password"
					id="show-password"
					type={showPassword ? 'text' : 'password'}
					placeholder="*****************"
					size="lg"
					bind:value={$resetAccountForm.password}
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
				{#if $resetAccountFormErrors.password}
					<Helper color="red">{$resetAccountFormErrors.password}</Helper>
				{/if}
			</div>
			<div class="flex flex-col gap-4">
				<Label for="confirmPassword">Retype Password</Label>
				<Input
					name="confirmPassword"
					id="show-password"
					type={showConfirmPassword ? 'text' : 'password'}
					placeholder="*****************"
					size="lg"
					bind:value={$resetAccountForm.confirmPassword}
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
				{#if $resetAccountFormErrors.confirmPassword}
					<Helper color="red">{$resetAccountFormErrors.confirmPassword}</Helper>
				{/if}
			</div>

			<div>
				<Button type="submit">
					{#if $resetAccountFormSubmitting}
						<Spinner class="me-3" size="4" color="white" /> processing
					{:else}
						Reset account
					{/if}
				</Button>
			</div>
			<div class="gap-2">
				{#if resetError}
					<Helper color="red">
						{resetErrorMessage}
					</Helper>
				{/if}
			</div>
		</form>
	</Card>
</div>

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
