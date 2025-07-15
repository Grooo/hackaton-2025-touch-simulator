<script>
	import {onMount} from 'svelte'
	import { browser } from '$app/environment'
	import { win } from '$lib/store'
	// -

	// - Resize
	function resizeWindow() {
		$win.w = window.innerWidth;
		$win.h = window.innerHeight;
		//console.log( $win.h / $win.w );
	}
	// -
	onMount(() => {
		// -
		resizeWindow();
	});

</script>

<svelte:window on:resize='{resizeWindow}'/>

<template lang="pug">
	main
		slot
</template>


<style lang="stylus" global>
	@require "../stylus/globals"
	// -
	*
		margin 0
		box-sizing border-box

	html
		background-color black
		overflow hidden
		overflow-x hidden
		
	body
		background-color #000
		absolute100(true)
		margin 0 !important
		padding 0
		overflow hidden

	main
		background-color #fff
		absolute100(true)
		font()
		fontSmooth()
</style>