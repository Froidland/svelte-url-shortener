<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { page } from '$app/stores';
	import { copy } from 'svelte-copy';

	const host = $page.url.origin;
	let copied = false;

	export let form;
</script>

<div class="flex flex-col items-center gap-4">
	<h1 class="text-4xl">Create a shortened URL</h1>
	<form class="flex gap-4" method="POST" action="?/create">
		<Input
			name="url"
			placeholder="https://example.com/"
			class="rounded w-[300px]"
			maxlength={512}
		/>
		<Button type="submit" class="rounded">Create</Button>
	</form>
	{#if form?.slug}
		<div class="flex gap-4 items-center">
			<a
				class="border-white border-solid border-[1px] p-2"
				href={`${host}/${form.slug}`}
				target="_blank">{`${host}/${form.slug}`}</a
			>
			<button
				class="bg-white text-black px-4 py-2 rounded font-semibold text-sm hover:bg-gray-200 transition-colors"
				use:copy={`${host}/${form.slug}`}
				on:svelte-copy={() => (copied = true)}>{copied ? 'Copied!' : 'Copy'}</button
			>
		</div>
	{/if}
</div>
