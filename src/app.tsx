import { Canvas } from "@react-three/fiber";
import { Experience } from "./experience";

export const App = () => {
  return (
    <Canvas
      camera={{
        fov: 45,
        near: 0.1,
        far: 2000,
        position: [-3, 1.5, 4],
      }}
    >
      <Experience />
    </Canvas>
  );
};
