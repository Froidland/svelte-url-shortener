<script lang="ts">
	import { Map } from 'ol';
	import { View } from 'ol';
	import { onMount } from 'svelte';
	import VectorLayer from 'ol/layer/Vector';
	import VectorSource from 'ol/source/Vector';
	import GeoJSON from 'ol/format/GeoJSON';
	import type { Pixel } from 'ol/pixel.js';
	import type Feature from 'ol/Feature.js';
	import { alpha3ToAlpha2 } from '$lib/utils.js';

	export let data;
	let currentFeature: Feature | undefined;
	let mapElement: HTMLDivElement;
	let tooltipElement: HTMLDivElement;

	onMount(() => {
		const map = new Map({
			target: mapElement,
			layers: [
				new VectorLayer({
					source: new VectorSource({
						format: new GeoJSON(),
						url: '/data/geo/countries.json'
					})
				})
			],
			view: new View({
				center: [0, 0],
				zoom: 2
			}),
			controls: []
		});

		const displayFeatureCountryData = (pixel: Pixel, target: HTMLElement) => {
			const feature = target.closest('.ol-control')
				? undefined
				: map.forEachFeatureAtPixel(pixel, (feature) => feature);

			if (feature) {
				tooltipElement.style.left = pixel[0] + 318 + 'px';
				tooltipElement.style.top = pixel[1] + 105 + 'px';

				if (feature !== currentFeature) {
					tooltipElement.style.visibility = 'visible';
					const alpha2Code = alpha3ToAlpha2[feature.get('code')] || 'XX';
					tooltipElement.innerText = `${alpha2Code}: ${data.clicks[alpha2Code] || 0}`;
				}
			}
		};

		map.on('pointermove', (event) => {
			if (event.dragging) {
				tooltipElement.style.visibility = 'hidden';
				currentFeature = undefined;
				return;
			}

			const pixel = map.getEventPixel(event.originalEvent);
			displayFeatureCountryData(pixel, event.originalEvent.target);
		});

		map.on('click', (event) => {
			displayFeatureCountryData(event.pixel, event.originalEvent.target);
		});

		map.getTargetElement().addEventListener('pointerleave', () => {
			currentFeature = undefined;
			console.log('pointerleave');
			tooltipElement.style.visibility = 'hidden';
		});
	});
</script>

<div class="rounded bg-zinc-800 p-3">
	<div bind:this={mapElement} class="h-[400px] w-full bg-zinc-700">
		<div class="tooltip" bind:this={tooltipElement}></div>
	</div>
	<div>
		<p class="text-sm text-zinc-400">Clicks by country</p>
		<p class="text-lg text-zinc-100">{JSON.stringify(data.clicks)}</p>
	</div>
</div>

<style>
	.tooltip {
		position: absolute;
		display: inline-block;
		height: auto;
		width: auto;
		z-index: 100;
		background-color: #333;
		color: #fff;
		text-align: center;
		border-radius: 4px;
		padding: 5px;
		visibility: hidden;
		pointer-events: none;
	}
</style>
