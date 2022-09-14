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
      this.showAnimationConfig = true;
    }

    renderButtonGroup() {
      return html`
        <div class="buttonGroup">
          <button @click=${this.onShowAnimationConfig} class="groupButton">
            Animations
          </button>
          <button class="groupButton">HDR settings</button>
          <button class="groupButton">General</button>
        </div>
      `;
    }
  };
};
