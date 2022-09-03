import { PerspectiveCamera } from "three";
import { HotspotRenderer, ModelRenderer } from "../../renderers";
declare class WindowHandler {
    renderer: HotspotRenderer | ModelRenderer;
    camera?: PerspectiveCamera;
    constructor(renderer: HotspotRenderer | ModelRenderer);
    updateDimensions(): void;
}
export default WindowHandler;
