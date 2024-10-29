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
import Click from './utils/Click';


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
    this.scene.add(this.helper);
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

    this.map = new Map(this.scene, this.camera, this.renderer, this.controls);

    // window.addEventListener('mousedown', (event) => {
    //   this.click = new Click(event, this.camera, this.scene);
    // });
  }

}
