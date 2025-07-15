import { GestureRecognizer, FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision'

let raf = null;
let positions = [{ x: 0, y: 0 }, { x: 0, y: 0 }];

// - https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker#configurations_options
// 0: wrist, 4: thumb, 8: index, 12: middle, 16: ring, 20: pinky
const P = 8;
const P2 = 4;

export async function startRecognition(webCamElem, onFrame) {
	const recognizer = await createHandLandmarker();
	const renderLoop = () => {
		const result = recognizer.detectForVideo(webCamElem, Date.now());

		// - RIGHT HAND
		if (result?.landmarks[0]) {
			positions[0] = {
				x: 1 - result?.landmarks[0]?.[P].x,
				y: result?.landmarks[0]?.[P].y,
			};

			positions[1] = {
				x: 1 - result?.landmarks[0]?.[P2].x,
				y: result?.landmarks[0]?.[P2].y,
			};
		} else {
			positions = [];
		}

		//const result = recognizer.recognizeForVideo( webCamElem, Date.now() );
		onFrame(positions, raf);
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

async function createGestureRecognizer() {
	const vision = await FilesetResolver.forVisionTasks(
		'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
	);
	return await GestureRecognizer.createFromOptions(vision, {
		baseOptions: {
			modelAssetPath:
				'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task',
			delegate: 'GPU'
		},
		numHands: 2,
		runningMode: 'VIDEO'
	});
}

async function createHandLandmarker() {
	const vision = await FilesetResolver.forVisionTasks(
		'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
	);
	return await HandLandmarker.createFromOptions(vision, {
		baseOptions: {
			modelAssetPath:
				'/tasks/hand_landmarker.task',
			delegate: 'GPU'
		},
		runningMode: 'VIDEO',
		numHands: 2,
		modelComplexity: 1,
		minDetectionConfidence: 0.05,
		minTrackingConfidence: 0.05
	});
}