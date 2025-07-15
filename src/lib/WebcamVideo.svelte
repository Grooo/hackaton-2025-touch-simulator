<script>
	export let active = false;
	export let webCamElem;

	$: if (active) {
		startCapture();
	}

	function startCapture() {
		navigator.mediaDevices
			.getUserMedia({ 
				audio: false,
				video: { 
					width: { max:320 }, 
					height: { max:240 } 
				}
			})
			.then((mediaStream) => {
				if (webCamElem) {
					webCamElem.srcObject = mediaStream;
					webCamElem.play();
				}
			
			}).catch((err) => {
				console.error('Error:', err);
			});
	}
</script>

<template lang="pug">
	div.webcam
		video(
			bind:this="{webCamElem}"
			playsinline 
		)
			track( 
				kind="captions" 
				src="" 
				default 
			)
		//- 
		div.overlay

</template>

<style lang="stylus">
	@require "../stylus/globals"
	// -
	.webcam
		width auto
		position relative
		pointer-events none
		opacity 0.1
		display none

		video
			width auto
			height 100vh
			transform scaleX(-1)
			object-fit contain

		.overlay
			position absolute
			top 0
			left 0
			width 100%
			height 100%
			background-color #f00
			mix-blend-mode screen
			pointer-events none
	
</style>