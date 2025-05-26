<script>
	import { enhance } from '$app/forms';
	export let form;
</script>

<h1>Login</h1>

{#if form?.error}
	<p style="color: red">{form.error}</p>
{/if}

<form method="POST" use:enhance>
	<label for="username">Username:</label>
	<input type="text" id="username" name="username" required />

	<label for="password">Password:</label>
	<input type="password" id="password" name="password" required />

	<button type="submit">Login</button>
</form>
