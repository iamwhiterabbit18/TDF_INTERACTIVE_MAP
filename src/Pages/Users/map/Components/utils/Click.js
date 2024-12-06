// This object is just to get the normalize positions through click event on the map

import * as THREE from "three";

export default class Click {
    constructor(event, camera, scene) {
        this.mouse = new THREE.Vector3();
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




// window.addEventListener('click', (e) => {
//     console.log(e)
//     const container = document.getElementById('container');
//     const mark = document.createElement('div')
//     mark.textContent = "Marker"
//     mark.style.position = 'absolute';
//     mark.style.left = `${e.clientX}px`;
//     mark.style.top = `${e.clientY}px`;
//     mark.style.width = '20px';
//     mark.style.height = '20px';
//     mark.style.backgroundColor = 'blue';
//     mark.style.borderRadius = '50%';
//     mark.style.cursor = 'pointer';
//     mark.style.zIndex = '9999';
//     container.appendChild(mark)
//   });