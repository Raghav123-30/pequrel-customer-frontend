<script lang="ts">
	let isLanguageSelected = false;
	let showRegisterForm = false;
	import { Button, Card, Label, Select, Input } from 'flowbite-svelte';
	import { locale } from 'svelte-i18n';
	const languages = [
		{
			value: 'en',
			name: 'English'
		},
		{
			value: 'kn',
			name: 'ಕನ್ನಡ'
		},
		{
			value: 'hi',
			name: 'हिंदी'
		}
	];
	import { _ } from 'svelte-i18n';
	let selectedLanguage = '';
</script>

<div class="absolute inset-0 z-[-30] bg-gradient-to-r from-slate-800 to-blue-900 opacity-70"></div>
<div class="absolute inset-0 z-[-40]">
	<img
		src="/background.png"
		alt="background"
		class="w-full h-full object-cover filter brightness-75"
	/>
</div>

<div class="flex flex-col h-screen justify-center items-center px-4">
	<Card class="max-w-2xl md:max-w-[700px] space-y-6 p-6">
		<div class="flex justify-center mb-8">
			<img src="/logo.png" class="me-3 h-6 sm:h-9" alt="Pequrel Logo" />
		</div>
		{#if isLanguageSelected}
			{#if showRegisterForm}
				<h5 class="mb-4 text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
					Create an Account
				</h5>
				<form class="flex flex-col gap-6">
					<div class="flex flex-col gap-4">
						<Label for="register-email">Email Address</Label>
						<Input id="register-email" type="email" placeholder="youremail@example.com" required />
					</div>
					<div class="flex flex-col gap-4">
						<Label for="register-password">Password</Label>
						<Input id="register-password" type="password" placeholder="**************" required />
					</div>
					<div class="flex justify-between gap-2">
						<Button class="w-fit">Register</Button>
						<button
							type="button"
							class="text-gray-500 text-sm hover:underline"
							on:click={() => (showRegisterForm = false)}
						>
							Already have an account? Log in
						</button>
					</div>
				</form>
			{:else}
				<h5 class="mb-4 text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
					Welcome Back
				</h5>
				<form class="flex flex-col gap-6">
					<div class="flex flex-col gap-4">
						<Label for="login-email">Email Address</Label>
						<Input id="login-email" type="email" placeholder="youremail@example.com" required />
					</div>
					<div class="flex flex-col gap-4">
						<Label for="login-password">Password</Label>
						<Input id="login-password" type="password" placeholder="**************" required />
						<button type="button" class="text-gray-500 text-sm hover:underline w-fit"
							>Forgot password?</button
						>
					</div>
					<div class="flex justify-between gap-2">
						<Button class="w-fit">Login</Button>
						<button
							type="button"
							class="text-gray-500 text-sm hover:underline"
							on:click={() => (showRegisterForm = true)}
						>
							New here? Create an account
						</button>
					</div>
				</form>
			{/if}
		{:else}
			<div class="space-y-4">
				<Label for="language-select">Select your preferred language</Label>
				<Select
					id="language-select"
					items={languages}
					bind:value={selectedLanguage}
					placeholder="Choose a language"
				></Select>
				<Button
					disabled={!selectedLanguage}
					on:click={() => {
						$locale = selectedLanguage;
						isLanguageSelected = true;
					}}
				>
					Continue
				</Button>
			</div>
		{/if}
	</Card>
</div>
