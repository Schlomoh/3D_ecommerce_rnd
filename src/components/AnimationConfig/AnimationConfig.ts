import { BMVBase, Constructor } from "../../bm-viewer";

import playIcon from "../../assets/playIconSvg";
import pauseIcon from "../../assets/pauseIconSvg";
import { html, PropertyValues, TemplateResult } from "lit";

export interface AnimationInteface {
  renderAnimationConfig: () => TemplateResult;
}

const ID = "animationConfig";

export const AnimationConfigMixin = <T extends Constructor<BMVBase>>(
  BaseClass: T
): Constructor<AnimationInteface> & T => {
  return class AnimationConfig extends BaseClass {
    private onPlayButtonClick() {
      if (this.playing) {
        this.animations.animationActions[0].fadeOut(0.25);
      } else {
        this.animations.animationActions[0].stop();
        this.animations.animationActions[0].play();
      }
      this.playing = !this.playing;
    }

    private cancelAnimationConfig() {
      this.showAnimationConfig = false;
    }

    protected updated(_changedProperties: PropertyValues): void {
      super.updated(_changedProperties);

      const animationConfig = this.shadowRoot?.getElementById(ID);
      const width = animationConfig?.clientWidth;

      if (this.showAnimationConfig) this.styleUpdater.updateStyle(ID, "right", "0px");
      else this.styleUpdater.updateStyle(ID, "right", `-${width! + 30}px`); // prettier-ignore
    }

    renderAnimationConfig() {
      return html`
        <button @click=${this.onPlayButtonClick} class="playButton float">
          ${this.playing ? pauseIcon : playIcon}
        </button>
        <div class="flyin" id=${ID}>
          <div class="header">
            <h3>Animation configuration</h3>
            <button
              @click=${this.cancelAnimationConfig}
              class="cancelButton skeleton"
            >
              Cancel
            </button>
          </div>
        </div>
      `;
    }
  };
};

export default AnimationConfigMixin;
