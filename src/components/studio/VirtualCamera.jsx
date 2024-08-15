import { useCallback, useEffect, useRef, useState } from "react";
import { VRM, VRMLoaderPlugin } from "@pixiv/three-vrm";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Holistic } from "@mediapipe/holistic";
import { animateVRM } from "./ringing";
import useResizeObserver from "use-resize-observer";
import { lightmode, model, hinata, william, williamModel, hinataModel } from "../../assets";
import { createLocalVideoTrack } from "livekit-client";

const VirtualCamera = ({ selectedCharacter, setCanvasStream }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const resizeRef = useRef(null);
    const sceneRef = useRef(null);
    const clockRef = useRef(new THREE.Clock());
    const vrmRef = useRef(null);
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);
    const canvasStreamRef = useRef(null);
    const loader = useRef(new GLTFLoader());
    const holistic = useRef(
        new Holistic({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5.1675471629/${file}`;
            },
        })
    );
    const size = useResizeObserver({ ref: resizeRef });

    const inferenceLoop = useRef(async () => {
        try {
            await holistic.current.send({ image: videoRef.current });
        } catch (e) {
            console.error("Error in holistic:", e);
            // Reset holistic
            holistic.current = new Holistic({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5.1675471629/${file}`;
                },
            });
            setupHolistic.current();
        }
        setTimeout(inferenceLoop.current, 1000 / 30);
    });

    const animate = useRef(() => {
        requestAnimationFrame(animate.current);
        if (vrmRef.current) {
            vrmRef.current.update(clockRef.current.getDelta());
        }
        rendererRef.current?.render(sceneRef.current, cameraRef.current);
    });

    const setupThreeJS = useCallback(() => {
        if (!canvasRef.current) return; // Shouldn't ever happen
        if (!size.width || !size.height) return;
        if (!selectedCharacter) return;

        loader.current.register((parser) => {
            return new VRMLoaderPlugin(parser);
        });

        sceneRef.current = new THREE.Scene();
        rendererRef.current = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
        });
        cameraRef.current = new THREE.PerspectiveCamera(
            45,
            size.width / size.height,
            0.1,
            1000
        );
        cameraRef.current.position.z = 1;
        cameraRef.current.position.y = 1;
        cameraRef.current.rotation.set(0.0, 0, 0.0);
        const light = new THREE.AmbientLight(0xffffff); // soft white light
        sceneRef.current.add(light);
        const modelMapping = {
            "william": williamModel,
            "hinata": hinataModel
        };
        const character = modelMapping[selectedCharacter];
        loader.current.load(character, (gltf) => {
            const vrm = gltf.userData.vrm;
            vrmRef.current = vrm;
            vrm.scene.rotation.y = Math.PI;
            sceneRef.current?.add(vrm.scene);
            const target = new THREE.Vector3(0, 0, 0);
            vrm.humanoid.humanBones.head.node.getWorldPosition(target);
            cameraRef.current.position.y = target.y;
            var bgTexture = new THREE.TextureLoader().load(lightmode);
            var material = new THREE.SpriteMaterial({
                map: bgTexture,
                color: 0xffffff,
            });
            var sprite = new THREE.Sprite(material);
            sprite.scale.set(10, 7, 7);
            sprite.position.set(0, 1, -5);
            sceneRef.current?.add(sprite);
        });
    }, [size.height, size.width, selectedCharacter]);
	useEffect(() => {
		createLocalVideoTrack({
			facingMode: "environment",
			resolution: { width: 320, height: 240, frameRate: 10 },
		}).then((t) => {
			t.attach(videoRef.current);
			setupHolistic.current();
			inferenceLoop.current();
			animate.current();
		});
	}, []);
    useEffect(() => {
        if (!canvasRef.current) return;
        if (!cameraRef.current) return;
        if (!size.width || !size.height) return;
        canvasRef.current.width = size.width + 1; // prevent pixel line on right
        canvasRef.current.height = size.height;
        rendererRef.current?.setSize(size.width, size.height);
        cameraRef.current.aspect = size.width / size.height;
        cameraRef.current.updateProjectionMatrix();
    }, [size, size.height, size.width]);

    useEffect(() => {
        if (!canvasRef.current) return;
        if (canvasStreamRef.current) return;
        canvasStreamRef.current = canvasRef.current.captureStream(60);
        setCanvasStream(canvasStreamRef.current);
    }, [setCanvasStream]);

    const setupHolistic = useRef(() => {
        holistic.current.setOptions({
            refineFaceLandmarks: true,
        });
        holistic.current.onResults((results) => {
            if (!vrmRef.current) return;
            animateVRM(vrmRef.current, results, videoRef.current);
        });
    });
	useEffect(setupThreeJS, [setupThreeJS]);

        <div className="relative aspect-video rounded-lg overflow-hidden" ref={resizeRef}>
            <canvas
                width={size.width}
                height={size.height}
                className="h-full w-full"
                ref={canvasRef}
            />
            <div className="absolute w-[100px] h-[100px] bottom-2 right-2 overflow-hidden">
                <video className="h-full w-full" ref={videoRef} />
            </div>
        </div>
        
    )
}

export default VirtualCamera;