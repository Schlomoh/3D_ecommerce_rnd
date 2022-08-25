import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import ModelScene from "./ModelScene";
import { ObjectModifications } from "./utils";

class Loader {
  private scene: ModelScene;
  private gltfLoader = new GLTFLoader();
  private dracoLoader = new DRACOLoader();
  private dracoDecoderPath =
    // "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/";
    "/decoder/draco/"

  constructor(scene: ModelScene) {
    this.scene = scene;
    this.dracoLoader.setDecoderPath(this.dracoDecoderPath);
    this.gltfLoader.setDRACOLoader(this.dracoLoader);
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
