<script lang="ts">
	import { goto } from '$app/navigation';
	import { loginSchema } from '$lib/schema/loginSchema.js';
	import { Button, Card, Label, Select, Input, Helper, Spinner } from 'flowbite-svelte';
	import { EyeOutline, EyeSlashOutline } from 'flowbite-svelte-icons';
	let showPassword = false;
	import { locale } from 'svelte-i18n';
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	export let data;

	let loginMessage = '';
	let showToast = false;
	const { form, errors, enhance, submitting, message } = superForm(data.form, {
		validators: zod(loginSchema)
	});
	message.subscribe((value) => {
		console.log('Message from server is ' + value);
		loginMessage = value;
	});
</script>

<div class="flex h-screen flex-col items-center justify-center px-4">
	<Card class="max-w-2xl space-y-6 p-6 md:max-w-[700px]">
		<div class="mb-8 flex justify-center">
			<img src="/logo.png" class="me-3 h-6 sm:h-9" alt="Pequrel Logo" />
		</div>
		<h5 class="mb-4 text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
			Welcome Back
		</h5>
		<form class="flex flex-col gap-6" method="POST" use:enhance>
			<div class="flex flex-col gap-4">
				<Label for="login-email">Email Address</Label>
				<Input
					id="login-email"
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
				<Label for="login-password">Password</Label>
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
				<button
					on:click={() => {
						goto('/reset');
					}}
					type="button"
					class="w-fit text-sm text-gray-500 hover:underline">Forgot password?</button
				>
				{#if $errors.password}
					<Helper color="red">{$errors.password}</Helper>
				{/if}
			</div>
			<div class="flex justify-between gap-2">
				<Button class="w-fit" type="submit" disabled={$submitting}>
					{#if $submitting}
						<Spinner class="me-3" size="4" color="white" /> Loggin in
					{:else}
						Login
					{/if}
				</Button>
				<button
					type="button"
					class="text-sm text-gray-500 hover:underline"
					on:click={() => goto('/user/register')}
				>
					New here? Create an account
				</button>
			</div>
			<div class="space-y-3">
				{#if loginMessage}
					<Helper color="red">
						{loginMessage}
					</Helper>
				{/if}
			</div>
		</form>
	</Card>
</div>
