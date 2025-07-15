<script>
	import {onMount} from 'svelte'
	import { win } from '$lib/store'
	// -

</script>


<template lang="pug">
	.wrapper
		h1 404
</template>


<style lang="stylus">
	@require "../../stylus/globals"
	// -
	.wrapper
		absolute100(true);
		display flex
		justify-content center
		align-items center
		font-size 8rem
		font-weight bold
		text-align center
</style>