import { css, html, LitElement, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";

import { Renderer, ModelScene } from "./components";

@customElement("bm-viewer")
export class BMV extends LitElement {
  renderer: Renderer;
  scene: ModelScene;
  @property({ type: String })
  modelSrc: string = "";

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.scene = new ModelScene();
    this.renderer = new Renderer(this.scene);
  }

  static styles = css`
    #viewer {
      width: 100%;
      height: 100%;
    }
  `;

  protected firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    // wait for first update so the viewer wrapper element has been rendered
    // and can be accessed
    const container = this.shadowRoot?.getElementById("viewer")!;
    this.scene.loadModel(this.modelSrc);
    this.renderer.connect(container);
    this.renderer.start();
  }

  render() {
    return html` <div id="viewer"></div> `;
  }
}
