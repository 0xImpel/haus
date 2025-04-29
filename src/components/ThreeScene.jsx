import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ThreeScene = ({ habits, setView }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);

    const loader = new GLTFLoader();
    loader.load(
      '/models/House.glb',
      (gltf) => {
        scene.add(gltf.scene);
      },
      undefined,
      (error) => console.error('Error loading house model:', error)
    );

    loader.load(
      '/models/brick.glb',
      (gltf) => {
        const brick = gltf.scene;
        scene.add(brick);
        habits.forEach((habit, index) => {
          if (habit.completed) {
            const brickClone = brick.clone();
            brickClone.position.set(index * 2, 0, 0);
            scene.add(brickClone);
          }
        });
      },
      undefined,
      (error) => console.error('Error loading brick model:', error)
    );

    // Camera controls
    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(0, 5, 10);
    controls.update();

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [habits]);

  return (
    <div className="relative min-h-screen">
      <div ref={mountRef}></div>
      <button
        onClick={() => setView('home')}
        className="absolute top-4 left-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
      >
        Back to Home
      </button>
    </div>
  );
};

export default ThreeScene;