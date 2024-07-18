<script lang="ts">
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	const logoutUser = async () => {
		await fetch('/api/logout', { method: 'POST' });
		window.location.reload();
	};
</script>

<Navbar>
	<NavBrand href="/configure">
		<img src="/logo.png" class="me-3 h-6 sm:h-9" alt="Pequrel Logo" />
	</NavBrand>
	<NavHamburger />
	<NavUl>
		<NavLi href="/configure">Home</NavLi>
		<!--		TODO add langauge selection button-->

		<NavLi href="#" on:click={logoutUser}>Logout</NavLi>
	</NavUl>
</Navbar>
<slot />
