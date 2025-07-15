<script>
	import {onMount} from 'svelte'
	import { win } from '$lib/store'
	// -
	import { Canvas } from '@threlte/core'
	import SceneRobot from '$lib/SceneRobot.svelte'

</script>


<template lang="pug">
	SceneRobot()
</template>


<style lang="stylus">
	@require "../../stylus/globals"
	// -
	.canvas-wrapper
		absolute100(true);
</style>