import {
  Box3,
  Event,
  Group,
  Mesh,
  Object3D,
  PlaneGeometry,
  ShadowMaterial,
  Vector3,
} from "three";
import { acceleratedRaycast, MeshBVH } from "three-mesh-bvh";

class ObjectModifications {
  private static getModelCenter(object: Group) {
    const box = new Box3().setFromObject(object); // bounding box
    const boxCenter = new Vector3();

    box.getCenter(boxCenter);
    return { center: boxCenter, min: box.min, max: box.max };
  }

  static addBVH(object: Group) {
    function addBounds(child: Object3D<Event>) {
      if (child.type === "Mesh" || child.type === "SkinnedMesh") {
        const mesh = child as Mesh;
        const hasGeo = mesh.isMesh && mesh.geometry.isBufferGeometry;
        const hasBounds = hasGeo && mesh.geometry.boundsTree;
        if (hasGeo && !hasBounds && mesh.geometry.attributes.position) {
          const geo = mesh.geometry;
          const triCount = geo.index ? geo.index.count / 3 : geo.attributes.position.count / 3; //prettier-ignore
          if (triCount > 1000 && triCount < 10000000) {
            geo.boundsTree = new MeshBVH(geo);
          }
        }
      }
    }

    Mesh.prototype.raycast = acceleratedRaycast;
    object.traverseVisible(addBounds);
    return object;
  }

  static centerModel(object: Group) {
    // const bbox = new BoxHelper(object, '#fff'); // visible bounding box
    const { center: boxCenter } = this.getModelCenter(object);

    const transformation = boxCenter.multiplyScalar(-1);

    object.translateX(transformation.x);
    object.translateY(transformation.y);
    object.translateZ(transformation.z);

    // scene.add(bbox) // add visible bounding box to scene

    return object;
  }

  static enableShadows(object: Group, enableShadows: boolean) {
    object.traverse((child: Object3D<Event>) => {
      return (child.castShadow = enableShadows);
    });
    return object;
  }

  static createShadowPlane(object: Group) {
    const plane = new PlaneGeometry(100, 100);
    const shadowMaterial = new ShadowMaterial({ color: 0x000, opacity: 0.2 });
    const planeMesh = new Mesh(plane, shadowMaterial);

    const { min } = this.getModelCenter(object);
    
    plane.rotateX(-Math.PI / 2);
    planeMesh.translateY(min.y);
    planeMesh.receiveShadow = true;
    return planeMesh;
  }
}

export default ObjectModifications;
