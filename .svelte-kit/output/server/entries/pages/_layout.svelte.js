import { c as create_ssr_component, a as subscribe } from "../../chunks/ssr.js";
import { w as win } from "../../chunks/store.js";
const css = {
  code: ":root{--black:#181818;--black2:#4b4b4b;--white:#f7f7f7}*{box-sizing:border-box;margin:0}html{background-color:#000;overflow:hidden;overflow-x:hidden}body{background-color:#000;margin:0!important;overflow:hidden;padding:0}body,main{height:100vh;height:-webkit-fill-available;left:0;position:absolute;top:0;width:100vw}main{background-color:#fff;font-family:Roboto,Open Sans,Helvetica Neue,sans-serif;font-weight:300;letter-spacing:0;word-spacing:0;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}",
  map: `{"version":3,"file":"+layout.svelte","sources":["+layout.svelte"],"sourcesContent":["<script>\\n\\timport {onMount} from 'svelte'\\n\\timport { browser } from '$app/environment'\\n\\timport { win } from '$lib/store'\\n\\t// -\\n\\n\\t// - Resize\\n\\tfunction resizeWindow() {\\n\\t\\t$win.w = window.innerWidth;\\n\\t\\t$win.h = window.innerHeight;\\n\\t\\t//console.log( $win.h / $win.w );\\n\\t}\\n\\t// -\\n\\tonMount(() => {\\n\\t\\t// -\\n\\t\\tresizeWindow();\\n\\t});\\n\\n<\/script>\\n\\n<svelte:window on:resize='{resizeWindow}'/>\\n\\n<main><slot></slot></main>\\n\\n\\n<style lang=\\"stylus\\" global>:global(:root){--black:#181818;--black2:#4b4b4b;--white:#f7f7f7}:global(*){box-sizing:border-box;margin:0}:global(html){background-color:#000;overflow:hidden;overflow-x:hidden}:global(body){background-color:#000;margin:0!important;overflow:hidden;padding:0}:global(body),:global(main){height:100vh;height:-webkit-fill-available;left:0;position:absolute;top:0;width:100vw}:global(main){background-color:#fff;font-family:Roboto,Open Sans,Helvetica Neue,sans-serif;font-weight:300;letter-spacing:0;word-spacing:0;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}</style>"],"names":[],"mappings":"AAyBoC,KAAM,CAAC,QAAQ,OAAO,CAAC,SAAS,OAAO,CAAC,QAAQ,OAAO,CAAS,CAAE,CAAC,WAAW,UAAU,CAAC,OAAO,CAAC,CAAS,IAAK,CAAC,iBAAiB,IAAI,CAAC,SAAS,MAAM,CAAC,WAAW,MAAM,CAAS,IAAK,CAAC,iBAAiB,IAAI,CAAC,OAAO,CAAC,UAAU,CAAC,SAAS,MAAM,CAAC,QAAQ,CAAC,CAAS,IAAK,CAAS,IAAK,CAAC,OAAO,KAAK,CAAC,OAAO,sBAAsB,CAAC,KAAK,CAAC,CAAC,SAAS,QAAQ,CAAC,IAAI,CAAC,CAAC,MAAM,KAAK,CAAS,IAAK,CAAC,iBAAiB,IAAI,CAAC,YAAY,MAAM,CAAC,IAAI,CAAC,IAAI,CAAC,SAAS,CAAC,IAAI,CAAC,UAAU,CAAC,YAAY,GAAG,CAAC,eAAe,CAAC,CAAC,aAAa,CAAC,CAAC,uBAAuB,WAAW,CAAC,wBAAwB,SAAS"}`
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_win;
  $$unsubscribe_win = subscribe(win, (value) => value);
  $$result.css.add(css);
  $$unsubscribe_win();
  return ` <main>${slots.default ? slots.default({}) : ``}</main>`;
});
export {
  Layout as default
};
