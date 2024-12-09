import { GLTFLoader, DRACOLoader } from "three/examples/jsm/Addons.js";
import Path from './Path';
import Shiba from "./Shiba";
import * as THREE from 'three';
import Preloader from './Preloader';


export default class Map {
  constructor(scene, camera, renderer, controls) {
    this.preloader = new Preloader();

    this.dracoloader = new DRACOLoader();
    this.dracoloader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

    this.map = new GLTFLoader(this.preloader.loadingManager);
    this.map.setDRACOLoader(this.dracoloader);

    this.map.load('map/map.glb', (gltfScene) => {
      const mesh = gltfScene.scene;
      scene.add(mesh);
      console.log("MESH: ", mesh);
      mesh.traverse((object) => {
          if (object.isMesh) {
          }
        });
    });

    // doggo
    // this.shiba = new Shiba(scene);

      // add pathfinding
      this.pathfinding = new Path(scene, camera, renderer, controls);
      this.pathfinding.init();
  }
}