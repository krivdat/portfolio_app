<script>
	import { enhance } from '$app/forms';
	let { form } = $props();
</script>

<!-- <div class="fixed inset-0 -z-10 h-full w-full">
	<img
		src="/stock-chart.png"
		alt="Stock chart background"
		class="h-full w-full object-cover object-center"
		aria-hidden="true"
	/>
	<div class="absolute inset-0 bg-gradient-to-b from-blue-900/30 to-blue-700/20"></div>
</div> -->

<div class="mx-auto mt-10 flex w-full max-w-xs flex-col items-center">
	<h1 class="mt-8 mb-18 text-3xl font-bold text-white drop-shadow-lg">Register</h1>

	{#if form?.error}
		<p class="mb-2 text-sm text-red-600">{form.error}</p>
	{/if}

	<form
		method="POST"
		use:enhance
		class="flex w-full flex-col gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 shadow"
	>
		<div class="flex flex-col gap-0.5">
			<label for="username" class="text-sm font-medium text-gray-600">Username</label>
			<input
				type="text"
				id="username"
				name="username"
				required
				class="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 transition-colors duration-150 focus:border-blue-300 focus:ring-1 focus:ring-blue-200 focus:outline-none"
			/>
		</div>
		<div class="flex flex-col gap-0.5">
			<label for="password" class="text-sm font-medium text-gray-600">Password</label>
			<input
				type="password"
				id="password"
				name="password"
				required
				class="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 transition-colors duration-150 focus:border-blue-300 focus:ring-1 focus:ring-blue-200 focus:outline-none"
			/>
		</div>
		<div class="flex flex-col gap-0.5">
			<label for="confirmPassword" class="text-sm font-medium text-gray-600">Confirm Password</label
			>
			<input
				type="password"
				id="confirmPassword"
				name="confirmPassword"
				required
				class="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 transition-colors duration-150 focus:border-blue-300 focus:ring-1 focus:ring-blue-200 focus:outline-none"
			/>
		</div>
		<div class="flex flex-col gap-0.5">
			<label for="email" class="text-sm font-medium text-gray-600">Email</label>
			<input
				type="email"
				id="email"
				name="email"
				required
				class="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 transition-colors duration-150 focus:border-blue-300 focus:ring-1 focus:ring-blue-200 focus:outline-none"
			/>
		</div>
		<div class="flex flex-col gap-0.5">
			<label for="profile_picture" class="text-sm font-medium text-gray-600"
				>Profile Picture URL</label
			>
			<input
				type="url"
				id="profile_picture"
				name="profile_picture"
				class="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 transition-colors duration-150 focus:border-blue-300 focus:ring-1 focus:ring-blue-200 focus:outline-none"
			/>
		</div>
		<div class="flex flex-col gap-0.5">
			<label for="first_name" class="text-sm font-medium text-gray-600">First Name</label>
			<input
				type="text"
				id="first_name"
				name="first_name"
				class="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 transition-colors duration-150 focus:border-blue-300 focus:ring-1 focus:ring-blue-200 focus:outline-none"
			/>
		</div>
		<div class="flex flex-col gap-0.5">
			<label for="last_name" class="text-sm font-medium text-gray-600">Last Name</label>
			<input
				type="text"
				id="last_name"
				name="last_name"
				class="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 transition-colors duration-150 focus:border-blue-300 focus:ring-1 focus:ring-blue-200 focus:outline-none"
			/>
		</div>
		<button
			type="submit"
			class="mt-4 w-full rounded bg-blue-200 px-3 py-1.5 text-base font-semibold text-blue-900 shadow transition-colors duration-150 hover:bg-blue-300 focus:ring-1 focus:ring-blue-200 focus:outline-none"
		>
			Register
		</button>
		<p class="text-center">
			<span>
				or <a href="/login" class="text-blue-700 underline hover:text-blue-900">login</a>
			</span>
		</p>
	</form>
</div>
