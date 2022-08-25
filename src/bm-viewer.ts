import { css, html, LitElement, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";

import { ModelRenderer, HotspotRenderer, ModelScene } from "./components";

@customElement("bm-viewer")
export class BMV extends LitElement {
  @property({ type: String })
  modelSrc: string = "";

  private scene: ModelScene = new ModelScene();
  private hotspotRenderer = new HotspotRenderer(this.scene);
  private modelRenderer = new ModelRenderer(this.scene);

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static styles = css`
    #viewer {
      width: 100%;
      height: 100%;
    }
  `;

  protected start() {
    const animate = () => {
      console.log('frame')
      requestAnimationFrame(animate);
      this.hotspotRenderer.controls.update();
      this.modelRenderer.render(this.scene, this.scene.camera);
      this.hotspotRenderer.render(this.scene, this.scene.camera);
    };
    animate()
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    // wait for first update so the viewer wrapper element has been rendered
    // and can be accessed
    const container = this.shadowRoot?.getElementById("viewer")!;
    this.scene.loadModel(this.modelSrc);

    this.hotspotRenderer.connect(container);
    this.modelRenderer.connect(container);

    this.start();
  }

  render() {
    return html` <div id="viewer"></div> `;
  }
}
