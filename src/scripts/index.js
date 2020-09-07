import "../styles/index.scss";

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const backgroundColor = 0x000000;

/*////////////////////////////////////////*/

var renderCalls = [];
function render() {
  requestAnimationFrame(render);
  renderCalls.forEach((callback) => {
    callback();
  });
}
render();

/*////////////////////////////////////////*/

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(
  80,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(5, 5, 5);

var renderer = new THREE.WebGLRenderer({ antialias: true });
// renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);


document.body.appendChild(renderer.domElement);

function renderScene() {
  renderer.render(scene, camera);
}
renderCalls.push(renderScene);

/* ////////////////////////////////////////////////////////////////////////// */

var controls = new OrbitControls(camera, renderer.domElement);

controls.rotateSpeed = 0.3;
controls.zoomSpeed = 0.9;

controls.minDistance = 3;
controls.maxDistance = 20;

controls.minPolarAngle = 0; // radians
controls.maxPolarAngle = Math.PI / 2; // radians

// controls.enableDamping = true;
// controls.dampingFactor = 0.05;

renderCalls.push(function () {
  controls.update();
});

/* ////////////////////////////////////////////////////////////////////////// */

// var light = new THREE.PointLight(0xffffcc, 20, 200);
// light.position.set(4, 30, -20);
// scene.add(light);

var light2 = new THREE.AmbientLight(0x20202a, 20, 100);
light2.position.set(30, -10, 30);
scene.add(light2);

/* ////////////////////////////////////////////////////////////////////////// */

var loader = new GLTFLoader();
loader.crossOrigin = true;
loader.load("/public/model.glb", function (data) {
  var object = data.scene;
  object.position.set(0, -10, -0.75);
  scene.add(object);
});
