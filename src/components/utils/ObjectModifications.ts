import { Event, Group, Mesh, Object3D } from "three";
import { acceleratedRaycast, MeshBVH } from "three-mesh-bvh";

class ObjectModifications {
  static addBVH(object: Group) {
    function addBounds(child: Object3D<Event>) {
      if (child.type === "Mesh") {
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
}

export default ObjectModifications;
