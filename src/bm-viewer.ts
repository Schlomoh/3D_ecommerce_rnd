import { css, html, LitElement, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  Group,
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  AmbientLight,
  PointLight,
} from "three";

/**
 * renderer
 *  get container from shadow dom
 *  get size
 *  append renderer dom element
 *
 * scene
 *  basic light setup
 *
 * loader (geometry)
 *  - onLoad
 *    - needs scene
 *  - onProgress
 *  - onError
 *
 * animate function
 *  scene
 *  controls
 *  renderer
 */

interface Loader {
  modelSrc: string;
  scene: ModelScene;
  gltfLoader: GLTFLoader;
}

class Loader {
  constructor(modelSrc: string, scene: ModelScene) {
    this.modelSrc = modelSrc;
    this.scene = scene;
    this.gltfLoader = new GLTFLoader();
  }

  onLoad(self: this, gltf: GLTF) {
    self.scene.add(gltf.scene);
  }

  load() {
    this.gltfLoader.load(
      this.modelSrc,
      (gltf: GLTF) => this.onLoad(this, gltf),
      undefined,
      (e: ErrorEvent) => console.log(e)
    );
  }
}

interface ModelScene {
  model: Group;
  camera: PerspectiveCamera;
}

class ModelScene extends Scene {
  constructor() {
    super();
    this.camera = new PerspectiveCamera();

    const ambLight = new AmbientLight("#fff", 1);
    this.add(ambLight);

    const pointLight = new PointLight("#fff");
    pointLight.position.set(1, 1, -1);
    this.add(pointLight);
  }

  loadModel(modelSrc: string) {
    const loader = new Loader(modelSrc, this);
    loader.load();
  }
}

interface Renderer {
  scene: ModelScene;
  camera: PerspectiveCamera;
  controls: OrbitControls;
}

class Renderer extends WebGLRenderer {
  constructor(scene: ModelScene) {
    super({ antialias: true,  });

    this.scene = scene;

    this.camera = scene.camera;
    this.camera.position.set(0, 0, -1);

    this.controls = new OrbitControls(this.camera, this.domElement);
    this.controls.autoRotate = true;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.1;

    this.setSize(500, 500);
  }

  setContainer(container: HTMLElement) {
    container.appendChild(this.domElement);
  }

  start() {
    (function animate(instance: Renderer) {
      requestAnimationFrame(() => animate(instance));
      console.log("new frame");
      instance.controls.update();
      instance.render(instance.scene, instance.camera);
    })(this);
  }
}

@customElement("bm-viewer")
export class BMV extends LitElement {
  renderer: Renderer;
  scene: ModelScene;
  @property({ type: String })
  modelSrc: string = "";

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.scene = new ModelScene();
    this.renderer = new Renderer(this.scene);
  }

  static styles = css`
    #viewer {
      width: 100%;
      height: 100%;
    }
  `;

  protected firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    const container = this.shadowRoot?.getElementById("viewer")!;
    this.scene.loadModel(this.modelSrc);
    this.renderer.setContainer(container);
    this.renderer.start();
  }

  render() {
    return html` <div id="viewer"></div> `;
  }
}
