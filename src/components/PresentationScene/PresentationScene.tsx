import { OrbitControls, Stats } from "@react-three/drei";
import { Canvas, ThreeEvent, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { MeshBasicMaterial } from "three";
import { Model } from "./Mbtr_Shirt_v2";

interface PointsProps {
  points: THREE.Vector3[];
  model: React.RefObject<THREE.Group>;
  cam: THREE.PerspectiveCamera;
}

interface PointProps extends PointsProps {
  point: THREE.Vector3;
  index: number;
}

const Point = (props: PointProps) => {
  const { point, index, model, cam } = props;
  const showColor = new THREE.Color(0x03a8b7);
  const hideColor = new THREE.Color(0x082730);
  const hideOpacity = 0.25;
  const alphaStepSize = 0.05;

  const pointMesh = useRef<THREE.Mesh>(null);

  const [visible, setVisible] = useState(true);
  const [previous, setPrevious] = useState({ color: hideColor, opacity: hideOpacity }); // prettier-ignore
  const [current, setCurrent] = useState({ color: showColor, opacity: 1 }); // prettier-ignore
  const [next, setNext] = useState({ color: hideColor, opacity: hideOpacity }); // prettier-ignore
  const [alpha, setAlpha] = useState(0);

  // material
  const material = new MeshBasicMaterial({ ...current, transparent: true });
  material.depthTest = false;
  material.depthWrite = false;

  useEffect(() => {
    if (visible) {
      setPrevious({ color: hideColor, opacity: hideOpacity });
      setNext({ color: showColor, opacity: 1 });
    } else {
      setPrevious({ color: showColor, opacity: 1 });
      setNext({ color: hideColor, opacity: hideOpacity });
    }
    setAlpha(0);
  }, [visible]);

  // check if the point is visible
  useFrame(() => {
    const camPosition = cam.position.clone();
    const pointDirector = point.clone().sub(camPosition).normalize();
    const raycaster = new THREE.Raycaster(camPosition, pointDirector);
    const intersects = raycaster.intersectObjects(
      [model.current!, pointMesh.current!],
      true
    );
    if (intersects[0].object.uuid === pointMesh.current?.uuid) setVisible(true);
    else setVisible(false);
  });

  // update the material
  useFrame(() => {
    if (alpha < 1) {
      setAlpha(Number(+(alpha + alphaStepSize).toFixed(2)));
      const newColor = current.color.lerpColors(previous.color, next.color, alpha); // prettier-ignore
      const newOpacity = current.opacity * (1 - alpha) + next.opacity * alpha;
      setCurrent({ color: newColor, opacity: newOpacity });
      material.color = current.color;
      material.opacity = current.opacity;
    }
  });

  return (
    <mesh key={index} position={point} ref={pointMesh} material={material}>
      <sphereGeometry attach="geometry" args={[0.008, 16, 8]} />
    </mesh>
  );
};

const Points = (props: PointsProps) => {
  const { points } = props;
  return (
    <>
      {points.map((point, index) => (
        <Point point={point} index={index} key={index} {...props} />
      ))}
    </>
  );
};

const Scene = ({ cam }: { cam: THREE.PerspectiveCamera }) => {
  const modelRef = useRef<THREE.Group>(null);
  const [points, setPoints] = useState<THREE.Vector3[]>([]);

  function handleDoubleClick(event: ThreeEvent<MouseEvent>) {
    setPoints([...points, event.intersections[0].point]);
  }

  return (
    <group onDoubleClick={handleDoubleClick}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <pointLight position={[-10, 10, -10]} />
      <Points points={points} model={modelRef} cam={cam} />
      <Model ref={modelRef} />
    </group>
  );
};

const PresentationScene = () => {
  const cameraPosition = new THREE.Vector3(0, -0.15, -1);
  const cam = new THREE.PerspectiveCamera();
  cam.position.set(...cameraPosition.toArray());

  return (
    <Canvas camera={cam} shadows>
      <Stats />
      <OrbitControls autoRotate />
      <Scene cam={cam} />
    </Canvas>
  );
};

export default PresentationScene;
