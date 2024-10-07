import { GLTFLoader, DRACOLoader } from "three/examples/jsm/Addons.js";
import { Pathfinding, PathfindingHelper } from 'three-pathfinding';
import Shiba from "./Shiba";
import * as THREE from 'three';
import Preloader from './Preloader';

export default class Map {
    constructor(scene, camera) {
        this.preloader = new Preloader();

        this.dracoloader = new DRACOLoader();
        this.dracoloader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

        this.map = new GLTFLoader(this.preloader.loadingManager);
        this.map.setDRACOLoader(this.dracoloader);

        this.map.load('map/try.glb', (gltfScene) => {
          const mesh = gltfScene.scene;
          mesh.rotation.x = 0.5 * Math.PI;
          scene.add(mesh);

          mesh.traverse((object) => {
              if (object.isMesh) {
                // console.log(object);
              }
            });
        });

      // doggo
      // this.shiba = new Shiba(scene);
      // this.cube  = new THREE.Mesh(
      //   new THREE.BoxGeometry(1, 1, 1),
      //   new THREE.MeshNormalMaterial()
      // )
      // this.cube.position.set(-8, 3, 2);
      // scene.add(this.cube);


        this.pathfinding = new Pathfinding();
        this.pathfindingHelper = new PathfindingHelper();
        scene.add(this.pathfindingHelper);
        this.zone = 'level1';
        this.navmesh = null;
        this.groupId = null;
        this.navpath = null;
        this.map.load('map/scene.glb', (gltfScene) => {
          const mesh = gltfScene.scene;
          // scene.add(mesh);
          mesh.traverse(object =>{
            if(!this.navmesh && object.isObject3D && object.children && object.children.length > 0){
              this.navmesh = object.children[0].children[5];
              // change this one if fixed
              // console.log(this.navmesh.children[0].children[5]);
              if(this.navmesh){
                const zoneData = Pathfinding.createZone(this.navmesh.geometry);
                this.pathfinding.setZoneData(this.zone, zoneData);
              }
              else{
                console.error('Navmesh geometry not found');
              }
            }
          })
        });

        // raycasting
        // const raycaster = new THREE.Raycaster();
        // const clickMouse = new THREE.Vector2();
        // window.addEventListener('click', (e) => {
        //     clickMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        //     clickMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        //     raycaster.setFromCamera(clickMouse, camera);
        //     const found = raycaster.intersectObjects(scene.children);
        //     if(found.length > 0){
        //       let target = found[0].point;
        //       this.groupId = this.pathfinding.getGroup(this.zone, this.cube.position);
        //       const closest = this.pathfinding.getClosestNode(this.cube.position, this.zone, this.groupId);
        //       this.navpath = this.pathfinding.findPath(closest.centroid, target, this.zone, this.groupId);
        //       if(this.navpath){
        //         this.pathfindingHelper.reset();
        //         this.pathfindingHelper.setPlayerPosition(this.cube.position);
        //         this.pathfindingHelper.setTargetPosition(target);
        //         this.pathfindingHelper.setPath(this.navpath);
        //       }
        //       else{
        //         console.log('no path found');
        //       }
        //     }
        //     else{
        //       console.log('no target found');
        //     }
        // });

    }
}