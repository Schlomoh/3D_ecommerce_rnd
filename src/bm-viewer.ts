import { css, html, LitElement, PropertyValues } from "lit";
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
} from "./components";

@customElement("bm-viewer")
export class BMV extends LitElement {
  @property({ type: String })
  modelSrc: string = "";

  @state()
  playing: boolean = false;

  @state()
  playButtonIcon = playIcon;

  private animations: Animations;
  private scene: ModelScene = new ModelScene();
  private hotspotRenderer = new HotspotRenderer(this.scene);
  private modelRenderer = new ModelRenderer(this.scene);
  private stats = Stats();

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

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

    this.scene.loadModel(this.modelSrc);

    this.hotspotRenderer.connect(container);
    this.modelRenderer.connect(container);

    this.start();
  }

  onPlayButtonClick() {
    if (this.playing) {
      this.animations.animationActions[0].fadeOut(0.25);
      // this.animations.animationActions[0].stop();
    } else {
      this.animations.animationActions[0].stop();
      this.animations.animationActions[0].play();
    }
    this.playing = !this.playing;
    this.playButtonIcon = this.playing ? pauseIcon : playIcon;
  }

  static styles = css`
    #viewerContainer {
      width: 100%;
      height: 100%;
    }

    #viewerContainer button {
      position: absolute;
      border: none;
      border-radius: 50%;
      z-index: 30000;
      cursor: pointer;
    }

    #viewerContainer .playButton {
      width: 30px;
      height: 30px;
      bottom: 0;
      right: 0;
      margin: 20px;
      fill: #fff;
      padding: 8px 11px;
    }

    #viewerContainer .playButton > svg {
      height: 10px;
      width: 10px;
    }

    #viewer {
      width: 100%;
      height: 100%;
    }
  `;

  render() {
    return html`
      <div id="viewerContainer">
        <button @click=${this.onPlayButtonClick} class="playButton">
          ${this.playButtonIcon}
        </button>
        <div id="viewer"></div>
      </div>
    `;
  }
}

// export type Constructor<T = object, U = object> = {
//   new (...args: any[]): T;
//   prototype: T;
// } & U;

// interface myI {
// }

// export const ControlsMixin = <T extends Constructor<BMV>>(
//   BMVElement: T
// ): Constructor<myI> & T => {
//   class MyNewMixinElement extends BMVElement {

//     bla() {
//       return 0
//     }
//   }
//   return MyNewMixinElement
// };
