import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import ModelScene from "./ModelScene";

interface Loader {
  scene: ModelScene;
  gltfLoader: GLTFLoader;
}

class Loader {
  constructor(scene: ModelScene) {
    this.scene = scene;
    this.gltfLoader = new GLTFLoader();
  }

  onLoad(self: this, gltf: GLTF) {
    self.scene.add(gltf.scene);
  }

  load(modelSrc: string) {
    const onLoad = (gltf: GLTF) => this.onLoad(this, gltf);
    const onError = (e: ErrorEvent) => console.error(e);
    this.gltfLoader.load(modelSrc, onLoad, undefined, onError);
  }
}

export default Loader;
