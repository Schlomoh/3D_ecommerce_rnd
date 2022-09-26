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
      this.showGeneralSettings = false;
      this.showHotspotOverview = false;
      this.showAnimationConfig = !this.showAnimationConfig;
    }

    onShowHotspotOverview() {
      this.showGeneralSettings = false;
      this.showAnimationConfig = false;
      this.showHotspotOverview = !this.showHotspotOverview;
    }

    onShowGeneralSettings() {
      this.showAnimationConfig = false;
      this.showHotspotOverview = false;
      this.showGeneralSettings = !this.showGeneralSettings;
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
          <button @click=${this.onShowGeneralSettings} class="groupButton">
            General
          </button>
        </div>
      `;
    }
  };
};
