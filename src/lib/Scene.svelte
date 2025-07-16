<script>
	import {onMount, onDestroy} from 'svelte'
	import { win } from '$lib/store'

	// -
	import WebcamVideo from '$lib/WebcamVideo.svelte'
	import ImageSequence from '$lib/ImageSequence.svelte'
	import { startRecognition, stopRecognition } from '$lib/mediapipe/recognizer'
	import { Pane } from "tweakpane";

	import howler from 'howler';
	const Howl = howler.Howl;
	let sound = null;
	let soundDuration = 0;
	let volume = 1;

	// -
	let canvasEl = null;
	let canvasCtx = null;

	let webCamElem = null;
	let buttonElem = null;


	let isWebcamEnabled = false;
	
	let raf = null;

	let videoElem = null;
	let sequenceElem = null;
	let framePercent = 1;
	const totalFrames = 105;
	let frame = 0;
	const minDistance = 30;
	const maxDistance = 400;
	const distanceMultiplier = 1;
	let rotation = 0;
	let position = {
		x: 0,
		y: 0
	}

	$: if (isWebcamEnabled) {
		startRecognition( webCamElem, render );
	}
	// -
	let params = {
		vel: 0.1,
		maxVel: 0.2,
		minVel: 0.04,
		velFrame: 0.075,
		translate: true,
		rotate: true,
		velRotate: 0.075,
		pointerSize: 3,
	}
	// -
	class Pointer {
		constructor( col) {
			this.auto = true;
			this.x = 0;
			this.y = 0;
			this.px = 0;
			this.py = 0;
		}

		getColor() {
			return this.colors[this.c];
		}

		clearTimer() {
			if( this.timer ) {
				clearTimeout( this.timer );
				this.timer = null;
			}
		}
	}
	// -
	const pointers = [];
	pointers.push( new Pointer(0) );
	pointers.push( new Pointer(1) );

	// -
	let waitingPreview = false;

	
	// -
	let color0, color1;
	const dt = 1 / 60;

	function updateMousePosition(id, eX, eY, col) {
		pointers[id].x = eX;
		pointers[id].y = eY;
		if( col !== undefined ) pointers[id].c = col;
		//console.log( pointers[id].x, pointers[id].y );
	}

	function render( positions, raf) {
		// 
		if ( raf ){
			if( positions[0] ){
				updateMousePosition(
					0,
					positions[0].x * $win.w,
					positions[0].y * $win.h,
					0
				);
			}
			// -
			if( positions[1] ){
				updateMousePosition(
					1,
					positions[1].x * $win.w,
					positions[1].y * $win.h,
					1
				);
			}

			// -
			if(!positions[0] && !positions[1]){
				updateMousePosition(
					0,
					$win.w * 0.5,
					$win.h * 0.5,
					0
				);
				updateMousePosition(
					1,
					$win.w * 0.5,
					$win.h * 0.5,
					1
				);
				params.vel = params.minVel;
			}else{
				params.vel = params.maxVel;
			}

			// - Easing
			pointers[0].px += (pointers[0].x - pointers[0].px ) * params.vel;
			pointers[0].py += (pointers[0].y - pointers[0].py ) * params.vel;
			// -
			pointers[1].px += (pointers[1].x - pointers[1].px ) * params.vel;
			pointers[1].py += (pointers[1].y - pointers[1].py ) * params.vel;
			// -

			// - console.log( distance, pointers[0].x, pointers[0].y, pointers[1].x, pointers[1].y );
			//drawCanvas();
			// -
			updateVideo();
		}
	}

	function drawCanvas() {
		canvasCtx.clearRect(0, 0, $win.w, $win.h);
		// -
		canvasCtx.fillStyle = 'rgba(255,255,0,1)';
		canvasCtx.beginPath();
		canvasCtx.arc(pointers[0].px, pointers[0].py, params.pointerSize, 0, 2 * Math.PI);
		canvasCtx.fill();

		canvasCtx.fillStyle = 'rgba(0,255,255,1)';
		canvasCtx.beginPath();
		canvasCtx.arc(pointers[1].px, pointers[1].py, params.pointerSize, 0, 2 * Math.PI);
		canvasCtx.fill();
		// -
		canvasCtx.strokeStyle = 'rgba(255,255,255,1)';
		canvasCtx.beginPath();
		canvasCtx.moveTo(pointers[0].px, pointers[0].py);
		canvasCtx.lineTo(pointers[1].px, pointers[1].py);
		canvasCtx.stroke();	
	}

	function resizeCanvas() {
		//params.pointerSize = 1.7 / window.innerHeight;
		canvasEl.width = $win.w;
		canvasEl.height = $win.h;
		// -
		position = {
			x: $win.w * 0.5,
			y: $win.h * 0.5
		}
	}

	function clamp(value, min, max) {
		return Math.max(min, Math.min(value, max));
	}

	function updateVideo() {
		let newFramePercent = 1;

		position = params.translate ? {
			x: pointers[1].px + ((pointers[0].px - pointers[1].px) * 0.5),
			y: pointers[1].py + ((pointers[0].py - pointers[1].py) * 0.5)
		} : {
			x: $win.w * 0.4,
			y: $win.h * 0.4
		}
		rotation += (( params.rotate ? Math.atan2( pointers[0].py - pointers[1].py, pointers[0].px - pointers[1].px ) * 0.5 : 0 ) - rotation ) * params.velRotate;
		// -
		const distance = Math.sqrt( Math.pow( pointers[0].x - pointers[1].x, 2 ) + Math.pow( pointers[0].y - pointers[1].y, 2 ) );
		const normalizedDistance = (distance - minDistance) / (maxDistance - minDistance);

		if( !params.translate ){
			newFramePercent = 1;
		}else{
			newFramePercent = clamp(normalizedDistance, 0, 1);
		}

		if( sound.playing() ){
			sound.pause();
		}
		volume -= 0.15;


		framePercent += ( newFramePercent - framePercent ) * params.velFrame;

		const newFrame = clamp(Math.round( framePercent * totalFrames ), 0, totalFrames - 1);

		if( newFrame !== frame ) {
			frame = newFrame;
			// -
			volume += 0.25;
			sound.seek([soundDuration * framePercent], 0);
			if( !sound.playing() ){
				sound.play();
			}
		}
		volume = clamp( volume, 0, 1 );
		sound.volume( volume );
	}

	function setupEvents() {
		canvasEl.addEventListener("mousemove", (e) => {
			if( e.pageX + e.pageY > 0 ){	
				//console.log(e.pageX, e.pageY);
				updateMousePosition(0, e.pageX, e.pageY);
			}
		});

		canvasEl.addEventListener("touchmove", (e) => {
			e.preventDefault();
			updateMousePosition(0, e.targetTouches[0].pageX, e.targetTouches[0].pageY);
		});
	}

	function createControls() {
		const pane = new Pane();
		
		pane.addBinding( params, "rotate");
		pane.addBinding( params, "translate");
		pane.addBinding( params, "vel", { min: 0, max: 1, step: 0.01 });
		//pane.addBinding( params, "pointerSize", { min: 1, max: 10, step: 0.1 });
	}

	
	// -
	onMount(() => {
		//createControls();
		// -
		canvasCtx = canvasEl.getContext("2d");
		// -
		sound = new Howl({
			src: ['./audio/11L-unfold_metallic_leat-1752499582973.mp3'],
			autoplay: false,
			loop: false,
			volume: 1,
			onload: function() {
				soundDuration = sound.duration();
			}
		});

		setupEvents();
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

	.video-container( style="--rotation: {rotation}rad; --pos-x: {position.x}px; --pos-y: {position.y}px" )
		.sequence
			ImageSequence( bind:sequenceElem src="./img/metallic/ezgif-frame-[000].webp" total="{totalFrames}" frame="{frame}" )

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
		--rotation 0deg;
		position absolute
		z-index 2
		left var(--pos-x)
		top var(--pos-y)
		transform translate( -50%, -50% )
		width 50vh
		height 50vh
		pointer-events none
		overflow hidden
		//outline dashed yellow 1px
		box-shadow 4px 4px 40px 0px rgba(0, 0, 0, 0.1), 4px 11px 10px 0px rgba(0, 0, 0, 0.1)

		.sequence
			position absolute
			--pos-x 20%;
			--pos-y 20%;
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