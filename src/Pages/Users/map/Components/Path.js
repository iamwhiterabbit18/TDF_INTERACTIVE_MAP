import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Pathfinding, PathfindingHelper } from "three-pathfinding";
// array of sites
import positions from "../../../../assets/API/positions";
// import { Line2, LineGeometry, LineMaterial } from "three/examples/jsm/Addons.js";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";

class Path {
    constructor(scene, camera, renderer, controls){

        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;

        this.isAnimatingCam = false;
        this.pathfinding = new Pathfinding();
        this.zone = 'level1';
        this.navmesh = null;
        this.player = null;

        // line for pathfinding direction
        this.arrowPath = null;
        this.arrowMoving = false;
        this.line = null;
        this.points = [];

        this.calculatedPath = null;
        this.isPathValid = false;
        this.currentPathIndex = 0;

    }

    async loadPlayer(){
        const loader = new GLTFLoader();
        const url = 'map/flag.glb';
        const gltf = await new Promise((resolve, reject) => {
            loader.load(url, resolve, undefined, reject);
        });
        this.player = gltf.scene;
        this.player.scale.set(0.05, 0.05, 0.05);
        this.player.position.set(positions[0].position.x, positions[0].position.y, positions[0].position.z);
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
    
        // new functionality TEST
    calculatePath(startPos, targetPos){
        this.calculatedPath = null;
        this.isPathValid = false;
        this.currentPathIndex = 0;

        if (!this.scene || !startPos || !targetPos) {
            console.error("Missing required parameters for path calculation");
            return false;
        }

        // Find positions from input names
        const currentPos = positions.find(pos => pos.name === startPos);
        const destinationPos = positions.find(pos => pos.name === targetPos);

        if (!currentPos || !destinationPos) {
            console.error("Invalid position names provided");
            return false;
        }

        // Convert to Vector3
        const currentVector = new THREE.Vector3(
            currentPos.position.x,
            currentPos.position.y,
            currentPos.position.z
        );
        const destinationVector = new THREE.Vector3(
            destinationPos.position.x,
            destinationPos.position.y,
            destinationPos.position.z
        );

        // Calculate path
        const groupId = this.pathfinding.getGroup(this.zone, currentVector);
        const closest = this.pathfinding.getClosestNode(currentVector, this.zone, groupId);
        const path = this.pathfinding.findPath(closest.centroid, destinationVector, this.zone, groupId);

        if (!path || path.length === 0) {
            console.error("No valid path found");
            return false;
        }

        // Store the full path including start position
        this.calculatedPath = this.calculateFullPath(currentVector, path);
        this.isPathValid = true;

        // Create the initial path visualization
        this.createPathLine(this.calculatedPath);
        
        // Set player to start position
        if (this.player) {
            this.player.position.copy(currentVector);
        }

        this.arrowPath = path.slice();
        this.arrowMoving = true;

        return true;
    }
    moveAlongPath(){
        if (!this.isPathValid || !this.calculatedPath){
            console.error("No valid path found");
            return;
        }
        this.arrowMoving = true;
    }
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
        const validPathPoints = pathPoints.map(point =>
            point instanceof THREE.Vector3 ? point : new THREE.Vector3(point.x, point.y, point.z)
        )
        // current work
        const geometry = new LineGeometry();
        const flatPoints = validPathPoints.flatMap(v => [v.x, v.y, v.z]);
        geometry.setPositions(flatPoints);
        const material = new LineMaterial({ 
            color: '#80C4E9', 
            linewidth: 5,
            resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),});
        // material.defines.USE_DASH = "";
        this.line = new Line2(geometry, material);
        this.line.position.y = this.line.position.y + 0.04;
        this.line.frustumCulled = false;
        this.scene.add(this.line);
        // Store the points for future reference
        this.points = validPathPoints;
    }

    updateArrowPosition() {
        const speed = 0.05;
        if(!this.arrowMoving || !this.calculatedPath || !this.isPathValid){
            return;
        }
        if (this.arrowPath && this.arrowPath.length > 0) {
            const targetPosition = this.arrowPath[0]; // Get the next waypoint
            // const currentPosition = this.points[this.points.length - 1];
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
                    this.isPathValid = false;
                }
            }
            }
    }

    async navigateToPosition(startPos, targetPos){
        const isPathValid = this.calculatePath(startPos, targetPos);
        if(!isPathValid){
            console.error("Failed to calculate valid path @ navigateToPosition");
            return;
        }
        this.moveAlongPath();
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
        // this.updateLineVisibility();
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