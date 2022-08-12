import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

interface LoadFile {
  loader: GLTFLoader;
  gltfFile: GLTF;
  mixer: THREE.AnimationMixer | null;
}

class LoadFile {
  constructor(fileName: string) {
    this.loader = new GLTFLoader();
    this.load(fileName);
    this.mixer = null;
  }

  private setMixer() {
    this.mixer = new THREE.AnimationMixer(this.model);
    this.mixer.clipAction(this.gltfFile.animations[0]).play();
  }

  private onLoad(gltf: GLTF) {
    this.gltfFile = gltf;
    if (this.gltfFile !== undefined) return 1;
    else return 0;
  }

  private onProgress(progress: ProgressEvent<EventTarget>) {
    return progress;
  }

  private load(fileName: string) {
    this.loader.load(fileName, this.onLoad, this.onProgress);
  }

  get model() {
    return this.gltfFile.scene;
  }
}

interface Scene {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  clock: THREE.Clock;
  controls: OrbitControls;
  fileName: string;
  domNode: HTMLElement | null;
  mixer: THREE.AnimationMixer;
}

class Scene {
  constructor(
    fileName: string,
    domNodeName: string,
    mixer: THREE.AnimationMixer
  ) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera();
    this.renderer = new THREE.WebGLRenderer();
    this.clock = new THREE.Clock();
    this.controls = new OrbitControls(this.camera, this.domNode!);
    this.domNode = document.getElementById(domNodeName);
    this.fileName = fileName;
    this.mixer = mixer;
  }

  private addModelToScene(model: any) {
    console.log(typeof model);
    this.scene.add(model);
  }

  private animate() {
    requestAnimationFrame(this.animate);
    const delta = this.clock.getDelta();
    this.mixer.update(delta);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  addSceneToDom() {
    const loader = new LoadFile(this.fileName);
    this.addModelToScene(loader.model);
    this.domNode?.appendChild(this.renderer.domElement);
    this.animate();
  }
}

export { LoadFile };
