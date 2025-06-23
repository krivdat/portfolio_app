<script>
	import '../app.css';
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

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

<div class="fixed inset-0 -z-10 h-full w-full">
	<img
		src="/stock-chart.png"
		alt="Stock chart background"
		class="h-full w-full object-cover object-center"
		aria-hidden="true"
	/>
	<div class="absolute inset-0 bg-gradient-to-b from-blue-900/30 to-blue-700/20"></div>
</div>

{#if !$page.url.pathname.startsWith('/login') && !$page.url.pathname.startsWith('/register')}
	<header class="sticky top-0 left-0 z-10 w-full bg-neutral-200 text-sm font-semibold shadow-lg">
		<nav>
			<div class="tex flex w-full justify-between px-2 py-1 md:px-2 md:py-2">
				<!-- Left group -->
				<div class="flex items-center gap-2 md:gap-4">
					<a class="hover:text-blue-600" href="/">Home</a>
					{#if user}
						<a class="hover:text-blue-600" href="/dashboard">Dashboard</a>
						<a class="hover:text-blue-600" href="/assets">Assets</a>
						<a class="hover:text-blue-600" href="/closed">Closed</a>
					{/if}
				</div>
				<!-- Right group -->
				<div class="flex items-center gap-2 md:gap-4">
					<a class="hover:text-blue-600" href="/about">About</a>
					{#if user}
						<a href="/profile" class="hover:text-blue-600">
							{user.first_name || user.last_name
								? `${user.first_name || ''} ${user.last_name || ''}`.trim()
								: user.username}
						</a>
						<span class="hidden md:inline">({user.email})</span>
						<form action="/logout" method="POST" use:enhance>
							<button
								class="flex items-center gap-1 rounded px-2 py-1 text-red-600 hover:bg-red-100 focus:ring-2 focus:ring-red-400 focus:outline-none"
								type="submit"
								aria-label="Logout"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
									/>
								</svg>
							</button>
						</form>
					{:else}
						<a class="hover:text-blue-600" href="/login">Login</a>
						<a class="hover:text-blue-600" href="/register">Register</a>
					{/if}
				</div>
			</div>
		</nav>
	</header>
{/if}

<main>
	{@render children()}
</main>
