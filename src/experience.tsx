import { OrbitControls } from "@react-three/drei";

export function Experience() {
  return (
    <>
      <OrbitControls makeDefault />

      <mesh>
        <boxGeometry />
        <meshNormalMaterial />
      </mesh>
    </>
  );
}
