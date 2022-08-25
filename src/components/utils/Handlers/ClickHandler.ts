import { Raycaster } from "three";
import ModelScene from "../../ModelScene";

class ClickHandler {
  private scene: ModelScene;
  private raycaster = new Raycaster();

  constructor(scene: ModelScene, canvas: HTMLCanvasElement) {
    this.scene = scene;
    canvas.addEventListener("dblclick", (e) => {
      this.doubleClickCallback(e);
    });
  }

  private getSceneCoords(e: MouseEvent) {
    return {
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: -(e.clientY / window.innerHeight) * 2 + 1,
    };
  }

  doubleClickCallback(e: MouseEvent) {
    const pointer = this.getSceneCoords(e);
    this.raycaster.setFromCamera(pointer, this.scene.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children);
    console.log(intersects);
  }
}

export default ClickHandler
