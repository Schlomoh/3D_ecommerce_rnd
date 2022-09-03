import { AnimationAction, AnimationMixer, Event, Object3D } from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
declare class Animations {
    animationMixer: AnimationMixer | undefined;
    animationActions: AnimationAction[];
    init(rootModel: Object3D<Event>): void;
    readAnimations(model: GLTF): void;
}
export default Animations;
