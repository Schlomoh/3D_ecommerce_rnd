import { PerspectiveCamera } from "three";
import { HotspotRenderer, ModelRenderer } from "../threeComponents/renderers";

class WindowHandler {
  renderer: HotspotRenderer | ModelRenderer;
  camera?: PerspectiveCamera;

  constructor(renderer: HotspotRenderer | ModelRenderer) {
    this.renderer = renderer;
    if (renderer instanceof ModelRenderer) this.camera = renderer.scene.camera;
    window.addEventListener("resize", () => this.updateDimensions());
  }

  updateDimensions() {
    const container = this.renderer.container;
    if (container) {
      const [width, height] = [container.offsetWidth, container.offsetHeight];
      this.renderer.setSize(width, height);

      if (this.renderer instanceof ModelRenderer) {
        this.camera;
        this.renderer.pixelRatio = window.devicePixelRatio;
        if (this.camera) {
          this.camera.aspect = width / height;
          this.camera.updateProjectionMatrix();
        }
      }
    }
  }
}

export default WindowHandler;
