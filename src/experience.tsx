import { Environment, Float, OrbitControls, useGLTF } from "@react-three/drei";

export function Experience() {
  const computer = useGLTF(
    "https://threejs-journey.com/resources/models/macbook_model.gltf",
  );
  return (
    <>
      <color attach="background" args={["#241a1a"]} />
      <Environment preset="city" />
      <OrbitControls makeDefault />

      <Float rotationIntensity={0.4}>
        <primitive object={computer.scene} position-y={-1.2} />
      </Float>
    </>
  );
}
