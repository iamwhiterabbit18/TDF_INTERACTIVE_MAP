import * as THREE from 'three';

export default class Spotlight{
    constructor(scene, color = 0xffffff, intensity = 100){
        this.spotLight = new THREE.SpotLight(0xffffff, 100);
        this.spotLight.position.set(-20, 20, 10);
        this.spotLight.castShadow = true;

        this.sLightHelper = new THREE.SpotLightHelper(this.spotLight);
        this.sLightShadowHelper = new THREE.CameraHelper(this.spotLight.shadow.camera);

        // scene.add(this.spotLight);
        // scene.add(this.sLightHelper);
        // scene.add(this.sLightShadowHelper);
    }
}