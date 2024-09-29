// Experience.js
import * as THREE from 'three';
import { MapControls } from 'three/examples/jsm/controls/MapControls.js';
import Renderer from './Renderer';
import Preloader from './Preloader';
import Plane from './Plane';
import Spotlight from './Spotlight';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

import Map from './Map';
import { GLTFLoader } from "three/examples/jsm/Addons.js";




export default class Experience {
  constructor(container) {
    this.container = container;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    this.camera.position.z = 50;


    this.renderer = new Renderer(this.scene, this.camera, this.container);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.mouseButtons = {
      LEFT: THREE.MOUSE.PAN,
    };
    this.controls.touches = {
      ONE: THREE.TOUCH.PAN,
      TWO: THREE.TOUCH.DOLLY_ROTATE,
    }
    
    this.controls.enableDamping = true;
    // this.controls.screenSpacePanning = true;
    
    this.preloader = new Preloader(this);

    this.spotlight = new Spotlight(this.scene);
    this.map = new Map(this.scene, this.camera);
    // this.plane = new Plane(this.scene);
  }

  // animate() {
  //   requestAnimationFrame(this.animate);

  //   if (this.controls) {
  //       this.controls.update();
  //   }

  //   this.renderer.render();
  // }
}
