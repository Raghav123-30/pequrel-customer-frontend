<script lang="ts">
	import { enhance } from '$app/forms';
	console.log('Protected route reached');
	export let data;
	import { Button } from 'flowbite-svelte';
</script>

<div>
	<p>Configuration self service page for customer with email {data.email}</p>
	<form method="POST" action="?/logout" use:enhance>
		<Button type="submit">Logout</Button>
	</form>
</div>
