<script lang="ts">
	import { goto } from '$app/navigation';

	let isLanguageSelected = false;

	import { Button, Card, Label, Select, Input } from 'flowbite-svelte';
	import { onMount } from 'svelte';
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
	onMount(() => {
		goto('/user/login');
	});
</script>

<!-- <div class="absolute inset-0 z-[-30] bg-gradient-to-r from-slate-800 to-blue-900 opacity-70"></div>
<div class="absolute inset-0 z-[-40]">
	<img
		src="/background.png"
		alt="background"
		class="h-full w-full object-cover brightness-75 filter"
	/>
</div> -->

<div class="flex h-screen flex-col items-center justify-center px-4">
	<!-- <Card class="max-w-2xl space-y-6 p-6 md:max-w-[700px]">
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
					goto('/user/login');
				}}
			>
				Continue
			</Button>
		</div>
	</Card> -->
</div>
