import {
  AmbientLight,
  Color,
  PerspectiveCamera,
  PointLight,
  Scene,
} from "three";
import Animations from "./Animations";

import Loader from "./Loader";

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

class ModelScene extends Scene {
  private loader: Loader;
  camera = new PerspectiveCamera();
  animationManager = new Animations();
  modelReady: boolean = false;

  constructor() {
    super();

    this.loader = new Loader(this, this.animationManager);

    const ambLight = new AmbientLight("#fff", 0.8);
    this.add(ambLight);

    this.addPointLight("#f656ff", { x: -1, y: 1, z: 0.7 });
    this.addPointLight("#3d5aff", { x: 1, y: 1, z: 0.7 });
    this.addPointLight("#fff", { x: 0, y: -1, z: -0.8 }, 0.3);

    this.background = new Color("#fff");
  }

  private addPointLight(color: string, position: Vec3, intensity?: number) {
    const newLight = new PointLight(color);
    newLight.position.set(position.x, position.y, position.z);
    newLight.intensity = intensity ? intensity : 1;
    this.add(newLight);
  }

  loadModel(modelSrc: string) {
    this.loader.load(modelSrc);
  }
}

export default ModelScene;
