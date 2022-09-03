import Animations from "./Animations";
import ModelScene from "./ModelScene";
declare class Loader {
    private scene;
    private animationManager;
    private gltfLoader;
    private dracoLoader;
    private dracoDecoderPath;
    constructor(scene: ModelScene, animationManager: Animations);
    private onLoad;
    load(modelSrc: string): void;
}
export default Loader;
