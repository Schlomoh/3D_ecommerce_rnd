import { Raycaster } from "three";
import Hotspot from "../../Hotspot";
import { HotspotRenderer } from "../../renderers";

class ClickHandler {
  private renderer: HotspotRenderer;
  private raycaster = new Raycaster();

  constructor(renderer: HotspotRenderer, canvas: HTMLElement) {
    this.renderer = renderer;
    this.raycaster.firstHitOnly = true;

    canvas.addEventListener("dblclick", (e) => {
      this.doubleClickCallback(e);
    });
  }

  private getNormalizedCoords(e: MouseEvent) {
    return {
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: -(e.clientY / window.innerHeight) * 2 + 1,
    };
  }

  doubleClickCallback(e: MouseEvent) {
    const scene = this.renderer.scene;
    const pointer = this.getNormalizedCoords(e);
    this.raycaster.setFromCamera(pointer, scene.camera);
    const intersects = this.raycaster.intersectObjects(scene.children, true);

    const hotspot = new Hotspot();
    this.renderer.hotspots.push(hotspot);
    hotspot.connectTo(intersects[0].object, intersects[0].point);

    console.log(intersects);
  }
}

export default ClickHandler;
