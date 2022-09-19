import { html, TemplateResult } from "lit";
import { BMVBase, Constructor } from "../../bm-viewer";

export interface ButtonGroupInterface {
  renderButtonGroup: () => TemplateResult;
}

export const ButtonGroupMixin = <T extends Constructor<BMVBase>>(
  BaseClass: T
): Constructor<ButtonGroupInterface> & T => {
  return class ButtonGroup extends BaseClass {
    onShowAnimationConfig() {
      this.showHotspotOverview = false
      this.showAnimationConfig = !this.showAnimationConfig;
    }

    onShowHotspotOverview() {
      this.showAnimationConfig = false
      this.showHotspotOverview = !this.showHotspotOverview;
    }

    renderButtonGroup() {
      return html`
        <div class="buttonGroup">
          <button @click=${this.onShowAnimationConfig} class="groupButton">
            Animations
          </button>
          <button @click=${this.onShowHotspotOverview} class="groupButton">
            Hotspots
          </button>
          <button class="groupButton">HDR settings</button>
          <button class="groupButton">General</button>
        </div>
      `;
    }
  };
};
