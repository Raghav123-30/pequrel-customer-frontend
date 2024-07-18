<script lang="ts">
	import { enhance } from '$app/forms';
	console.log('Protected route reached');
	export let data;
	import { Button } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	onMount(() => {
		console.log(data.customerDetails);
	});
</script>

<div>
	<form method="POST" action="?/logout" use:enhance>
		<Button type="submit">Logout</Button>
	</form>
</div>
