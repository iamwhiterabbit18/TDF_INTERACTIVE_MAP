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

        this.map.load('map/map.glb', (gltfScene) => {
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
      //   new THREE.BoxGeometry(0.05, 0.05, 0.2),
      //   new THREE.MeshNormalMaterial()
      // )
      // this.cube.position.set(1.22, -1.5, 0.1);
      // scene.add(this.cube);


      // this.currentLocation = new THREE.Vector3(1.1860951577305414, -2.062350342143323, 0.1);
      //   this.destination = new THREE.Vector3(0.8618936873520343, -1.5910573631885248, 0.1);
        
        // this.pathfindingHelper = new PathfindingHelper();
        // scene.add(this.pathfindingHelper);
        
        
        // this.navpath = null;
        
        
        this.pathfinding = new Pathfinding();
        
        this.map.load('map/map-navmesh.glb', (gltfScene) => {

          this.zone = 'level1';
          this.navmesh = null;
          this.groupId = null;

          this.mesh = gltfScene.scene;
          this.mesh.rotation.x = 0.5 * Math.PI;
          scene.add(this.mesh);
          
          this.mesh.traverse(object =>{
            if (object.isMesh) {
              this.navmesh = object;

              //visualize the navmesh area 
              if (this.navmesh) {
                const boundingBox = new THREE.Box3().setFromObject(this.mesh);
                // const size = boundingBox.getSize(new THREE.Vector3()); // Get the size of the bounding box
                // const center = boundingBox.getCenter(new THREE.Vector3()); // Get the center point of the bounding box
                
                //point a
                const sphereGeometry = new THREE.SphereGeometry(0.005, 32, 32);  // small sphere
                const sphereMaterial = new THREE.MeshBasicMaterial( 0x00ff00 );  // color
                const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
                sphere.position.set(0.6886628051797364, 0.13065154359055978, 0.0805);

                scene.add(sphere); 
                
                //point b
                const sphereGeometry1 = new THREE.SphereGeometry(0.005, 32, 32);  // small sphere
                const sphereMaterial1 = new THREE.MeshBasicMaterial( 0x00ff00 );  // color
                const sphere1 = new THREE.Mesh(sphereGeometry1, sphereMaterial1);
                sphere1.position.set(0.36337729226361404, 0.1164302958235701, 0.0805);
              
                scene.add(sphere1); 

                // console.log('Bounding Box Min:', boundingBox.min);
                // console.log('Bounding Box Max:', boundingBox.max);
                // console.log('Bounding Box Size:', size);
                // console.log('Bounding Box Center:', center);

                // const boxHelper = new THREE.Box3Helper(boundingBox, new THREE.Color(0xff0000));
                // scene.add(boxHelper);  // red box indicating the navmesh

                //checks if points are within the navmesh
                const isPointInNavmesh = (point) => {
                  return boundingBox.containsPoint(point);
                };
                
                const pointA = new THREE.Vector3(0.6886628051797364, 0.13065154359055978, 0.08134138359739033);
                if (isPointInNavmesh(pointA)) {
                    console.log('Point A is within the navmesh.');
                } else {
                    console.log('Point A is outside the navmesh.');
                }

                const isPointInmesh = boundingBox.containsPoint(pointA);
                console.log('Point A indeed in Navmesh:', isPointInmesh);
              }

              if(this.navmesh){
                    //initialize pathfinding system
                    const zoneData = Pathfinding.createZone(this.navmesh.geometry);
                    this.pathfinding.setZoneData(this.zone, zoneData);
                    
                    //get the id of the navmesh
                    this.groupId = Object.keys(zoneData.groups)[0];

                    // console.log('Zone Data:', zoneData);
                    // console.log('Zone Groups:', zoneData.groups);
                    // console.log('Group ID:', this.groupId);
                    // console.log('Navmesh Zone ID:', this.navmesh.zone);
                    // console.log('navmesh geometry', this.navmesh.geometry);

                    // the path from point a to b
                    const pointA = {x: 0.6886628051797364, y: 0.13065154359055978, z: 0.08134138359739033};
                    const pointB = {x: 0.36337729226361404, y: 0.1164302958235701, z: 0.0822346552740091};

                    const points = [];
                    points.push(pointA);
                    points.push(pointB);

                    //creates temporary line
                    // Create BufferGeometry and add the points
                    const geometry = new THREE.BufferGeometry().setFromPoints(points);
                    // Define the material for the line
                    const material = new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 500 });
                    // Create the line
                    const line = new THREE.Line(geometry, material);
                    // Add the line to the scene
                    line.position.set(0, 0, 0.0075);
                    scene.add(line);

                    // checks if points are in the same group
                    const groupIdA = this.pathfinding.getGroup(this.zone, new THREE.Vector3(0.6886628051797364, 0.13065154359055978, 0.08134138359739033));
                    const groupIdB = this.pathfinding.getGroup(this.zone, new THREE.Vector3(0.36337729226361404, 0.1164302958235701, 0.0822346552740091));

                    if (groupIdA === groupIdB) {
                        console.log('Both points are in the same group, proceeding to pathfinding...');
                        const path = this.pathfinding.findPath(pointA, pointB, this.zone, groupIdA);

                        console.log('path: ', path);

                        if (path) {
                            console.log('Path found:', path);
                        } else {
                            console.log('No path found.');
                        }
                    } else {
                        console.log('Points are in different groups: GroupA:', groupIdA, ', GroupB:', groupIdB);
                    }

                    const raycaster = new THREE.Raycaster();
                    const downDirection = new THREE.Vector3(0, -1, 0);

                    const snapToNavmesh = (point) => {
                      raycaster.set(point, downDirection);  // Set ray from point going downwards
                     
                      raycaster.set(new THREE.Vector3(point.x, point.y + 10, point.z), downDirection); // Casting from above the point (adjust 10 as needed)

                      const intersects = raycaster.intersectObject(this.navmesh);  // Intersect with navmesh
                      console.log(intersects.length);
                      console.log(`Intersections found for point ${point}:`, intersects);

                      if (intersects.length > 0) {
                        const snappedPoint = intersects[0].point;  // Get the closest point on the navmesh
                        console.log('Snapped point:', snappedPoint);
                        return snappedPoint;  // Return the snapped point
                      } else {
                        console.log(`No intersection found for point ${point}`);
                        return point;  // Return the original point if no intersection found
                      }
                    };

                    const snappedPointA = snapToNavmesh(pointA);
                    const snappedPointB = snapToNavmesh(pointB);
    
                    const path = this.pathfinding.findPath(snappedPointA, snappedPointB, this.zone, this.groupId);

                    console.log('path: ', path);
                  
                    if (path && path.length > 0) {
                      const pathPoints = path.map((point) => new THREE.Vector3(point.x, point.y, point.z));
                      const pathGeometry = new THREE.BufferGeometry().setFromPoints(pathPoints);
          
                      const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 50});
          
                      const line = new THREE.Line(pathGeometry, lineMaterial);
                      
                      // line.rotation.x = 0.5 * Math.PI;
                      // line.position.set(0, 0, 1);
                      // line.getWorldScale.set(1, 1, 1);
                      scene.add(line);

                      console.log('should have created a line');
                    } else {
                      console.log('welp');
                    }
              } else{
                console.error('Navmesh geometry not found');
              }
            } else {
              console.log("here");
              // console.log("!this.navmesh:", !this.navmesh);  // Logs whether `this.navmesh` is falsey (null or undefined)
              // console.log("object.isObject3D:", object.isObject3D);  // Logs whether `object` is an Object3D
              // console.log("object.children:", object.children);  // Logs whether `object.children` is defined
              // console.log("object.children.length > 0:", object.children && object.children.length > 0);  // Logs if there are children
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