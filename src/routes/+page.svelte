<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { page } from '$app/stores';
	import { copy } from 'svelte-copy';

	const host = $page.url.origin;
	let copied = false;
	let slugLength = [10];
	let url: string = '';
	let generatedSlug: string | null = null;
	let error: string | null = null;

	async function handleSubmit(event: SubmitEvent) {
		const formData = new FormData(event.target as HTMLFormElement);

		const payload = JSON.stringify({
			url: formData.get('url')
		});

		const res = await fetch('/api/url/create', {
			method: 'POST',
			body: payload
		});

		if (!res.ok) {
			const data = await res.json();

			error = data.message;
			generatedSlug = null;
			return;
		}

		const data = await res.json();

		error = null;
		generatedSlug = data.slug;
		url = '';
	}
</script>

<svelte:head>
	<title>Simple URL shortener</title>
</svelte:head>

<div class="flex flex-col items-center gap-4 bg-zinc-800 p-3 rounded">
	<h1 class="text-4xl">Create a shortened URL</h1>
	<form class="flex flex-col gap-4" on:submit|preventDefault={handleSubmit}>
		<div class="flex gap-4">
			<Input
				name="url"
				placeholder="https://example.com/"
				class="rounded w-[300px]"
				maxlength={512}
				bind:value={url}
			/>
			<Button type="submit" class="rounded">Create</Button>
		</div>
	</form>
	{#if generatedSlug}
		<div class="flex gap-4 items-center">
			<a
				class="border-green-600 border-solid border-[1px] p-2"
				href={`${host}/${generatedSlug}`}
				target="_blank">{`${host}/${generatedSlug}`}</a
			>
			<button
				class="bg-white text-black px-4 py-2 rounded font-semibold text-sm hover:bg-gray-200 transition-colors"
				use:copy={`${host}/${generatedSlug}`}
				on:svelte-copy={() => (copied = true)}>{copied ? 'Copied!' : 'Copy'}</button
			>
		</div>
	{/if}
	{#if error}
		<div class="flex gap-4 items-center">
			<p class="border-red-600 border-solid border-[1px] p-2">
				{error}
			</p>
		</div>
	{/if}
</div>
