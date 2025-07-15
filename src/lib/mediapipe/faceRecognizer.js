import { FilesetResolver, FaceLandmarker } from '@mediapipe/tasks-vision'

let raf = null;
let faceLandmarker = null;
let rotation = { x: 0, y: 0, z: 0 };

const P = 4; // https://storage.googleapis.com/mediapipe-assets/documentation/mediapipe_face_landmark_fullsize.png

export async function startRecognition(webCamElem, onFrame) {
	const recognizer = await createFaceLandmarker();
	const renderLoop = () => {
		const result = recognizer.detectForVideo(webCamElem, Date.now());


		if (result?.faceLandmarks) {
			rotation.x = result?.faceLandmarks[0]?.[P].x;
			rotation.y = result?.faceLandmarks[0]?.[P].y;
			rotation.z = result?.faceLandmarks[0]?.[P].x;
		}

		//const result = recognizer.recognizeForVideo( webCamElem, Date.now() );
		onFrame(rotation, raf);
		raf = requestAnimationFrame(renderLoop);
	};
	webCamElem.addEventListener('loadeddata', renderLoop);
}

export async function stopRecognition() {
	if (raf) {
		cancelAnimationFrame(raf);
		raf = null;
	}
}

async function createFaceLandmarker() {
	const filesetResolver = await FilesetResolver.forVisionTasks(
		"https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
	);
	faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
		baseOptions: {
			modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
			delegate: "GPU"
		},
		outputFaceBlendshapes: true,
		runningMode: 'VIDEO',
		numFaces: 1
	});
	//demosSection.classList.remove("invisible");
	return faceLandmarker;
}
