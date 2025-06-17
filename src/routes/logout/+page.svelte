<script>
	import { enhance } from '$app/forms';
</script>

<form method="POST" action="/logout" use:enhance>
	<p>Click to confirm logout:</p>
	<button type="submit">Logout</button>
</form>
