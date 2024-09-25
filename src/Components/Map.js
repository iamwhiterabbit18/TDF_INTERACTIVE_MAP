import { GLTFLoader } from "three/examples/jsm/Addons.js";
import * as THREE from 'three';

export default class Map {
    constructor(scene){
        this.map = new GLTFLoader();
        this.map.setPath('map/');
        this.map.load('map.gltf', (gltfScene) => {
            const mesh = gltfScene.scene;
            mesh.rotation.x = 0.5 * Math.PI;
            scene.add(mesh);

            mesh.traverse((object) => {
                if (object.isMesh) {
                  // object.material.extensions = extensions;
                }
              });
        });
    }
}