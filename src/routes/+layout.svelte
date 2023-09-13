<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import '../app.css';
</script>

<div class="container flex flex-col">
	<nav class="flex justify-between bg-slate-800 p-3 my-3 rounded-xl">
		<div>
			<Button class="rounded" href="/">Create</Button>
		</div>
		<div>
			<Button class="rounded">Login</Button>
		</div>
	</nav>
	<slot />
</div>
