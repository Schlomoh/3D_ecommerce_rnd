import { BMVBase, Constructor } from "../../bm-viewer";

import playIcon from "../../assets/playIconSvg";
import pauseIcon from "../../assets/pauseIconSvg";
import { CSSResult, html, PropertyValues, TemplateResult } from "lit";
import { styles } from "./styles";

export interface AnimationInteface {
  renderAnimationConfig: () => TemplateResult;
}

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

      const animationConfig =
        this.shadowRoot?.getElementById("animationConfig");
      const animationConfigHeight = animationConfig?.clientHeight;

      if (this.showAnimationConfig)
        this.styleUpdater.updateStyle("animationConfig", "bottom", "0px");
      else
        this.styleUpdater.updateStyle(
          "animationConfig",
          "bottom",
          `-${animationConfigHeight! + 20}px`
        );
    }

    renderAnimationConfig() {
      return html`
        <button @click=${this.onPlayButtonClick} class="playButton float">
          ${this.playing ? pauseIcon : playIcon}
        </button>
        <div class="settings" id="animationConfig">
          <div class="header">
            <h3>Animation configuration</h3>
            <button @click=${this.cancelAnimationConfig} class="cancelButton">
              Cancel
            </button>
          </div>
          <form stlye="height: 50px;">test</form>
        </div>
      `;
    }
  };
};

export default AnimationConfigMixin;
