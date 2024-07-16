<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button, Card, Label, Select, Input, Helper } from 'flowbite-svelte';
	import { locale } from 'svelte-i18n';
	import { EyeOutline, EyeSlashOutline } from 'flowbite-svelte-icons';
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { registerSchema } from '$lib/schema/registerSchema.js';

	let showPassword = false;
	let showConfirmPassword = false;
	export let data;
	const { form, errors, enhance, submitting } = superForm(data.form, {
		validators: zod(registerSchema),
		onSubmit: () => {
			console.log('Submitting');
		},
		onResult: () => {
			console.log('We got result');
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
		<form class="flex flex-col gap-6" use:enhance method="POST">
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
				<Button class="w-fit" type="submit">Register</Button>
				<button
					type="button"
					class="text-sm text-gray-500 hover:underline"
					on:click={() => goto('/user/login')}
				>
					Already have an account? Log in
				</button>
			</div>
		</form>
	</Card>
</div>
