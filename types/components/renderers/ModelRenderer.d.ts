import { PerspectiveCamera, WebGLRenderer } from "three";
import ModelScene from ".././ModelScene";
import { WindowHandler } from ".././utils";
declare class ModelRenderer extends WebGLRenderer {
    protected camera: PerspectiveCamera;
    protected windowHandler: WindowHandler;
    container: HTMLElement;
    scene: ModelScene;
    constructor(scene: ModelScene);
    connect(container: HTMLElement): void;
}
export default ModelRenderer;
