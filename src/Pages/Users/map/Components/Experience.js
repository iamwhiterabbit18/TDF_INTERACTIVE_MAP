// Experience.js
import * as THREE from 'three';
import { MapControls } from 'three/examples/jsm/controls/MapControls.js';
import Renderer from './Renderer';
import Plane from './Plane';
import Spotlight from './Spotlight';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

import Map from './Map';
import { GLTFLoader } from "three/examples/jsm/Addons.js";

// import utils when needed
import Click from '@utils/Click';
import DragAndScroll from '@utils/DragAndScroll';


export default class Experience {
  constructor(container) {
    this.container = container;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
    );
    this.helper = new THREE.CameraHelper(this.camera);
    // this.scene.add(this.helper);
    this.camera.position.set(0, 3, 0);
    this.renderer = new Renderer(this.scene, this.camera, this.container);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.mouseButtons = {
      LEFT: THREE.MOUSE.PAN,
    };
    this.controls.touches = {
      ONE: THREE.TOUCH.PAN,
      TWO: THREE.TOUCH.DOLLY_PAN,
    }
    this.controls.enableDamping = true;
    this.controls.enablePan = true;
    this.controls.enableRotate = false;
    this.controls.screenSpacePanning = true;
    this.controls.maxDistance = 3;
    this.controls.minDistance = 1;

    this.map = new Map(this.scene, this.camera, this.renderer, this.controls);

    this.mapBounds = {};
    this.updateMapBounds();

    const originalUpdate = this.controls.update.bind(this.controls);
    this.controls.update = () => {
      originalUpdate();
      this.clampPanning();
    };
    // this.dragAndScroll = new DragAndScroll(this.renderer.domElement, this.camera, this.scene);
    // window.addEventListener('mousedown', (event) => {
    //   this.click = new Click(event, this.camera, this.scene);
    // });

    window.addEventListener('resize', () => this.onWindowResize());
    this.animate();
  }

  // Function to update map bounds based on screen size and camera
  updateMapBounds() {
    const aspect = window.innerWidth / window.innerHeight;
    const visibleHeight = 2 * Math.tan((this.camera.fov * Math.PI) / 360) * this.camera.position.y;
    const visibleWidth = visibleHeight * aspect;

    // Set map bounds dynamically based on visible area
    const mapWidth = 20; // Replace with the actual width of your map asset
    const mapHeight = 10; // Replace with the actual height of your map asset

    this.mapBounds.minX = -mapWidth / 2 + visibleWidth / 2;
    this.mapBounds.maxX = mapWidth / 2 - visibleWidth / 2;
    this.mapBounds.minZ = -mapHeight / 2 + visibleHeight / 2;
    this.mapBounds.maxZ = mapHeight / 2 - visibleHeight / 2;
  }

  clampPanning() {
    const offset = new THREE.Vector3().subVectors(this.camera.position, this.controls.target);

    this.controls.target.x = Math.max(this.mapBounds.minX, Math.min(this.mapBounds.maxX, this.controls.target.x));
    this.controls.target.z = Math.max(this.mapBounds.minZ, Math.min(this.mapBounds.maxZ, this.controls.target.z));

    this.camera.position.set(
      this.controls.target.x + offset.x,
      this.camera.position.y, // Maintain current height
      this.controls.target.z + offset.z
    );
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // Recalculate map bounds for the new screen size
    this.updateMapBounds();
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    this.controls.update(); // Ensure controls are updated
    this.renderer.render(this.scene, this.camera);
  }
}
