import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Pathfinding, PathfindingHelper } from "three-pathfinding";
// array of sites
import positions from "../../../../assets/API/positions";
import { Line2, LineGeometry, LineMaterial } from "three/examples/jsm/Addons.js";

class Path {
    constructor(scene, camera, renderer, controls){

        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;

        // this.targetLookAt = new THREE.Vector3(0, 30, 0);
        this.isAnimatingCam = false;
        this.pathfinding = new Pathfinding();
        // include pathfindingHelper here if needed in the future
        this.zone = 'level1';
        this.navmesh = null;
        this.player = null;

        // line for pathfinding direction
        this.arrowPath = null;
        this.arrowMoving = false;
        this.line = null;
        this.points = [];

    }

    async loadPlayer(){
        const loader = new GLTFLoader();
        const url = 'map/flag.glb';
        const gltf = await new Promise((resolve, reject) => {
            loader.load(url, resolve, undefined, reject);
        });
        this.player = gltf.scene;
        this.player.scale.set(0.05, 0.05, 0.05);
        this.player.position.set(positions[5].position.x, positions[5].position.y, positions[5].position.z);
        this.scene.add(this.player);
    }

    // create navmesh
    async createNavmesh() {
        const loader = new GLTFLoader();
        const url = 'map/navmesh.glb';
        const gltf = await new Promise((resolve, reject) => {
            loader.load(url, resolve, undefined, reject);
        });
        this.mesh = gltf.scene;
        this.scene.add(this.mesh);
        
        this.mesh.traverse((object) => {
            this.navmesh = object;
            // const wire = new THREE.Mesh(
            //     object.geometry,
            //     new THREE.MeshBasicMaterial({
            //         color: 0x00ff00,
            //         wireframe: true})
            //     );
            // this.scene.add(wire);
            if (this.navmesh.geometry) {
                const zoneData = Pathfinding.createZone(this.navmesh.geometry);
                this.pathfinding.setZoneData(this.zone, zoneData);
            }
        });
    }
    
    // create cube
    createCube(pos) {
        let cube;
        if(this.scene){
            const cubeGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
            const cubeMaterial = new THREE.MeshBasicMaterial({ color: pos.color });
            cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.position.set(pos.position.x, pos.position.y, pos.position.z);
            cube.name = pos.name;
            cube.color = pos.color;
            cube.visible = false; //comment this out to see sites locations
            this.scene.add(cube);
            console.log(cube);
        }
        else{
            console.log('no cube');
        }
    }
    // create cubes sites
    createCubes(){
        positions.forEach((pos) => {
            this.createCube(pos);
        });
    }
    
    // pathfinding method
    // animateCamera(target = this.targetLookAt, onComplete){
    //     const startLookAt = new THREE.Vector3();
    //     this.camera.getWorldDirection(startLookAt);

    //     const duration = 1.5;
    //     let elapsedTime = 0;
    
    //     const step = (deltaTime) =>{
    //         elapsedTime += deltaTime;
    //         const t = Math.min(elapsedTime / duration, 1);
    //         this.camera.lookAt(startLookAt.clone().lerp(target, t));

    //         if(t < 1){
    //             requestAnimationFrame(step);
    //         }
    //         else{
    //             this.isAnimatingCam = false;
    //             onComplete && onComplete();
    //         }
    //     };
    //     this.isAnimatingCam = true;
    //     step(0);
    // }
    moveArrow(startPos, targetPos) {
    
        if(this.scene && startPos && targetPos){
          // Find name of current and destination
          const currentPos = positions.find(pos => pos.name === startPos);
          const destinationPos = positions.find(pos => pos.name === targetPos);
    
          // convert to Vector3
          if(currentPos && destinationPos){
    
            const currentVector = this.player ? this.player.position.clone() : new THREE.Vector3(currentPos.position.x, currentPos.position.y, currentPos.position.z);
            const destinationVector = new THREE.Vector3(destinationPos.position.x, destinationPos.position.y, destinationPos.position.z);
    
            // Create or update the arrow direction and helper
            const groupId = this.pathfinding.getGroup(this.zone, currentVector);
            const closest = this.pathfinding.getClosestNode(currentVector, this.zone, groupId);
            const path = this.pathfinding.findPath(closest.centroid, destinationVector, this.zone, groupId);
            // console.log(path);
            if (path && path.length > 0) {
              console.log("Found Path: ", path);
              this.arrowPath = path.slice();
              this.points = [currentVector.clone()];
              const fullPath = this.calculateFullPath(currentVector, path);
              this.createPathLine(fullPath);
              this.arrowMoving = true;

              
              // // create o update the arrow helper
    
              // if(!currentArrow){
              //   currentArrow = new THREE.ArrowHelper(new THREE.Vector3(), startPos, 0.5, 0xffff00);
              //   scene.add(currentArrow);
              // }
              // currentArrow.position.copy(startPos);
              
    
              const geometry = new THREE.BufferGeometry().setFromPoints(this.points);
              const material = new THREE.LineBasicMaterial({ color: 0xffff00});
    
              if(!this.line){
                const lineGeometry = new LineGeometry();
                this.line = new THREE.Line(geometry, material);
                this.line.position.y = this.line.position.y + 0.04;
                this.line.frustumCulled = false;
                this.scene.add(this.line);
              }
              else{
                this.line.geometry.setFromPoints(this.points);
              }
            }else {
              console.log("No path found");
            }
          }
        }
    }

    // new functionality TEST
    calculateFullPath(startPoint, pathPoints){
        const fullPath = [startPoint.clone()];
        // add all path points
        pathPoints.forEach(point => {
            fullPath.push(new THREE.Vector3(point.x, point.y, point.z));
        });

        return fullPath;
    }
    createPathLine(pathPoints){
        // remove any existing line
        if(this.line) {
            this.scene.remove(this.line);
            this.line.geometry.dispose();
            this.line.material.dispose();
            this.line = null;
        }
        
        const geometry = new THREE.BufferGeometry().setFromPoints(pathPoints);
        const material = new THREE.LineBasicMaterial({ color: 0xffff00 });
        
        this.line = new THREE.Line(geometry, material);
        this.line.position.y = this.line.position.y + 0.04;
        this.line.frustumCulled = false;
        this.scene.add(this.line);
        
        // Store the points for future reference
        this.points = pathPoints;
    }

    updateArrowPosition() {
        const speed = 0.05;
        if (this.arrowMoving && this.arrowPath && this.arrowPath.length > 0) {
            const targetPosition = this.arrowPath[0]; // Get the next waypoint
            const currentPosition = this.player ? this.player.position.clone() : this.points[this.points.length - 1];
            const direction = new THREE.Vector3().subVectors(targetPosition, currentPosition).normalize();
            const step = direction.clone().multiplyScalar(speed);
            const nextPosition = currentPosition.clone().add(step);

            if (this.player) {
                this.player.position.copy(nextPosition); // Move the asset to the new point
            }

            if(nextPosition.distanceTo(targetPosition) < speed){
                this.arrowPath.shift();
                if(this.arrowPath.length === 0){
                    console.log('arrived');
                    this.arrowMoving = false;
                }
            }
            }
    }
    isPointInView(point) {
        const frutsum = new THREE.Frustum();
        const cameraViewProjectionMatrix = new THREE.Matrix4();

        // update frutsum
        this.camera.updateMatrixWorld();
        cameraViewProjectionMatrix.multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse);
        frutsum.setFromProjectionMatrix(cameraViewProjectionMatrix);


        return frutsum.containsPoint(point);
    }
    updateLineVisibility() {
        if(this.points.length > 0){
            const pathInView = this.points.some(point => this.isPointInView(point));

            if(this.line){
                this.line.visible = pathInView;
            }
        }
    }
    dispose(){
        if(this.line){
            this.scene.remove(this.line);
            this.line.geometry.dispose();
            this.line.material.dispose();
            this.line = null;
        }
        this.points = [];
        this.arrowPath = [];
        this.arrowMoving = false;
    }

    
    // animate pathfinding line
    animate = ()=> {
        requestAnimationFrame(this.animate);

        this.updateArrowPosition();
        this.updateLineVisibility();
        this.renderer.render(this.scene, this.camera);
    }

    // instantiate pathfinding
    init(){
        this.createNavmesh();
        this.createCubes();
        this.loadPlayer();
        this.animate();
    }

}

export default Path;