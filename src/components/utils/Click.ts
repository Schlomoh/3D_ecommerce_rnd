import ModelScene from "../ModelScene";

interface ClickHandler {
  scene: ModelScene;
}

type Callback = () => {};

class ClickHandler {
  constructor(scene: ModelScene) {
    this.scene = scene;
  }

  onDoubleClick(callback: Callback) {
      
  }
}
