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
        }
    }
}


// window.addEventListener('click', (event) => {
//   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//   raycaster.setFromCamera(mouse, camera);
//   const intersects = raycaster.intersectObjects(scene.children);
//   if (intersects.length > 0) {
//     let target = intersects[0].point;
//     this.groupId = this.pathfinding.getGroup(this.zone, this.cube.position);
//     const closest = this.pathfinding.getClosestNode(this.cube.position, this.zone, this.groupId);
//     this.navpath = this.pathfinding.findPath(closest.centroid, target, this.zone, this.groupId);
//     console.log("this.pathfinding", this.pathfinding);
//     console.log('Closest centroid:', closest.centroid);
//     console.log('Target:', target);
//     console.log("navpath:", this.navpath);
//     if(this.navpath){
//       // console.log("navpath", this.navpath);
//       this.pathfindingHelper.reset();
//       this.pathfindingHelper.setPlayerPosition(this.cube.position);
//       this.pathfindingHelper.setTargetPosition(target);
//       this.pathfindingHelper.setPath(this.navpath);
//     }
//   }
// })