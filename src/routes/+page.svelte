<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { page } from '$app/stores';
	import { copy } from 'svelte-copy';
	import { toasts } from 'svelte-toasts';

	const host = $page.url.origin;
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

	function onCopy() {
		toasts.add({
			description: 'Link copied!',
			type: 'success',
			duration: 1000
		});
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
		<div class="flex flex-col gap-2 text-center">
			<p class="font-medium">Generated URL</p>
			<button
				class="border-green-600 hover:bg-zinc-700 rounded border-solid border-[1px] py-2 px-4 cursor-pointer transition-colors active:bg-zinc-600"
				use:copy={`${host}/${generatedSlug}`}
				on:svelte-copy={onCopy}
			>
				{`${host}/${generatedSlug}`}
			</button>
			<span class="text-zinc-500 text-sm">Click the box above to copy the URL.</span>
		</div>
	{/if}
	{#if error}
		<p class="border-red-600 border-solid rounded border-[1px] py-2 px-4">
			{error}
		</p>
	{/if}
</div>
