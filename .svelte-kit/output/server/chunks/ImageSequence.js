import * as THREE from "three";
import { PerspectiveCamera, REVISION } from "three";
import { o as onDestroy, g as getContext, s as setContext, c as create_ssr_component, a as subscribe, v as validate_component, d as get_current_component, f as compute_rest_props, b as add_attribute } from "./ssr.js";
import { d as derived, w as writable } from "./index.js";
const watch = (stores, callback) => {
  const d = derived(stores, (values) => {
    return values;
  });
  let cleanupFn;
  const unsubscribe = d.subscribe(async (values) => {
    if (cleanupFn)
      cleanupFn();
    const fn = await callback(values);
    if (fn)
      cleanupFn = fn;
  });
  onDestroy(() => {
    unsubscribe();
    if (cleanupFn)
      cleanupFn();
  });
};
const defaultCamera = new PerspectiveCamera(75, 0, 0.1, 1e3);
defaultCamera.position.z = 5;
defaultCamera.lookAt(0, 0, 0);
function createObjectStore(object, onChange) {
  const objectStore = writable(object);
  let unwrappedObject = object;
  const unsubscribeObjectStore = objectStore.subscribe((o) => unwrappedObject = o);
  onDestroy(unsubscribeObjectStore);
  const set = (newObject) => {
    if (newObject?.uuid === unwrappedObject?.uuid)
      return;
    const oldObject = unwrappedObject;
    objectStore.set(newObject);
    onChange?.(newObject, oldObject);
  };
  const update = (callback) => {
    const newObject = callback(unwrappedObject);
    if (newObject?.uuid === unwrappedObject?.uuid)
      return;
    const oldObject = unwrappedObject;
    objectStore.set(newObject);
    onChange?.(newObject, oldObject);
  };
  return {
    ...objectStore,
    set,
    update
  };
}
const useThrelte = () => {
  const context = getContext("threlte");
  if (context === void 0) {
    throw new Error("No Threlte context found, are you using this hook inside of <Canvas>?");
  }
  return context;
};
const key = Symbol("threlte-hierarchical-parent-context");
const useParent = () => {
  return getContext(key);
};
const setParent = (context) => {
  return setContext(key, context);
};
const createParentContext = (ref) => {
  const context = createObjectStore(ref);
  setContext(key, context);
  return context;
};
const useHierarchicalObject = () => {
  return {
    onChildMount: getContext("threlte-hierarchical-object-on-mount"),
    onChildDestroy: getContext("threlte-hierarchical-object-on-destroy")
  };
};
const HierarchicalObject = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $parentStore, $$unsubscribe_parentStore;
  let { object = void 0 } = $$props;
  let { onChildMount = void 0 } = $$props;
  const onChildMountProxy = (child) => {
    onChildMount?.(child);
  };
  let { onChildDestroy = void 0 } = $$props;
  const onChildDestroyProxy = (child) => {
    onChildDestroy?.(child);
  };
  const { invalidate } = useThrelte();
  const parentStore = useParent();
  $$unsubscribe_parentStore = subscribe(parentStore, (value) => $parentStore = value);
  let { parent = $parentStore } = $$props;
  const parentCallbacks = useHierarchicalObject();
  if (object) {
    parentCallbacks.onChildMount?.(object);
    invalidate();
  }
  const objectStore = createObjectStore(object, (newObject, oldObject) => {
    if (oldObject) {
      parentCallbacks.onChildDestroy?.(oldObject);
      invalidate();
    }
    if (newObject) {
      parentCallbacks.onChildMount?.(newObject);
      invalidate();
    }
  });
  onDestroy(() => {
    if (object) {
      parentCallbacks.onChildDestroy?.(object);
      invalidate();
    }
  });
  setContext("threlte-hierarchical-object-on-mount", onChildMountProxy);
  setContext("threlte-hierarchical-object-on-destroy", onChildDestroyProxy);
  setParent(objectStore);
  if ($$props.object === void 0 && $$bindings.object && object !== void 0) $$bindings.object(object);
  if ($$props.onChildMount === void 0 && $$bindings.onChildMount && onChildMount !== void 0) $$bindings.onChildMount(onChildMount);
  if ($$props.onChildDestroy === void 0 && $$bindings.onChildDestroy && onChildDestroy !== void 0) $$bindings.onChildDestroy(onChildDestroy);
  if ($$props.parent === void 0 && $$bindings.parent && parent !== void 0) $$bindings.parent(parent);
  parent = $parentStore;
  {
    objectStore.set(object);
  }
  $$unsubscribe_parentStore();
  return `   ${slots.default ? slots.default({}) : ``}`;
});
const SceneGraphObject = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { object } = $$props;
  if ($$props.object === void 0 && $$bindings.object && object !== void 0) $$bindings.object(object);
  return `${validate_component(HierarchicalObject, "HierarchicalObject").$$render(
    $$result,
    {
      object,
      onChildMount: (child) => object.add(child),
      onChildDestroy: (child) => object.remove(child)
    },
    {},
    {
      default: () => {
        return `${slots.default ? slots.default({}) : ``}`;
      }
    }
  )}`;
});
REVISION.replace("dev", "");
const useThrelteInternal = () => {
  return getContext("threlte-internal-context");
};
const contextName = "threlte-disposable-object-context";
const DisposableObject = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $mergedDispose, $$unsubscribe_mergedDispose;
  let $parentDispose, $$unsubscribe_parentDispose;
  const { collectDisposableObjects, addDisposableObjects, removeDisposableObjects } = useThrelteInternal();
  let { object = void 0 } = $$props;
  let previousObject = object;
  let { dispose = void 0 } = $$props;
  const parentDispose = getContext(contextName);
  $$unsubscribe_parentDispose = subscribe(parentDispose, (value) => $parentDispose = value);
  const mergedDispose = writable(dispose ?? $parentDispose ?? true);
  $$unsubscribe_mergedDispose = subscribe(mergedDispose, (value) => $mergedDispose = value);
  setContext(contextName, mergedDispose);
  let disposables = $mergedDispose ? collectDisposableObjects(object) : [];
  addDisposableObjects(disposables);
  onDestroy(() => {
    removeDisposableObjects(disposables);
  });
  if ($$props.object === void 0 && $$bindings.object && object !== void 0) $$bindings.object(object);
  if ($$props.dispose === void 0 && $$bindings.dispose && dispose !== void 0) $$bindings.dispose(dispose);
  {
    mergedDispose.set(dispose ?? $parentDispose ?? true);
  }
  {
    {
      if (object !== previousObject) {
        removeDisposableObjects(disposables);
        disposables = $mergedDispose ? collectDisposableObjects(object) : [];
        addDisposableObjects(disposables);
        previousObject = object;
      }
    }
  }
  $$unsubscribe_mergedDispose();
  $$unsubscribe_parentDispose();
  return `${slots.default ? slots.default({}) : ``}`;
});
const classRegex = /^\s*class\s+/;
const isClass = (input) => {
  if (typeof input !== "function") {
    return false;
  }
  return classRegex.test(input.toString());
};
const argsIsConstructorParameters = (args) => {
  return Array.isArray(args);
};
const determineRef = (is, args) => {
  if (isClass(is)) {
    if (argsIsConstructorParameters(args)) {
      return new is(...args);
    } else {
      return new is();
    }
  }
  return is;
};
const extendsObject3D = (object) => {
  return "isObject3D" in object;
};
const isDisposableObject = (object) => {
  return "dispose" in object;
};
const resolvePropertyPath = (target, propertyPath) => {
  if (propertyPath.includes(".")) {
    const path = propertyPath.split(".");
    const key2 = path.pop();
    for (let i = 0; i < path.length; i += 1) {
      target = target[path[i]];
    }
    return {
      target,
      key: key2
    };
  } else {
    return {
      target,
      key: propertyPath
    };
  }
};
const initialValueBeforeAttach = Symbol("initialValueBeforeAttach");
const useAttach = () => {
  const { invalidate } = useThrelte();
  let isAttached = false;
  let valueBeforeAttach = initialValueBeforeAttach;
  let detachFn;
  let attachedTo;
  let attachedKey;
  const update = (instance, parent, attach) => {
    detach();
    if (!attach) {
      const i = instance;
      const isMaterial = i?.isMaterial || false;
      if (isMaterial) {
        attach = "material";
      }
      const isGeometry = i?.isBufferGeometry || i?.isGeometry || false;
      if (isGeometry) {
        attach = "geometry";
      }
    }
    if (!attach)
      return;
    if (typeof attach === "function") {
      detachFn = attach(parent, instance);
    } else {
      const { target, key: key2 } = resolvePropertyPath(parent, attach);
      valueBeforeAttach = target[key2];
      target[key2] = instance;
      attachedTo = target;
      attachedKey = key2;
    }
    isAttached = true;
    invalidate();
  };
  const detach = () => {
    if (!isAttached)
      return;
    if (detachFn) {
      detachFn();
      detachFn = void 0;
    } else if (attachedTo && attachedKey && valueBeforeAttach !== initialValueBeforeAttach) {
      attachedTo[attachedKey] = valueBeforeAttach;
      valueBeforeAttach = initialValueBeforeAttach;
      attachedTo = void 0;
      attachedKey = void 0;
    }
    isAttached = false;
    invalidate();
  };
  onDestroy(() => {
    detach();
  });
  return {
    update
  };
};
const isCamera = (value) => {
  return value && value.isCamera;
};
const isOrthographicCamera = (value) => {
  return value && value.isOrthographicCamera;
};
const isPerspectiveCamera = (value) => {
  return value && value.isPerspectiveCamera;
};
const isPerspectiveCameraOrOrthographicCamera = (value) => {
  return isPerspectiveCamera(value) || isOrthographicCamera(value);
};
const useCamera = () => {
  const { invalidate, size, camera } = useThrelte();
  let currentInstance;
  let unsubscribe = void 0;
  onDestroy(() => {
    unsubscribe?.();
  });
  const subscriber = (size2) => {
    if (!currentInstance)
      return;
    if (isOrthographicCamera(currentInstance)) {
      currentInstance.left = size2.width / -2;
      currentInstance.right = size2.width / 2;
      currentInstance.top = size2.height / 2;
      currentInstance.bottom = size2.height / -2;
      currentInstance.updateProjectionMatrix();
      currentInstance.updateMatrixWorld();
      invalidate();
    } else if (isPerspectiveCamera(currentInstance)) {
      currentInstance.aspect = size2.width / size2.height;
      currentInstance.updateProjectionMatrix();
      currentInstance.updateMatrixWorld();
      invalidate();
    }
  };
  const update = (instance, manual) => {
    unsubscribe?.();
    if (manual || !isPerspectiveCameraOrOrthographicCamera(instance)) {
      currentInstance = void 0;
      return;
    }
    currentInstance = instance;
    unsubscribe = size.subscribe(subscriber);
  };
  const makeDefaultCamera = (instance, makeDefault) => {
    if (!isCamera(instance) || !makeDefault)
      return;
    camera.set(instance);
    invalidate();
  };
  return {
    update,
    makeDefaultCamera
  };
};
const createRawEventDispatcher = () => {
  const component = get_current_component();
  const dispatchRawEvent = (type, value) => {
    const callbacks = component.$$.callbacks[type];
    if (callbacks) {
      callbacks.forEach((fn) => {
        fn(value);
      });
    }
  };
  const hasEventListener = (type) => {
    return Boolean(component.$$.callbacks[type]);
  };
  Object.defineProperty(dispatchRawEvent, "hasEventListener", {
    value: hasEventListener,
    enumerable: true
  });
  return dispatchRawEvent;
};
const useCreateEvent = () => {
  createRawEventDispatcher();
  const cleanupFunctions = [];
  const updateRef = (newRef) => {
    return;
  };
  onDestroy(() => {
    cleanupFunctions.forEach((cleanup) => cleanup());
  });
  return {
    updateRef
  };
};
const isEventDispatcher = (value) => {
  return !!value?.addEventListener;
};
const useEvents = () => {
  const dispatch = createRawEventDispatcher();
  get_current_component();
  const eventHandlerProxy = (event) => {
    if (event?.type) {
      dispatch(event.type, event);
    }
  };
  const cleanupEventListeners = (ref2, events) => {
    if (isEventDispatcher(ref2)) {
      events.forEach((eventName) => {
        ref2.removeEventListener(eventName, eventHandlerProxy);
      });
    }
  };
  const addEventListeners = (ref2, events) => {
    if (isEventDispatcher(ref2)) {
      events.forEach((eventName) => {
        ref2.addEventListener(eventName, eventHandlerProxy);
      });
    }
  };
  const ref = writable();
  const eventNames = writable([]);
  watch([ref, eventNames], ([$ref, $eventNames]) => {
    addEventListeners($ref, $eventNames);
    return () => cleanupEventListeners($ref, $eventNames);
  });
  const updateRef = (newRef) => {
    ref.set(newRef);
  };
  return {
    updateRef
  };
};
const usePlugins = (params) => {
  const pluginContextName = "threlte-plugin-context";
  const plugins = getContext(pluginContextName);
  if (!plugins)
    return;
  const pluginsReturns = Object.values(plugins).map((plugin) => plugin(params)).filter(Boolean);
  const pluginsProps = pluginsReturns.flatMap((callback) => callback.pluginProps ?? []);
  let refCleanupCallbacks = [];
  onDestroy(() => {
    refCleanupCallbacks.forEach((callback) => callback());
  });
  const updateRef = (ref) => {
    refCleanupCallbacks.forEach((callback) => callback());
    refCleanupCallbacks = [];
    pluginsReturns.forEach((callback) => {
      const cleanupCallback = callback.onRefChange?.(ref);
      if (cleanupCallback) {
        refCleanupCallbacks.push(cleanupCallback);
      }
    });
  };
  const updateProps = (props) => {
    pluginsReturns.forEach((callback) => {
      callback.onPropsChange?.(props);
    });
  };
  const updateRestProps = (restProps) => {
    pluginsReturns.forEach((callback) => {
      callback.onRestPropsChange?.(restProps);
    });
  };
  return {
    updateRef,
    updateProps,
    updateRestProps,
    pluginsProps
  };
};
const ignoredProps = /* @__PURE__ */ new Set(["$$scope", "$$slots", "type", "args", "attach", "instance"]);
const updateProjectionMatrixKeys = /* @__PURE__ */ new Set([
  "fov",
  "aspect",
  "near",
  "far",
  "left",
  "right",
  "top",
  "bottom",
  "zoom"
]);
const memoizeProp = (value) => {
  if (typeof value === "string")
    return true;
  if (typeof value === "number")
    return true;
  if (typeof value === "boolean")
    return true;
  if (typeof value === "undefined")
    return true;
  if (value === null)
    return true;
  return false;
};
const createSetter = (target, key2, value) => {
  if (!Array.isArray(value) && typeof value === "number" && typeof target[key2]?.setScalar === "function" && // colors do have a setScalar function, but we don't want to use it, because
  // the hex notation (i.e. 0xff0000) is very popular and matches the number
  // type. So we exclude colors here.
  !target[key2]?.isColor) {
    return (target2, key3, value2) => {
      target2[key3].setScalar(value2);
    };
  } else {
    if (typeof target[key2]?.set === "function") {
      if (Array.isArray(value)) {
        return (target2, key3, value2) => {
          target2[key3].set(...value2);
        };
      } else {
        return (target2, key3, value2) => {
          target2[key3].set(value2);
        };
      }
    } else {
      return (target2, key3, value2) => {
        target2[key3] = value2;
      };
    }
  }
};
const useProps = () => {
  const { invalidate } = useThrelte();
  const memoizedProps = /* @__PURE__ */ new Map();
  const memoizedSetters = /* @__PURE__ */ new Map();
  const setProp = (instance, propertyPath, value, options) => {
    if (memoizeProp(value)) {
      const memoizedProp = memoizedProps.get(propertyPath);
      if (memoizedProp && memoizedProp.instance === instance && memoizedProp.value === value) {
        return;
      }
      memoizedProps.set(propertyPath, {
        instance,
        value
      });
    }
    const { key: key2, target } = resolvePropertyPath(instance, propertyPath);
    if (value !== void 0 && value !== null) {
      const memoizedSetter = memoizedSetters.get(propertyPath);
      if (memoizedSetter) {
        memoizedSetter(target, key2, value);
      } else {
        const setter = createSetter(target, key2, value);
        memoizedSetters.set(propertyPath, setter);
        setter(target, key2, value);
      }
    } else {
      createSetter(target, key2, value)(target, key2, value);
    }
    if (options.manualCamera)
      return;
    if (updateProjectionMatrixKeys.has(key2) && (target.isPerspectiveCamera || target.isOrthographicCamera)) {
      target.updateProjectionMatrix();
    }
  };
  const updateProps = (instance, props, options) => {
    for (const key2 in props) {
      if (!ignoredProps.has(key2) && !options.pluginsProps?.includes(key2)) {
        setProp(instance, key2, props[key2], options);
      }
      invalidate();
    }
  };
  return {
    updateProps
  };
};
const T = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["is", "args", "attach", "manual", "makeDefault", "dispose", "ref"]);
  let $parent, $$unsubscribe_parent;
  let { is } = $$props;
  let { args = void 0 } = $$props;
  let { attach = void 0 } = $$props;
  let { manual = void 0 } = $$props;
  let { makeDefault = void 0 } = $$props;
  let { dispose = void 0 } = $$props;
  const parent = useParent();
  $$unsubscribe_parent = subscribe(parent, (value) => $parent = value);
  const createEvent = useCreateEvent();
  let ref = determineRef(is, args);
  createEvent.updateRef(ref);
  let initialized = false;
  const maybeSetRef = () => {
    if (!initialized) {
      initialized = true;
      return;
    }
    ref = determineRef(is, args);
    createEvent.updateRef(ref);
  };
  let { ref: publicRef = ref } = $$props;
  const parentContext = createParentContext(ref);
  const plugins = usePlugins({ ref, props: $$props });
  const pluginsProps = plugins?.pluginsProps ?? [];
  const props = useProps();
  const camera = useCamera();
  const attachment = useAttach();
  const events = useEvents();
  if ($$props.is === void 0 && $$bindings.is && is !== void 0) $$bindings.is(is);
  if ($$props.args === void 0 && $$bindings.args && args !== void 0) $$bindings.args(args);
  if ($$props.attach === void 0 && $$bindings.attach && attach !== void 0) $$bindings.attach(attach);
  if ($$props.manual === void 0 && $$bindings.manual && manual !== void 0) $$bindings.manual(manual);
  if ($$props.makeDefault === void 0 && $$bindings.makeDefault && makeDefault !== void 0) $$bindings.makeDefault(makeDefault);
  if ($$props.dispose === void 0 && $$bindings.dispose && dispose !== void 0) $$bindings.dispose(dispose);
  if ($$props.ref === void 0 && $$bindings.ref && publicRef !== void 0) $$bindings.ref(publicRef);
  {
    maybeSetRef();
  }
  publicRef = ref;
  {
    parentContext.set(ref);
  }
  {
    props.updateProps(ref, $$restProps, { manualCamera: manual, pluginsProps });
  }
  {
    camera.update(ref, manual);
  }
  {
    camera.makeDefaultCamera(ref, makeDefault);
  }
  {
    attachment.update(ref, $parent, attach);
  }
  {
    events.updateRef(ref);
  }
  {
    plugins?.updateRef(ref);
  }
  {
    plugins?.updateProps($$props);
  }
  {
    plugins?.updateRestProps($$restProps);
  }
  $$unsubscribe_parent();
  return `${isDisposableObject(ref) ? `${validate_component(DisposableObject, "DisposableObject").$$render($$result, { object: ref, dispose }, {}, {})}` : ``} ${extendsObject3D(ref) ? `${validate_component(SceneGraphObject, "SceneGraphObject").$$render($$result, { object: ref }, {}, {
    default: () => {
      return `${slots.default ? slots.default({ ref }) : ``}`;
    }
  })}` : `${slots.default ? slots.default({ ref }) : ``}`}`;
});
const catalogue = {};
const augmentConstructorArgs = (args, is) => {
  const module = catalogue[is] || THREE[is];
  if (!module) {
    throw new Error(`No Three.js module found for ${is}. Did you forget to extend the catalogue?`);
  }
  return {
    ...args,
    props: {
      ...args.props,
      is: module
    }
  };
};
const proxyTConstructor = (is) => {
  return new Proxy(class {
  }, {
    construct(_, [args]) {
      const castedArgs = args;
      return new T(augmentConstructorArgs(castedArgs, is));
    }
  });
};
new Proxy(class {
}, {
  construct(_, [args]) {
    const castedArgs = args;
    return new T(castedArgs);
  },
  get(_, is) {
    return proxyTConstructor(is);
  }
});
const css$1 = {
  code: ":root{--black:#181818;--black2:#4b4b4b;--white:#f7f7f7}.webcam.svelte-1r4auhz.svelte-1r4auhz{display:none;opacity:.1;pointer-events:none;position:relative;width:auto}.webcam.svelte-1r4auhz video.svelte-1r4auhz{height:100vh;-o-object-fit:contain;object-fit:contain;transform:scaleX(-1);width:auto}.webcam.svelte-1r4auhz .overlay.svelte-1r4auhz{background-color:red;height:100%;left:0;mix-blend-mode:screen;pointer-events:none;position:absolute;top:0;width:100%}",
  map: `{"version":3,"file":"WebcamVideo.svelte","sources":["WebcamVideo.svelte"],"sourcesContent":["<script>\\n\\texport let active = false;\\n\\texport let webCamElem;\\n\\n\\t$: if (active) {\\n\\t\\tstartCapture();\\n\\t}\\n\\n\\tfunction startCapture() {\\n\\t\\tnavigator.mediaDevices\\n\\t\\t\\t.getUserMedia({ \\n\\t\\t\\t\\taudio: false,\\n\\t\\t\\t\\tvideo: { \\n\\t\\t\\t\\t\\twidth: { max:320 }, \\n\\t\\t\\t\\t\\theight: { max:240 } \\n\\t\\t\\t\\t}\\n\\t\\t\\t})\\n\\t\\t\\t.then((mediaStream) => {\\n\\t\\t\\t\\tif (webCamElem) {\\n\\t\\t\\t\\t\\twebCamElem.srcObject = mediaStream;\\n\\t\\t\\t\\t\\twebCamElem.play();\\n\\t\\t\\t\\t}\\n\\t\\t\\t\\n\\t\\t\\t}).catch((err) => {\\n\\t\\t\\t\\tconsole.error('Error:', err);\\n\\t\\t\\t});\\n\\t}\\n<\/script>\\n\\n<div class=\\"webcam\\"><video bind:this=\\"{webCamElem}\\" playsinline><track kind=\\"captions\\" src=\\"\\" default></video><div class=\\"overlay\\"></div></div>\\n\\n<style lang=\\"stylus\\">:root{--black:#181818;--black2:#4b4b4b;--white:#f7f7f7}.webcam{display:none;opacity:.1;pointer-events:none;position:relative;width:auto}.webcam video{height:100vh;-o-object-fit:contain;object-fit:contain;transform:scaleX(-1);width:auto}.webcam .overlay{background-color:red;height:100%;left:0;mix-blend-mode:screen;pointer-events:none;position:absolute;top:0;width:100%}</style>"],"names":[],"mappings":"AA+BqB,KAAK,CAAC,QAAQ,OAAO,CAAC,SAAS,OAAO,CAAC,QAAQ,OAAO,CAAC,qCAAO,CAAC,QAAQ,IAAI,CAAC,QAAQ,EAAE,CAAC,eAAe,IAAI,CAAC,SAAS,QAAQ,CAAC,MAAM,IAAI,CAAC,sBAAO,CAAC,oBAAK,CAAC,OAAO,KAAK,CAAC,cAAc,OAAO,CAAC,WAAW,OAAO,CAAC,UAAU,OAAO,EAAE,CAAC,CAAC,MAAM,IAAI,CAAC,sBAAO,CAAC,uBAAQ,CAAC,iBAAiB,GAAG,CAAC,OAAO,IAAI,CAAC,KAAK,CAAC,CAAC,eAAe,MAAM,CAAC,eAAe,IAAI,CAAC,SAAS,QAAQ,CAAC,IAAI,CAAC,CAAC,MAAM,IAAI"}`
};
const WebcamVideo = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { active = false } = $$props;
  let { webCamElem } = $$props;
  function startCapture() {
    navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        width: { max: 320 },
        height: { max: 240 }
      }
    }).then((mediaStream) => {
      if (webCamElem) {
        webCamElem.srcObject = mediaStream;
        webCamElem.play();
      }
    }).catch((err) => {
      console.error("Error:", err);
    });
  }
  if ($$props.active === void 0 && $$bindings.active && active !== void 0) $$bindings.active(active);
  if ($$props.webCamElem === void 0 && $$bindings.webCamElem && webCamElem !== void 0) $$bindings.webCamElem(webCamElem);
  $$result.css.add(css$1);
  {
    if (active) {
      startCapture();
    }
  }
  return `<div class="webcam svelte-1r4auhz"><video playsinline class="svelte-1r4auhz"${add_attribute("this", webCamElem, 0)} data-svelte-h="svelte-1ptj5e1"><track kind="captions" src="" default></video><div class="overlay svelte-1r4auhz"></div></div>`;
});
const css = {
  code: ":root{--black:#181818;--black2:#4b4b4b;--white:#f7f7f7}img.svelte-1nnks5z,picture.svelte-1nnks5z{display:block;height:100%;-o-object-fit:cover;object-fit:cover;position:relative;width:100%}",
  map: '{"version":3,"file":"ImageSequence.svelte","sources":["ImageSequence.svelte"],"sourcesContent":["<script>\\n\\timport {onMount, onDestroy} from \'svelte\'\\n\\timport { win } from \'$lib/store\'\\n\\n\\texport let src = null;\\n\\texport let offset = 0;\\n\\texport let total = 1;\\n\\texport let frame = 0;\\n\\n\\tlet currentFrameSrc = null;\\n\\n\\t$: currentFrameSrc = `${src.replace(\'[000]\', `${(frame+offset).toString().padStart(3, \'0\')}`)}`;\\n\\n\\t$: preloadFrames = Array.from({length: total}, (_, i) => `${src.replace(\'[000]\', `${(i+offset).toString().padStart(3, \'0\')}`)}`);\\n\\n\\tonMount(() => {\\n\\t\\tpreloadFrames.forEach(frame => {\\n\\t\\t\\tconst img = new Image();\\n\\t\\t\\timg.src = frame;\\n\\t\\t});\\n\\t});\\n<\/script>\\n\\n<picture><source srcset=\\"{currentFrameSrc}\\" type=\\"image/webp\\"><img src=\\"{currentFrameSrc}\\"></picture>\\n\\n<style lang=\\"stylus\\">:root{--black:#181818;--black2:#4b4b4b;--white:#f7f7f7}img,picture{display:block;height:100%;-o-object-fit:cover;object-fit:cover;position:relative;width:100%}</style>"],"names":[],"mappings":"AAyBqB,KAAK,CAAC,QAAQ,OAAO,CAAC,SAAS,OAAO,CAAC,QAAQ,OAAO,CAAC,kBAAG,CAAC,sBAAO,CAAC,QAAQ,KAAK,CAAC,OAAO,IAAI,CAAC,cAAc,KAAK,CAAC,WAAW,KAAK,CAAC,SAAS,QAAQ,CAAC,MAAM,IAAI"}'
};
const ImageSequence = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { src = null } = $$props;
  let { offset = 0 } = $$props;
  let { total = 1 } = $$props;
  let { frame = 0 } = $$props;
  let currentFrameSrc = null;
  if ($$props.src === void 0 && $$bindings.src && src !== void 0) $$bindings.src(src);
  if ($$props.offset === void 0 && $$bindings.offset && offset !== void 0) $$bindings.offset(offset);
  if ($$props.total === void 0 && $$bindings.total && total !== void 0) $$bindings.total(total);
  if ($$props.frame === void 0 && $$bindings.frame && frame !== void 0) $$bindings.frame(frame);
  $$result.css.add(css);
  currentFrameSrc = `${src.replace("[000]", `${(frame + offset).toString().padStart(3, "0")}`)}`;
  Array.from({ length: total }, (_, i) => `${src.replace("[000]", `${(i + offset).toString().padStart(3, "0")}`)}`);
  return `<picture class="svelte-1nnks5z"><source${add_attribute("srcset", currentFrameSrc, 0)} type="image/webp"><img${add_attribute("src", currentFrameSrc, 0)} class="svelte-1nnks5z"></picture>`;
});
export {
  ImageSequence as I,
  WebcamVideo as W
};
