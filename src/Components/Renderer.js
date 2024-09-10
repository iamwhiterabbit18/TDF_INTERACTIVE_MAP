import * as THREE from 'three';

export default class Renderer{
    constructor(scene, camera, container){
        this.scene = scene;
        this.scene.background = new THREE.Color('#8a8dff');

        this.camera = camera;
        this.container = container;

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.domElement = this.renderer.domElement;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);

        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      }

    
    render() {
        this.renderer.render(this.scene, this.camera);
    }
    dispose(){
        this.renderer.dispose();
        this.container.removeChild(this.renderer.domElement);
    }
}



