import { AnimationAction, AnimationMixer, Group, Object3D } from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

class Animations {
  animationMixer: AnimationMixer | undefined;
  animationActions: AnimationAction[] = [];

  init(rootModel: Object3D<Event> | Group): void {
    this.animationMixer = new AnimationMixer(rootModel);
  }

  readAnimations(model: GLTF) {
    model.animations.forEach((animation) => {
      if (this.animationMixer) {
        const animationAction = this.animationMixer.clipAction(animation);
        this.animationActions.push(animationAction);
      }
    });
  }
}

export default Animations;
