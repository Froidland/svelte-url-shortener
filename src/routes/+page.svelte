<script lang="ts">
	import { page } from '$app/stores';
	import { copy } from 'svelte-copy';
	import { toasts } from 'svelte-toasts';

	const urlRegex =
		/[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;

	const host = $page.url.origin;
	let url: string = '';
	let generatedSlug: string | null = null;
	let error: string | null = null;
	let loading = false;

	async function handleSubmit(event: SubmitEvent) {
		loading = true;

		if (!urlRegex.test(url)) {
			error = 'The value you provided is not a valid URL.';
			loading = false;
			return;
		}

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
			loading = false;
			return;
		}

		const data = await res.json();

		error = null;
		generatedSlug = data.slug;
		url = '';
		loading = false;
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
	<h1 class="text-4xl font-light text-center">Create a shortened URL</h1>
	<form
		class="flex items-center flex-col w-full max-w-xs gap-2"
		on:submit|preventDefault={handleSubmit}
	>
		<input
			name="url"
			placeholder="https://example.com/"
			class="rounded w-full p-2 bg-neutral-600 selection:bg-green-200 selection:text-green-950"
			maxlength={2048}
			bind:value={url}
		/>
		<button
			type="submit"
			disabled={!url || loading}
			class="rounded bg-green-300 hover:bg-green-200 text-green-950 font-medium px-4 py-2 disabled:bg-neutral-400 transition-colors"
			>Create</button
		>
		{#if generatedSlug}
			<div class="flex flex-col gap-2 text-center items-center">
				<p class="font-medium">Generated URL</p>
				<div
					class="rounded bg-green-300 p-2 text-green-950 font-medium hover:bg-green-200 w-fit transition-colors cursor-pointer"
					use:copy={`${host}/${generatedSlug}`}
					on:svelte-copy={onCopy}
				>
					{`${host}/${generatedSlug}`}
				</div>
				<span class="text-zinc-500 text-sm">Click the box above to copy the URL.</span>
			</div>
		{/if}
		{#if error}
			<p class="rounded bg-red-300 p-2 text-red-950 font-medium">
				{error}
			</p>
		{/if}
	</form>
</div>
