<script lang="ts">
	import { copy } from 'svelte-copy';
	import * as Table from '$lib/components/ui/table';
	import type { PageServerData } from './$types';
	import { page } from '$app/stores';
	import dayJs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { invalidateAll } from '$app/navigation';
	import { Trash2 } from '$lib/components/icons';
	import { toasts } from 'svelte-toasts';
	dayJs.extend(relativeTime);

	export let data: PageServerData;
	const host = $page.url.origin;
	$: limit = Number($page.url.searchParams.get('limit')) || 10;
	$: totalPages = Math.ceil(data.total / limit);
	$: currentPage = (Number($page.url.searchParams.get('skip')) || 0) / limit;

	async function deleteEntry(slug: string) {
		const res = await fetch(`/api/url/${slug}`, {
			method: 'DELETE'
		});

		if (!res.ok) {
			//TODO: Error popup or something.
			return;
		}

		await invalidateAll();
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
	<title>My profile</title>
</svelte:head>

<!-- Add limit dropdown -->
<div class="bg-zinc-800 rounded p-3">
	<h1 class="text-center text-4xl font-light mb-4">Created URLs</h1>
	<Table.Root class="w-full">
		<Table.Header class="bg-zinc-700">
			<Table.Row>
				<Table.Head
					class="w-[250px] py-2 px-4 rounded-tl border-r-[1px] border-zinc-500 border-dotted"
					>Slug</Table.Head
				>
				<Table.Head class="border-r-[1px] py-2 px-4 border-zinc-500 border-dotted">URL</Table.Head>
				<Table.Head class="border-r-[1px] w-[175px] py-2 px-4 border-zinc-500 border-dotted"
					>When</Table.Head
				>
				<Table.Head class="w-[150px] py-2 px-4 rounded-tr text-center border-zinc-500 border-dotted"
					>Actions</Table.Head
				>
			</Table.Row>
		</Table.Header>
		{#if data.urls.length === 0}
			<Table.Body class="bg-zinc-900">
				<Table.Row>
					<Table.Cell></Table.Cell>
					<Table.Cell class="text-center font-medium">
						<p>You haven't created any short URLs yet.</p>
					</Table.Cell>
					<Table.Cell></Table.Cell>
					<Table.Cell></Table.Cell>
				</Table.Row>
			</Table.Body>
		{:else}
			<Table.Body class="bg-zinc-900">
				{#each data.urls as url, i}
					<Table.Row>
						<Table.Cell
							class="font-medium py-2 px-4 border-r-[1px] border-zinc-500 border-dotted {i ===
							data.urls.length - 1
								? 'rounded-bl'
								: ''}"
							><span
								use:copy={`${host}/${url.slug}`}
								on:svelte-copy={onCopy}
								class="hover:text-blue-400 active:text-green-400 cursor-pointer select-none transition-colors"
							>
								{url.slug}
							</span></Table.Cell
						>
						<Table.Cell class="font-medium py-2 px-4 border-r-[1px] border-zinc-500 border-dotted"
							><a
								href={url.location}
								target="_blank"
								class="hover:text-blue-400 transition-colors line-clamp-1">{url.location}</a
							></Table.Cell
						>
						<Table.Cell class="py-2 px-4 border-r-[1px] border-zinc-500 border-dotted"
							><span class="font-medium">
								{dayJs(url.created_at).fromNow()}
							</span></Table.Cell
						>
						<Table.Cell
							class="flex gap-2 items-center justify-center py-2 px-4 {i === data.urls.length - 1
								? 'rounded-br'
								: ''}"
						>
							<button
								on:click={() => deleteEntry(url.slug)}
								class="bg-red-800 py-2 px-2 rounded hover:bg-red-700 transition-colors"
								><Trash2 size="18" /></button
							>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		{/if}
	</Table.Root>
	<p class="text-center text-zinc-600 mt-2 font-medium text-sm">
		Hint: click on the slug cell content to copy the short URL for that item.
	</p>
	{#if totalPages > 0}
		<ul class="flex flex-wrap mt-4 mb-2 gap-x-2 gap-y-6 justify-center items-center">
			{#each Array(totalPages) as _, index}
				<li class="">
					<a
						class="py-2 px-4 font-medium rounded {currentPage === index
							? 'bg-white text-black'
							: 'bg-zinc-600 text-white'}"
						href="/profile?limit={limit}&skip={limit * index}">{index + 1}</a
					>
				</li>
			{/each}
		</ul>
	{/if}
</div>
