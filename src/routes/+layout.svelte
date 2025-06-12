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

<header class="sticky top-0 left-0 z-10 w-full bg-neutral-200 text-sm shadow-sm">
	<nav class="mx-auto max-w-4xl px-4">
		<ul class="flex flex-row items-center gap-4 py-2">
			<li class="hover:font-bold active:font-semibold"><a href="/">Home</a></li>
			{#if user}
				<li class="hover:font-bold active:font-semibold"><a href="/dashboard">Dashboard</a></li>
				<li class="hover:font-bold active:font-semibold"><a href="/assets">Assets</a></li>
			{:else}
				<li class="hover:font-bold active:font-semibold"><a href="/login">Login</a></li>
				<li class="hover:font-bold active:font-semibold"><a href="/register">Register</a></li>
			{/if}
		</ul>
	</nav>
</header>

<main>
	{@render children()}
</main>

<!-- This is where the content of each page will be rendered -->
