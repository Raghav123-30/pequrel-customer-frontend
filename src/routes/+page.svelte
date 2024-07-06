<script lang="ts">
	import type { PageServerData } from './$types';

	export let data: PageServerData;
	import { _ } from 'svelte-i18n';
</script>

<div>
	<h1>{$_('title')}</h1>
</div>
