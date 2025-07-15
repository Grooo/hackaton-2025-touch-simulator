<script>
	import {onMount} from 'svelte'
	import { win } from '$lib/store'
	// -
	import { Canvas } from '@threlte/core'
	import Scene from '$lib/Scene.svelte'

</script>


<template lang="pug">
	Scene()
		
</template>


<style lang="stylus">
	@require "../stylus/globals"
	// -
	.canvas-wrapper
		absolute100(true);
</style>