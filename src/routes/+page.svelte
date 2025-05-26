<script>
	import { page } from '$app/state';

	let user = $derived(page.data.user);
</script>

<h1>Welcome to the Portfolio Tracker</h1>

{#if user}
	<p>Hello, {user.name}!</p>
{:else}
	<p>You are not logged in.</p>
{/if}
<p>This is a simple portfolio tracking application built with SvelteKit.</p>
