<!-- src/routes/+layout.svelte -->
<script>
	import '../app.css'; // Global styles
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	onMount(() => {
		invalidateAll();
	});
</script>

<svelte:head>
	<title>Portfolio Tracker</title>
</svelte:head>

<div class="container">
	<nav>
		<ul>
			<li><a href="/">Home</a></li>
			{#if page.data.session}
				<li><a href="/dashboard">Dashboard</a></li>
				<li><a href="/assets">Assets</a></li>
			{:else}
				<li><a href="/login">Login</a></li>
				<li><a href="/register">Register</a></li>
			{/if}
		</ul>
	</nav>
	<slot />
	<!-- This is where the content of each page will be rendered -->
</div>

<style>
	.container {
		max-width: 1200px; /* Example max-width for a container */
		margin-left: auto;
		margin-right: auto;
		padding-top: 1rem; /* Equivalent to py-4 (padding-top and padding-bottom) */
		padding-bottom: 1rem; /* You can adjust the values as needed */
	}

	nav a {
		color: blue; /* Default link color */
		text-decoration: none; /* Remove underline */
	}

	nav a:hover {
		color: darkblue; /* Link color on hover */
	}

	nav ul {
		display: flex;
		gap: 1rem; /* space-x-4  adjust the value as needed */
		margin-bottom: 1rem; /* mb-4  adjust the value as needed */
		list-style: none; /* Remove bullet points from list */
		padding: 0; /* Remove default padding */
	}
</style>
