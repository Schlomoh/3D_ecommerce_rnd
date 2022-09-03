import { HotspotRenderer } from "../../renderers";
declare class ClickHandler {
    private renderer;
    private raycaster;
    constructor(renderer: HotspotRenderer, canvas: HTMLElement);
    private getNormalizedCoords;
    doubleClickCallback(e: MouseEvent): void;
}
export default ClickHandler;
