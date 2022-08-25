import { AmbientLight, PerspectiveCamera, PointLight, Scene } from "three";

import Loader from "./Loader";

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

class ModelScene extends Scene {
  private loader = new Loader(this);
  camera = new PerspectiveCamera();

  constructor() {
    super();

    const ambLight = new AmbientLight("#fff", 0.3);
    this.add(ambLight);

    this.addPointLight("#f656ff", { x: -1, y: 1, z: 0.7 });
    this.addPointLight("#3d5aff", { x: 1, y: 1, z: 0.7 });
    this.addPointLight("#fff", { x: 0, y: -1, z: -0.8 }, 0.3);
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
