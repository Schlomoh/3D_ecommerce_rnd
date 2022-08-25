import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import ModelScene from "./ModelScene";
import { ObjectModifications } from "./utils";

class Loader {
  private scene: ModelScene;
  private gltfLoader = new GLTFLoader();

  constructor(scene: ModelScene) {
    this.scene = scene;
  }

  private onLoad(self: this, gltf: GLTF) {
    const gltfScene = ObjectModifications.addBVH(gltf.scene);
    self.scene.add(gltfScene);
  }

  load(modelSrc: string) {
    const onLoad = (gltf: GLTF) => this.onLoad(this, gltf);
    const onError = (e: ErrorEvent) => console.error(e);
    this.gltfLoader.load(modelSrc, onLoad, undefined, onError);
  }
}

export default Loader;
