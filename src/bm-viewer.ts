import { html, LitElement, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { Clock } from "three";

import playIcon from "./assets/playIconSvg";
import pauseIcon from "./assets/pauseIconSvg";

import Stats from "three/examples/jsm/libs/stats.module";

import {
  ModelRenderer,
  HotspotRenderer,
  ModelScene,
  Animations,
  Hotspot,
  viewerCss,
} from "./components";

type AddHotspotEvent = CustomEvent<{ hotspot: Hotspot }>;

@customElement("bm-viewer")
export class BMV extends LitElement {
  @property({ type: String })
  modelSrc: string = "";

  @state()
  playing = false;

  @state()
  private showHotspotConfig = false;

  private animations: Animations;
  private scene: ModelScene = new ModelScene();
  private hotspotRenderer = new HotspotRenderer(this.scene);
  private modelRenderer = new ModelRenderer(this.scene);
  private currentHotspot?: Hotspot;
  private stats = Stats();

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.hotspotRenderer.domElement.addEventListener("addedHotspot", (e) =>
      this.onAddHotspot(e as AddHotspotEvent)
    );

    this.animations = this.scene.animationManager;
  }

  protected start() {
    const clock = new Clock();
    const animate = () => {
      requestAnimationFrame(animate);

      if (this.scene.modelReady && this.animations.animationMixer) {
        this.animations.animationMixer.update(clock.getDelta());
      }

      this.stats.update();
      this.hotspotRenderer.update();
      this.modelRenderer.render(this.scene, this.scene.camera);
      this.hotspotRenderer.render(this.scene, this.scene.camera);
    };
    animate();
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    // wait for first update so the viewer wrapper element has been rendered
    // and can be accessed
    const container = this.shadowRoot?.getElementById("viewer")!;
    container.appendChild(this.stats.domElement);
    this.hotspotRenderer.connect(container);
    this.modelRenderer.connect(container);

    this.scene.loadModel(this.modelSrc);

    this.start();
  }

  protected updated(_changedProperties: PropertyValues): void {
    super.updated(_changedProperties);

    if (this.shadowRoot) {
      const hotspotConfig = this.shadowRoot.getElementById("hotspotConfig");
      if (hotspotConfig) {
        if (this.showHotspotConfig) {
          hotspotConfig.style.right = "0px";
        } else if (!this.showHotspotConfig) {
          hotspotConfig.style.right = "calc(0px - 35vw)";
        }
      }
    }
  }

  onPlayButtonClick() {
    if (this.playing) {
      this.animations.animationActions[0].fadeOut(0.25);
    } else {
      this.animations.animationActions[0].stop();
      this.animations.animationActions[0].play();
    }
    this.playing = !this.playing;
  }

  cancelHotspot() {
    const index = Object.keys(this.hotspotRenderer.hotspots).length;
    delete this.hotspotRenderer.hotspots[index];
    if (this.currentHotspot) this.scene.remove(this.currentHotspot);
    this.showHotspotConfig = false;
  }

  onAddHotspot(e: AddHotspotEvent) {
    this.currentHotspot = e.detail.hotspot;
    this.showHotspotConfig = true;
  }

  onHotspotConfigSubmit(e: SubmitEvent) {
    e.preventDefault();
    const form = this.shadowRoot?.getElementById('configHotspotForm') as HTMLFormElement // prettier-ignore
    const title = form.elements.namedItem("title") as HTMLInputElement;
    const desc = form.elements.namedItem("desc") as HTMLTextAreaElement;

    const data = { title: title.value, desc: desc.value, media: null };

    const event = new CustomEvent("submitHotspot", { detail: { data: data } });
    this.hotspotRenderer.domElement.dispatchEvent(event);

    title.value = desc.value = "";

    this.showHotspotConfig = false;
  }

  static styles = viewerCss;

  render() {
    return html`
      <div id="viewerContainer">
        <div id="hotspotConfig">
          <form @submit=${this.onHotspotConfigSubmit} id="configHotspotForm">
            <button @click=${this.cancelHotspot} class="cancelButton">
              Cancel
            </button>
            <label for="title">Title</label>
            <input type="text" name="title" id="title" />
            <label for="desc">Description</label>
            <textarea id="desc" rows="10"></textarea>
            <button type="submit">Add hotspot</button>
          </form>
        </div>
        <button @click=${this.onPlayButtonClick} class="playButton float">
          ${this.playing ? pauseIcon : playIcon}
        </button>
        <div id="viewer"></div>
      </div>
    `;
  }
}
