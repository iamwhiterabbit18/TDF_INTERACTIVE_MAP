import { GLTFLoader } from "three/examples/jsm/Addons.js";

export default class Shiba {
    constructor(scene) {
        this.shiba = new GLTFLoader();
        this.shiba.load('shiba/scene.gltf', (gltfScene) => {
            const mesh = gltfScene.scene;
            mesh.position.set(-3, 1, 2)
            scene.add(mesh);
            return mesh;
        });
    }
}