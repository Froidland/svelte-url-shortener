<script lang="ts">
	import { page } from '$app/stores';
	import toast from 'svelte-french-toast';
	import type { PageData, ActionData } from './$types';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { schema } from './schema';
	import { Field, Control, Label, Description, FieldErrors } from 'formsnap';

	async function copyUrl(url: string) {
		try {
			await navigator.clipboard.writeText(url);
		} catch (error) {
			toast.error('An error occurred while copying the URL.', {
				style: 'background: #18181B; color: #fff;'
			});

			return;
		}

		toast.success('URL copied!', {
			style: 'background: #18181B; color: #fff;'
		});
	}

	export let data: PageData;
	const host = $page.url.origin;
	const form = superForm(data.form, {
		validators: zodClient(schema)
	});
	const { form: formData, enhance, message } = form;
</script>

<svelte:head>
	<title>URL Shortener</title>
</svelte:head>

<div class="flex flex-col items-center gap-4 rounded bg-zinc-800 p-6">
	<form class="flex w-full max-w-[400px] flex-col gap-1" method="post" use:enhance>
		<Field {form} name="destination">
			<Control let:attrs>
				<Label class="font-medium">Destination</Label>
				<input
					class="w-full rounded bg-neutral-600 p-2 selection:bg-green-200 selection:text-green-950"
					{...attrs}
					type="text"
					bind:value={$formData.destination}
				/>
			</Control>
			<div>
				<Description class="text-sm italic"
					>The destination where the URL will redirect to.</Description
				>
				<FieldErrors class="font-medium italic text-red-500" />
			</div>
		</Field>
		{#if data.user.isAllowedCustomSlugs}
			<Field {form} name="slug">
				<Control let:attrs>
					<Label class="font-medium">Slug</Label>
					<input
						class="w-full rounded bg-neutral-600 p-2 selection:bg-green-200 selection:text-green-950 disabled:bg-neutral-700"
						{...attrs}
						type="text"
						disabled={!data.user.isAllowedCustomSlugs}
						bind:value={$formData.slug}
					/>
				</Control>
				<div>
					<Description class="text-sm italic"
						>The URL identifier. Randomly generated if not specified.
					</Description>
					<FieldErrors class="font-medium italic text-red-500" />
				</div>
			</Field>
		{/if}
		<button class="btn-primary cursor-pointer rounded px-4 py-2 font-medium transition-colors"
			>Create</button
		>
		{#if $message}
			<div class="flex justify-center gap-2 pt-3 text-center">
				<button
					type="button"
					class="btn-secondary w-fit cursor-pointer rounded px-4 py-2 font-medium transition-colors"
					on:click={() => copyUrl(`${host}/${$message}`)}
				>
					{host}/{$message}
				</button>
			</div>
		{/if}
	</form>
</div>
