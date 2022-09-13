class StyleUpdater {
  private shadowRoot: ShadowRoot | null;
  constructor(shadowRoot: ShadowRoot | null) {
    this.shadowRoot = shadowRoot;
  }

  updateStyle(elementId: string, property: string, value: string) {
    const element = this.shadowRoot?.getElementById(elementId);
    if (this.shadowRoot) {
      if (element) {
        element.style.setProperty(property, value);
      }
    }
  }
}

export default StyleUpdater;
