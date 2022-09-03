import { PerspectiveCamera, Scene } from "three";
import Animations from "./Animations";
declare class ModelScene extends Scene {
    private loader;
    camera: PerspectiveCamera;
    animationManager: Animations;
    modelReady: boolean;
    constructor();
    private addPointLight;
    loadModel(modelSrc: string): void;
}
export default ModelScene;
