import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { ObjectModifications } from "../utils";
import {Animations} from "../threeComponents";
import ModelScene from "./ModelScene";

class Loader {
  private scene: ModelScene;
  private animationManager: Animations;
  private gltfLoader = new GLTFLoader();
  private dracoLoader = new DRACOLoader();
  private dracoDecoderPath =
    // "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/";
    "/decoder/draco/";

  constructor(scene: ModelScene, animationManager: Animations) {
    this.scene = scene;
    this.animationManager = animationManager;
    this.dracoLoader.setDecoderPath(this.dracoDecoderPath);
    this.gltfLoader.setDRACOLoader(this.dracoLoader);
  }

  private onLoad(gltf: GLTF) {
    let model = gltf.scene;
    model = ObjectModifications.addBVH(gltf.scene);
    model = ObjectModifications.centerModel(model);
    model = ObjectModifications.enableShadows(model, true)

    const shadowPlane = ObjectModifications.createShadowPlane(model)

    this.animationManager.init(model);
    this.animationManager.readAnimations(gltf);

    this.scene.add(model);
    this.scene.add(shadowPlane)

    this.scene.modelReady = true;
    // self.scene.add(gltf.scene);
  }

  load(modelSrc: string) {
    const onLoad = (gltf: GLTF) => this.onLoad(gltf);
    const onError = (e: ErrorEvent) =>
      console.error("Failed to load the GLTF model \n", e);
    this.gltfLoader.load(modelSrc, onLoad, undefined, onError);
  }
}

export default Loader;

// get scene world position
// get scene bounding box
// get center of bounding box
// transform world position to world center
// transform center of scene to center of world
