// Preloader.js
import * as THREE from 'three';

class Preloader {
  constructor() {
    this.loadingManager = new THREE.LoadingManager();

    this.loadingManager.onLoad = this.onLoad.bind(this);
    this.loadingManager.onProgress = this.onProgress.bind(this);

    this.loadAssets();
  }

  loadAssets() {
    const textureLoader = new THREE.TextureLoader(this.loadingManager);
    this.texture = textureLoader.load('some path');
    
  }

  onLoad() {
    console.log('Assets loaded');
  }

  onProgress(url, itemsLoaded, itemsTotal) {
    console.log(`Loading asset: ${url} (${itemsLoaded}/${itemsTotal})`);
  }
}

export default Preloader;
