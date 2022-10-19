import { html } from "lit";

import closeIcon from "../../assets/closeIconSvg";
import { BMVBase, Constructor } from "../../bm-viewer";

export interface BaseElementsInterface {}

export const BaseElementMixin = <T extends Constructor<BMVBase>>(
  BaseClass: T
): Constructor<BaseElementsInterface> & T => {
  class BaseElements extends BaseClass {
    renderBaseElements() {
      return html`
        <button
          @click=${this.cancelFocus}
          class="float skeleton"
          id="cancelFocus"
        >
          ${closeIcon} Cancel focus
        </button>
      `;
    }
  }
  return BaseElements;
};
