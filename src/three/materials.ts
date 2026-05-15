import * as THREE from "three";

export const COLORS = {
  glow: new THREE.Color("#F2C98C"),
  copper: new THREE.Color("#C4733A"),
  copperDeep: new THREE.Color("#A8552B"),
  ink: new THREE.Color("#2A2722"),
  warm: new THREE.Color("#F4F2EC"),
};

// reusable chrome (warm, low roughness)
export function makeChrome() {
  return new THREE.MeshStandardMaterial({
    color: "#F1E8D8",
    metalness: 1,
    roughness: 0.18,
    envMapIntensity: 1.4,
  });
}

// reusable copper
export function makeCopper() {
  return new THREE.MeshStandardMaterial({
    color: COLORS.copper,
    metalness: 1,
    roughness: 0.22,
    emissive: COLORS.copperDeep,
    emissiveIntensity: 0.08,
    envMapIntensity: 1.3,
  });
}

// dark app-icon tile body
export function makeTileBody() {
  return new THREE.MeshStandardMaterial({
    color: "#3a3732",
    metalness: 0.4,
    roughness: 0.65,
  });
}

// glowing diamond core
export function makeCore() {
  return new THREE.MeshStandardMaterial({
    color: "#F8D9A6",
    emissive: COLORS.glow,
    emissiveIntensity: 2.6,
    metalness: 0.4,
    roughness: 0.2,
  });
}
