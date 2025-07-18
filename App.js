import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

const Portfolio3D = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const particlesRef = useRef(null);
  const frameId = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    scene.fog = new THREE.Fog(0x0a1e3f, 1, 100);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 200;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.8,
      color: 0x2a7de1,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    const shapes = [];
    for (let i = 0; i < 20; i++) {
      const geometry = Math.random() > 0.5
        ? new THREE.BoxGeometry(0.5, 0.5, 0.5)
        : new THREE.SphereGeometry(0.3, 16, 16);

      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(Math.random(), 0.7, 0.5),
        transparent: true,
        opacity: 0.3,
        wireframe: true,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50
      );
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      shapes.push(mesh);
      scene.add(mesh);
    }

    camera.position.z = 30;

    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;
    particlesRef.current = particlesMesh;

    const animate = () => {
      frameId.current = requestAnimationFrame(animate);

      if (particlesRef.current) {
        particlesRef.current.rotation.x += 0.0005;
        particlesRef.current.rotation.y += 0.0005;
      }

      shapes.forEach((shape, index) => {
        shape.rotation.x += 0.005 + index * 0.0001;
        shape.rotation.y += 0.005 + index * 0.0001;
        shape.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    setTimeout(() => setIsLoading(false), 2000);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameId.current) cancelAnimationFrame(frameId.current);
      if (rendererRef.current) rendererRef.current.dispose();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      />
      {!isLoading ? (
        <div className="relative z-10 text-white text-center pt-40">
          <h1 className="text-5xl font-bold mb-4">Hi, I'm Rohit Thapa</h1>
          <p className="text-xl">Web Developer & Multimedia Artist</p>
        </div>
      ) : (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black">
          <div className="text-white text-xl animate-pulse">Loading Portfolio...</div>
        </div>
      )}
    </div>
  );
};

export default Portfolio3D;

