import * as THREE from 'three';
// you can use this loading manager to monitor different asset loads
class Preloader {
  constructor() {
    this.loadingManager = new THREE.LoadingManager();

    this.pScreen = document.querySelector('.preloader');
    this.loadingManager.onLoad = this.onLoad.bind(this);
    this.loadingManager.onProgress = this.onProgress.bind(this);
    this.loadingManager.onError = this.onError.bind(this);
    // this.loadAssets();
  }


  // loadAssets(url) {
  //   const textureLoader = new THREE.TextureLoader(this.loadingManager);
  //   this.texture = textureLoader.load(url);
  // }

  onLoad() {
    console.log('Assets loaded');
  }

  onProgress(url, itemsLoaded, itemsTotal) {
    console.log(`Loading asset: ${url}`);
    if(itemsLoaded === itemsTotal) {
      this.fareOutPreloader();
    }
    // this.pScreen.remove();
  }

  onError(url) {
    console.error(`Error loading asset: ${url}`);
  }

  fareOutPreloader(){
    // Set the transition and opacity directly
    this.pScreen.style.transition = 'opacity 1s ease'; // Transition for opacity
    this.pScreen.style.opacity = '0'; // Fade out

    // Optional: Remove the preloader from the DOM after fading out
    setTimeout(() => {
      this.pScreen.style.display = 'none'; // Hide the preloader after transition
    }, 1000); // Match with your transition duration
  }
}

export default Preloader;
