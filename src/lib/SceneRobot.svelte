<script>
	import {onMount, onDestroy} from 'svelte'
	import { win } from '$lib/store'

	// -
	import WebcamVideo from '$lib/WebcamVideo.svelte'
	import ImageSequence from '$lib/ImageSequence.svelte'
	import { startRecognition, stopRecognition } from '$lib/mediapipe/faceRecognizer'
	import { Pane } from "tweakpane";

	// -
	let canvasEl = null;
	let canvasCtx = null;

	let webCamElem = null;
	let buttonElem = null;


	let isWebcamEnabled = false;
	
	let raf = null;

	let videoElem = null;
	let sequenceElem = null;
	let framePercent = 0;
	const totalFrames = 26;
	let frame = Math.ceil( totalFrames * 0.36 );

	let rotation = 0;
	

	$: if (isWebcamEnabled) {
		startRecognition( webCamElem, render );
	}
	// -
	let params = {
		vel: 0.2,
		maxVel: 0.2,
		minVel: 0.04,
		translate: true,
		rotate: true,
	}
	// -
	let waitingPreview = false;

	function render( rotation, raf) {
		// 
		if ( raf ){
			if( rotation ){
				framePercent = 1-clamp((0.75-rotation.x) * 3.5, 0, 1);
				frame = Math.round( framePercent * totalFrames );
				//console.log( rotation.x, framePercent, frame );
			}
		}
	}

	function resizeCanvas() {
		//params.pointerSize = 1.7 / window.innerHeight;
		canvasEl.width = $win.w;
		canvasEl.height = $win.h;
		// -
		rotation = {
			x: 0,
			y: 0,
			z: 0
		}
	}

	function clamp(value, min, max) {
		return Math.max(min, Math.min(value, max));
	}

	function createControls() {
		const pane = new Pane();
		
		pane.addBinding( params, "vel", { min: 0, max: 1, step: 0.01 });
		//pane.addBinding( params, "pointerSize", { min: 1, max: 10, step: 0.1 });
	}

	
	// -
	onMount(() => {
		//createControls();
		// -
		canvasCtx = canvasEl.getContext("2d");

		resizeCanvas();
		
		// - raf = requestAnimationFrame( render );
	});

	onDestroy(() => {
		stopRecognition();
	});

</script>

<svelte:window on:resize='{resizeCanvas}'/>

<template lang="pug">
	WebcamVideo( bind:webCamElem active="{isWebcamEnabled}" )

	canvas( 
		bind:this="{canvasEl}" 
		width="{$win.w}"
		height="{$win.h}"
	)

	.video-container
		.sequence
			ImageSequence( bind:sequenceElem src="/img/robot/ezgif-frame-[000].webp" total="{totalFrames}" offset="{38}" frame="{frame}" )

	+if( "!isWebcamEnabled" )
		#enable-webcam(
			on:click!="{() => (isWebcamEnabled = true)}"
		)
			.button( 
				bind:this="{buttonElem}" 
			) Enable webcam

</template>


<style lang="stylus">
	@require "../stylus/globals"
	// -
	canvas
		absolute100(true);
		pointer-events none
		background-color transparent
		//mix-blend-mode screen
		z-index 3

	.video-container
		position absolute
		z-index 2
		top 13vh
		right 10vw
		width 50vh
		height 50vh
		pointer-events none
		overflow hidden
		//outline dashed yellow 1px
		box-shadow 4px 4px 40px 0px rgba(0, 0, 0, 0.1), 4px 11px 10px 0px rgba(0, 0, 0, 0.1)

		.sequence
			position absolute
			--pos-x 0%;
			--pos-y 0%;
			left calc( var(--pos-x) * -1 )
			top calc( var(--pos-y) * -1 )
			width calc( 100% + var(--pos-x) * 2 )
			height calc( 100% + var(--pos-y) * 2 )
			transform translate( -50%, -50% )
			transform rotate(var(--rotation));
			transform-origin 50% 50%;


	#enable-webcam
		absolute100(true);
		background-color rgba(0,0,0,.5);
		backdrop-filter blur(50px);
		display flex
		align-items center
		justify-content center
		pointer-events auto
		cursor pointer
		z-index 4

		.button
			font-size 1.5rem
			padding 10px 20px
			border-radius 5px
			background-color #ddd
			color #222
			transition all .3s ease

		&:hover
			.button
				background-color #fff
				color #222

	
</style>