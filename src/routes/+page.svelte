<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { page } from '$app/stores';

	export let form;
</script>

<div class="flex flex-col items-center gap-4">
	<h1 class="text-4xl">Create a shortened URL</h1>
	<form class="flex gap-4 w-1/3" method="POST" action="?/create">
		<Input name="url" class="rounded" />
		<Button type="submit" class="rounded">Create</Button>
	</form>
	{#if form}
		<a
			class="border-white border-solid border-[1px] p-2"
			href={`${$page.url.origin}/${form.slug}`}
			target="_blank">{`${$page.url.origin}/${form.slug}`}</a
		>
	{/if}
</div>
