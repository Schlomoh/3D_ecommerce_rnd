import {
  AmbientLight,
  Color,
  DirectionalLight,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Scene,
  ShadowMaterial,
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

    const shadowLight = new DirectionalLight("#000", 1);
    shadowLight.position.y = 25;
    shadowLight.castShadow = true;
    shadowLight.shadow.mapSize.width = 2048;
    shadowLight.shadow.mapSize.height = 2048;
    shadowLight.shadow.camera.left = -1;
    shadowLight.shadow.camera.right = 1;
    shadowLight.shadow.camera.top = 1;
    shadowLight.shadow.camera.bottom = -1;
    shadowLight.shadow.radius = 4;
    this.add(shadowLight);

    this.background = new Color("#ddd");
  }

  private addPointLight(color: string, position: Vec3, intensity?: number) {
    const newLight = new PointLight(color);
    newLight.intensity = intensity ? intensity : 1;
    newLight.position.set(position.x, position.y, position.z);
    this.add(newLight);
  }

  loadModel(modelSrc: string) {
    this.loader.load(modelSrc);
  }
}

export default ModelScene;
