// This object is just to get the normalize positions through click event on the map

import * as THREE from "three";

export default class Click {
    constructor(event, camera, scene) {
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();

        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, camera);
        
        const intersects = this.raycaster.intersectObjects(scene.children, true);

        if(intersects.length > 0) {
            const intersectionPoint = intersects[0].point;
            console.log('Interection Point:', intersectionPoint);
            console.log('Intersection Object:', intersects[0].object);
        }
    }
}