import * as THREE from 'three';

export default class Plane{
    constructor(scene, width = 30, height = 30, color = 0xff00ff){
        this.planeGeometry = new THREE.PlaneGeometry(width, height);

        this.planeMaterial = new THREE.MeshStandardMaterial({ color: color, side: THREE.DoubleSide });

        this.plane = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
        this.plane.receiveShadow = true;

        this.planeGridHelper = new THREE.GridHelper(width, 10);
        this.planeGridHelper.rotation.x = -0.5 * Math.PI;

        scene.add(this.plane);
        scene.add(this.planeGridHelper);
    }
}