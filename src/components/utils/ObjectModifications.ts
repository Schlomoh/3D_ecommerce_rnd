import { Box3, Event, Group, Matrix4, Mesh, Object3D, Vector3 } from "three";
import { acceleratedRaycast, MeshBVH } from "three-mesh-bvh";

class ObjectModifications {
  static addBVH(object: Group) {
    function addBounds(child: Object3D<Event>) {
      console.log("child:", child);
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
    // const box = new BoxHelper(object, '#fff'); // bounding box
    const box = new Box3().setFromObject(object); // bounding box
    const boxSize = new Vector3();
    const boxCenter = new Vector3();
    const transMatrix = new Matrix4();

    box.getSize(boxSize);
    box.getCenter(boxCenter);
    const transformation = boxCenter.multiplyScalar(-1);
    transMatrix.makeTranslation(
      transformation.x,
      transformation.y,
      transformation.z
    );

    console.log("bbox size:", boxSize);
    console.log("bbox center:", boxCenter);
    console.log("transformation Vector (half of box size):", transformation);
    console.log("transformation Matrix", transMatrix);

    object.applyMatrix4(transMatrix);
    // scene.add(box)

    return object;
  }
}

export default ObjectModifications;
