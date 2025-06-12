<script>
	import '../app.css';
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	let { data, children } = $props();
	let user = $derived(data.user);

	console.log('In file routes/layout.svelte. Data:', data);

	onMount(async () => {
		invalidateAll();
	});
</script>

<svelte:head>
	<title>Portfolio Tracker</title>
</svelte:head>

<header>
	<nav>
		<ul>
			<li><a href="/">Home</a></li>
			{#if user}
				<li><a href="/dashboard">Dashboard</a></li>
				<li><a href="/assets">Assets</a></li>
			{:else}
				<li><a href="/login">Login</a></li>
				<li><a href="/register">Register</a></li>
			{/if}
		</ul>
	</nav>
</header>

<main>
	{@render children()}
</main>

<!-- This is where the content of each page will be rendered -->

<style>
	main {
		max-width: 1200px;
		margin-left: auto;
		margin-right: auto;
		/* background-color: rgb(108, 108, 154); */
	}

	header {
		position: sticky;
		left: 0;
		top: 0;
		background-color: #a19b93;
		padding: 0.5rem;
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
		list-style: none; /* Remove bullet points from list */
	}
</style>
