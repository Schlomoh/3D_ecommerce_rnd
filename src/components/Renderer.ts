import { PerspectiveCamera, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import ModelScene from "./ModelScene";

interface Renderer {
  scene: ModelScene;
  camera: PerspectiveCamera;
  controls: OrbitControls;
}

class Renderer extends WebGLRenderer {
  constructor(scene: ModelScene) {
    super({ antialias: true });

    this.scene = scene;

    this.camera = scene.camera;
    this.camera.position.set(0, 0, -1);

    this.controls = new OrbitControls(this.camera, this.domElement);
    this.controls.autoRotate = true;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.1;
  }

  connect(container: HTMLElement) {
    const [width, height] = [container.offsetWidth, container.offsetHeight];
    this.setSize(width, height);

    this.pixelRatio = window.devicePixelRatio;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    container.appendChild(this.domElement);
  }

  start() {
    (function animate(instance: Renderer) {
      requestAnimationFrame(() => animate(instance));
      instance.controls.update();
      instance.render(instance.scene, instance.camera);
    })(this);
  }
}

export default Renderer;
