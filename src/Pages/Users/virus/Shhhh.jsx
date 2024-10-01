import React, { useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import e from './e.mp3';

function Shhh({renderer, scene, camera, dogsRef}) {
    const audioRef = useRef(null);
    // const renderer = new THREE.WebGLRenderer();
    // renderer.setSize(window.innerWidth, window.innerHeight);
    // document.body.appendChild(renderer.domElement);

    // const scene = new THREE.Scene();
    // const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    // camera.position.z = 5;
    const dogs = [];
    function woof(){
        const hehe = document.getElementById('hehe');
        hehe.remove();
        playAudio();
        setInterval(() => {
            const aso = new GLTFLoader();
            aso.load('./shiba/scene.gltf', function(gltf) {
                const doggo = gltf.scene;
                
                let newX = Math.random() * 6 - 3;
                let newY = Math.random() * 6 - 3; 
                let newZ = Math.random() * 6 - 3;
        
                if (dogs.length > 0) {
                    let tooClose = true;
        
                    while (tooClose) {
                        tooClose = false;
                        
                        for (let i = 0; i < dogs.length; i++) {
                            const prevdoggo = dogs[i];
                            const distance = Math.sqrt(
                                Math.pow(newX - prevdoggo.position.x, 2) +
                                Math.pow(newY - prevdoggo.position.y, 2) +
                                Math.pow(newZ - prevdoggo.position.z, 2)
                            );
        
                            if (distance < 3) {
                                newX = Math.random() * 6 - 3;
                                newY = Math.random() * 6 - 3;
                                newZ = Math.random() * 6 - 3;
                                tooClose = true;
                                break;
                            }
                        }
                    }
                }
                doggo.position.set(newX, newY, newZ);
                scene.add(doggo);
                dogs.push(doggo);
                dogsRef.current = dogs;
                console.log('deleting system32')
            });
        }, 2000);
    }

    // function animate() {
    //     requestAnimationFrame(animate);
    //     if(dogs){
    //         dogs.forEach(dog => {
    //             dog.rotation.x += 0.1;
    //             dog.rotation.y += 0.1;
    //         });
    //     }
    //     renderer.render(scene, camera);
    // }
    // animate();



  const playAudio = () => {
    if (audioRef.current) {
        setTimeout(()=>{
            audioRef.current.play();
        }, 2000)
    }
  };

  return (
    <>
    <button id='hehe' onClick={woof} style={{
        zIndex: 100000,
        position: 'absolute',
        transform: 'translateX(-50%) translateY(-50%)',
        top: '5%',
        left: '5%',
        padding: '0.5rem 1rem',
        border: '2px solid red',
        color: 'red',
        backgroundColor: 'black',}}
        >{`DON'T CLICK ME >:(`}
        
    </button>
    <audio ref={audioRef} src={e}></audio>
    </>
  )
}

export default Shhh