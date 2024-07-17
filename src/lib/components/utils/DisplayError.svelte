<script lang="ts">
	import { Card, Label } from 'flowbite-svelte';
	import { ExclamationCircleSolid } from 'flowbite-svelte-icons';
	export let message = 'The resource you are looking for does not exist';
</script>

<div class="center">
	<Card color="red" class="flex items-center gap-4 px-8 text-center">
		<ExclamationCircleSolid></ExclamationCircleSolid>
		<Label color="red">{message}</Label>
	</Card>
</div>
