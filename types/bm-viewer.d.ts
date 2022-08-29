import { LitElement, PropertyValues } from "lit";
export declare class BMV extends LitElement {
    modelSrc: string;
    play: boolean;
    playButtonIcon: import("lit-html").TemplateResult<1>;
    private animations;
    private scene;
    private hotspotRenderer;
    private modelRenderer;
    private stats;
    constructor();
    protected start(): void;
    protected firstUpdated(_changedProperties: PropertyValues): void;
    onPlayButtonClick(): void;
    static styles: import("lit").CSSResult;
    render(): import("lit-html").TemplateResult<1>;
}
