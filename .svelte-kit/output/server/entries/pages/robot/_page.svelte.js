import { c as create_ssr_component, a as subscribe, o as onDestroy, v as validate_component, b as add_attribute } from "../../../chunks/ssr.js";
import "mitt";
import { W as WebcamVideo, I as ImageSequence } from "../../../chunks/ImageSequence.js";
import { w as win } from "../../../chunks/store.js";
import "@mediapipe/tasks-vision";
import "tweakpane";
async function stopRecognition() {
}
const css$1 = {
  code: ":root{--black:#181818;--black2:#4b4b4b;--white:#f7f7f7}canvas.svelte-1q3b5km.svelte-1q3b5km{background-color:transparent;height:100vh;height:-webkit-fill-available;left:0;top:0;width:100vw;z-index:3}.video-container.svelte-1q3b5km.svelte-1q3b5km,canvas.svelte-1q3b5km.svelte-1q3b5km{pointer-events:none;position:absolute}.video-container.svelte-1q3b5km.svelte-1q3b5km{box-shadow:4px 4px 40px 0 rgba(0,0,0,.1),4px 11px 10px 0 rgba(0,0,0,.1);height:50vh;overflow:hidden;right:10vw;top:13vh;width:50vh;z-index:2}.video-container.svelte-1q3b5km .sequence.svelte-1q3b5km{position:absolute;--pos-x:0%;--pos-y:0%;height:calc(100% + var(--pos-y)*2);left:calc(var(--pos-x)*-1);top:calc(var(--pos-y)*-1);transform:translate(-50%,-50%);transform:rotate(var(--rotation));transform-origin:50% 50%;width:calc(100% + var(--pos-x)*2)}#enable-webcam.svelte-1q3b5km.svelte-1q3b5km{align-items:center;-webkit-backdrop-filter:blur(50px);backdrop-filter:blur(50px);background-color:rgba(0,0,0,.5);cursor:pointer;display:flex;height:100vh;height:-webkit-fill-available;justify-content:center;left:0;pointer-events:auto;position:absolute;top:0;width:100vw;z-index:4}#enable-webcam.svelte-1q3b5km .button.svelte-1q3b5km{background-color:#ddd;border-radius:5px;color:#222;font-size:1.5rem;padding:10px 20px;transition:all .3s ease}#enable-webcam.svelte-1q3b5km:hover .button.svelte-1q3b5km{background-color:#fff;color:#222}",
  map: `{"version":3,"file":"SceneRobot.svelte","sources":["SceneRobot.svelte"],"sourcesContent":["<script>\\n\\timport {onMount, onDestroy} from 'svelte'\\n\\timport { win } from '$lib/store'\\n\\n\\t// -\\n\\timport WebcamVideo from '$lib/WebcamVideo.svelte'\\n\\timport ImageSequence from '$lib/ImageSequence.svelte'\\n\\timport { startRecognition, stopRecognition } from '$lib/mediapipe/faceRecognizer'\\n\\timport { Pane } from \\"tweakpane\\";\\n\\n\\t// -\\n\\tlet canvasEl = null;\\n\\tlet canvasCtx = null;\\n\\n\\tlet webCamElem = null;\\n\\tlet buttonElem = null;\\n\\n\\n\\tlet isWebcamEnabled = false;\\n\\t\\n\\tlet raf = null;\\n\\n\\tlet videoElem = null;\\n\\tlet sequenceElem = null;\\n\\tlet framePercent = 0;\\n\\tlet frame = 0;\\n\\tconst totalFrames = 26;\\n\\n\\tlet rotation = 0;\\n\\t\\n\\n\\t$: if (isWebcamEnabled) {\\n\\t\\tstartRecognition( webCamElem, render );\\n\\t}\\n\\t// -\\n\\tlet params = {\\n\\t\\tvel: 0.2,\\n\\t\\tmaxVel: 0.2,\\n\\t\\tminVel: 0.04,\\n\\t\\ttranslate: true,\\n\\t\\trotate: true,\\n\\t}\\n\\t// -\\n\\tlet waitingPreview = false;\\n\\n\\tfunction render( rotation, raf) {\\n\\t\\t// \\n\\t\\tif ( raf ){\\n\\t\\t\\tif( rotation ){\\n\\t\\t\\t\\tframePercent = 1-clamp((0.75-rotation.x) * 3, 0, 1);\\n\\t\\t\\t\\tframe = Math.round( framePercent * totalFrames );\\n\\t\\t\\t\\tconsole.log( rotation.x, framePercent, frame );\\n\\t\\t\\t}\\n\\t\\t}\\n\\t}\\n\\n\\tfunction resizeCanvas() {\\n\\t\\t//params.pointerSize = 1.7 / window.innerHeight;\\n\\t\\tcanvasEl.width = $win.w;\\n\\t\\tcanvasEl.height = $win.h;\\n\\t\\t// -\\n\\t\\trotation = {\\n\\t\\t\\tx: 0,\\n\\t\\t\\ty: 0,\\n\\t\\t\\tz: 0\\n\\t\\t}\\n\\t}\\n\\n\\tfunction clamp(value, min, max) {\\n\\t\\treturn Math.max(min, Math.min(value, max));\\n\\t}\\n\\n\\tfunction createControls() {\\n\\t\\tconst pane = new Pane();\\n\\t\\t\\n\\t\\tpane.addBinding( params, \\"vel\\", { min: 0, max: 1, step: 0.01 });\\n\\t\\t//pane.addBinding( params, \\"pointerSize\\", { min: 1, max: 10, step: 0.1 });\\n\\t}\\n\\n\\t\\n\\t// -\\n\\tonMount(() => {\\n\\t\\t//createControls();\\n\\t\\t// -\\n\\t\\tcanvasCtx = canvasEl.getContext(\\"2d\\");\\n\\n\\t\\tresizeCanvas();\\n\\t\\t\\n\\t\\t// - raf = requestAnimationFrame( render );\\n\\t});\\n\\n\\tonDestroy(() => {\\n\\t\\tstopRecognition();\\n\\t});\\n\\n<\/script>\\n\\n<svelte:window on:resize='{resizeCanvas}'/>\\n\\n<WebcamVideo bind:webCamElem active=\\"{isWebcamEnabled}\\"></WebcamVideo><canvas bind:this=\\"{canvasEl}\\" width=\\"{$win.w}\\" height=\\"{$win.h}\\"></canvas><div class=\\"video-container\\"><div class=\\"sequence\\"><ImageSequence bind:sequenceElem src=\\"img/robot/ezgif-frame-[000].webp\\" total=\\"{totalFrames}\\" offset=\\"{38}\\" frame=\\"{frame}\\"></ImageSequence></div></div>{#if !isWebcamEnabled}<div id=\\"enable-webcam\\" on:click=\\"{() => (isWebcamEnabled = true)}\\"><div class=\\"button\\" bind:this=\\"{buttonElem}\\">Enable webcam</div></div>{/if}\\n\\n\\n<style lang=\\"stylus\\">:root{--black:#181818;--black2:#4b4b4b;--white:#f7f7f7}canvas{background-color:transparent;height:100vh;height:-webkit-fill-available;left:0;top:0;width:100vw;z-index:3}.video-container,canvas{pointer-events:none;position:absolute}.video-container{box-shadow:4px 4px 40px 0 rgba(0,0,0,.1),4px 11px 10px 0 rgba(0,0,0,.1);height:50vh;overflow:hidden;right:10vw;top:13vh;width:50vh;z-index:2}.video-container .sequence{position:absolute;--pos-x:0%;--pos-y:0%;height:calc(100% + var(--pos-y)*2);left:calc(var(--pos-x)*-1);top:calc(var(--pos-y)*-1);transform:translate(-50%,-50%);transform:rotate(var(--rotation));transform-origin:50% 50%;width:calc(100% + var(--pos-x)*2)}#enable-webcam{align-items:center;-webkit-backdrop-filter:blur(50px);backdrop-filter:blur(50px);background-color:rgba(0,0,0,.5);cursor:pointer;display:flex;height:100vh;height:-webkit-fill-available;justify-content:center;left:0;pointer-events:auto;position:absolute;top:0;width:100vw;z-index:4}#enable-webcam .button{background-color:#ddd;border-radius:5px;color:#222;font-size:1.5rem;padding:10px 20px;transition:all .3s ease}#enable-webcam:hover .button{background-color:#fff;color:#222}</style>"],"names":[],"mappings":"AAsGqB,KAAK,CAAC,QAAQ,OAAO,CAAC,SAAS,OAAO,CAAC,QAAQ,OAAO,CAAC,oCAAM,CAAC,iBAAiB,WAAW,CAAC,OAAO,KAAK,CAAC,OAAO,sBAAsB,CAAC,KAAK,CAAC,CAAC,IAAI,CAAC,CAAC,MAAM,KAAK,CAAC,QAAQ,CAAC,CAAC,8CAAgB,CAAC,oCAAM,CAAC,eAAe,IAAI,CAAC,SAAS,QAAQ,CAAC,8CAAgB,CAAC,WAAW,GAAG,CAAC,GAAG,CAAC,IAAI,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,EAAE,CAAC,CAAC,GAAG,CAAC,IAAI,CAAC,IAAI,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,EAAE,CAAC,CAAC,OAAO,IAAI,CAAC,SAAS,MAAM,CAAC,MAAM,IAAI,CAAC,IAAI,IAAI,CAAC,MAAM,IAAI,CAAC,QAAQ,CAAC,CAAC,+BAAgB,CAAC,wBAAS,CAAC,SAAS,QAAQ,CAAC,QAAQ,EAAE,CAAC,QAAQ,EAAE,CAAC,OAAO,KAAK,IAAI,CAAC,CAAC,CAAC,IAAI,OAAO,CAAC,CAAC,CAAC,CAAC,CAAC,KAAK,KAAK,IAAI,OAAO,CAAC,CAAC,EAAE,CAAC,CAAC,IAAI,KAAK,IAAI,OAAO,CAAC,CAAC,EAAE,CAAC,CAAC,UAAU,UAAU,IAAI,CAAC,IAAI,CAAC,CAAC,UAAU,OAAO,IAAI,UAAU,CAAC,CAAC,CAAC,iBAAiB,GAAG,CAAC,GAAG,CAAC,MAAM,KAAK,IAAI,CAAC,CAAC,CAAC,IAAI,OAAO,CAAC,CAAC,CAAC,CAAC,CAAC,4CAAc,CAAC,YAAY,MAAM,CAAC,wBAAwB,KAAK,IAAI,CAAC,CAAC,gBAAgB,KAAK,IAAI,CAAC,CAAC,iBAAiB,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,EAAE,CAAC,CAAC,OAAO,OAAO,CAAC,QAAQ,IAAI,CAAC,OAAO,KAAK,CAAC,OAAO,sBAAsB,CAAC,gBAAgB,MAAM,CAAC,KAAK,CAAC,CAAC,eAAe,IAAI,CAAC,SAAS,QAAQ,CAAC,IAAI,CAAC,CAAC,MAAM,KAAK,CAAC,QAAQ,CAAC,CAAC,6BAAc,CAAC,sBAAO,CAAC,iBAAiB,IAAI,CAAC,cAAc,GAAG,CAAC,MAAM,IAAI,CAAC,UAAU,MAAM,CAAC,QAAQ,IAAI,CAAC,IAAI,CAAC,WAAW,GAAG,CAAC,GAAG,CAAC,IAAI,CAAC,6BAAc,MAAM,CAAC,sBAAO,CAAC,iBAAiB,IAAI,CAAC,MAAM,IAAI"}`
};
const totalFrames = 26;
const SceneRobot = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $win, $$unsubscribe_win;
  $$unsubscribe_win = subscribe(win, (value) => $win = value);
  let canvasEl = null;
  let webCamElem = null;
  let buttonElem = null;
  let isWebcamEnabled = false;
  let sequenceElem = null;
  let frame = 0;
  onDestroy(() => {
    stopRecognition();
  });
  $$result.css.add(css$1);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = ` ${validate_component(WebcamVideo, "WebcamVideo").$$render(
      $$result,
      { active: isWebcamEnabled, webCamElem },
      {
        webCamElem: ($$value) => {
          webCamElem = $$value;
          $$settled = false;
        }
      },
      {}
    )}<canvas${add_attribute("width", $win.w, 0)}${add_attribute("height", $win.h, 0)} class="svelte-1q3b5km"${add_attribute("this", canvasEl, 0)}></canvas><div class="video-container svelte-1q3b5km"><div class="sequence svelte-1q3b5km">${validate_component(ImageSequence, "ImageSequence").$$render(
      $$result,
      {
        src: "img/robot/ezgif-frame-[000].webp",
        total: totalFrames,
        offset: 38,
        frame,
        sequenceElem
      },
      {
        sequenceElem: ($$value) => {
          sequenceElem = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div></div>${`<div id="enable-webcam" class="svelte-1q3b5km"><div class="button svelte-1q3b5km"${add_attribute("this", buttonElem, 0)} data-svelte-h="svelte-tcg226">Enable webcam</div></div>`}`;
  } while (!$$settled);
  $$unsubscribe_win();
  return $$rendered;
});
const css = {
  code: ":root{--black:#181818;--black2:#4b4b4b;--white:#f7f7f7}",
  map: `{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<script>\\n\\timport {onMount} from 'svelte'\\n\\timport { win } from '$lib/store'\\n\\t// -\\n\\timport { Canvas } from '@threlte/core'\\n\\timport SceneRobot from '$lib/SceneRobot.svelte'\\n\\n<\/script>\\n\\n\\n<SceneRobot></SceneRobot>\\n\\n\\n<style lang=\\"stylus\\">:root{--black:#181818;--black2:#4b4b4b;--white:#f7f7f7}.canvas-wrapper{height:100vh;height:-webkit-fill-available;left:0;position:absolute;top:0;width:100vw}</style>"],"names":[],"mappings":"AAaqB,KAAK,CAAC,QAAQ,OAAO,CAAC,SAAS,OAAO,CAAC,QAAQ,OAAO"}`
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `${validate_component(SceneRobot, "SceneRobot").$$render($$result, {}, {}, {})}`;
});
export {
  Page as default
};
