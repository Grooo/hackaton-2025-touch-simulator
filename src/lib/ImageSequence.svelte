<script>
	import {onMount, onDestroy} from 'svelte'
	import { win } from '$lib/store'

	export let src = null;
	export let offset = 0;
	export let total = 1;
	export let frame = 0;

	let currentFrameSrc = null;

	$: currentFrameSrc = `${src.replace('[000]', `${(frame+offset).toString().padStart(3, '0')}`)}`;

	$: preloadFrames = Array.from({length: total}, (_, i) => `${src.replace('[000]', `${(i+offset).toString().padStart(3, '0')}`)}`);

	onMount(() => {
		preloadFrames.forEach(frame => {
			const img = new Image();
			img.src = frame;
		});
	});
</script>

<template lang="pug">
	.wrapper( style="--frame: {frame}" ) 

		+each('preloadFrames as frameSrc, i')
			picture( style="display: { frame === i ? 'block' : 'none'}" )
				source(
					srcset="{frameSrc}"
					type="image/webp"
				)
				img(
					src="{frameSrc}"
				)

</template>

<style lang="stylus">
	@require "../stylus/globals"
	// -
	.wrapper
		position relative
		display block
		width 100%
		height 100%

		picture,
		img
			position absolute
			width 100%
			height 100%
			object-fit cover

		picture
			display none

			&.show
				display block

	
</style>