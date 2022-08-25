import { PerspectiveCamera, WebGLRenderer } from "three";
import ModelScene from ".././ModelScene";
import { ClickHandler, WindowHandler } from ".././utils";

class ModelRenderer extends WebGLRenderer {
  protected camera: PerspectiveCamera;
  protected clickHandler: ClickHandler;
  protected windowHandler: WindowHandler;
  container: HTMLElement;
  scene: ModelScene;

  constructor(scene: ModelScene) {
    super({ antialias: true });

    this.container = document.createElement("div"); // placeholder element

    this.scene = scene;
    this.camera = scene.camera;
    this.camera.position.set(0, 0, -1);

    this.clickHandler = new ClickHandler(this.scene, this.domElement);
    this.windowHandler = new WindowHandler(this);
  }

  connect(container: HTMLElement) {
    this.container = container;
    this.windowHandler.updateDimensions();
    container.appendChild(this.domElement);
  }
}

export default ModelRenderer;
