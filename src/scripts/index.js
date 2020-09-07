import "../styles/index.scss";

import * as THREE from "three";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { DDSLoader } from "three/examples/jsm/loaders/DDSLoader";

var container;

var camera, scene, renderer;

var mouseX = 0,
  mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {
  container = document.createElement("div");
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    2000
  );
  camera.position.z = 250;

  // scene

  scene = new THREE.Scene();
  const ambientLight = new THREE.AmbientLight("#fff");
  scene.add(ambientLight);

  var pointLight = new THREE.PointLight(0xffffff, 0.8);
  camera.add(pointLight);
  scene.add(camera);
  scene.background = new THREE.Color(0xffffff);
  // model

  var onProgress = function (xhr) {
    if (xhr.lengthComputable) {
      var percentComplete = (xhr.loaded / xhr.total) * 100;
      console.log(Math.round(percentComplete, 2) + "% downloaded");
    }
  };

  var onError = function (error) {
    console.log(error);
  };

  var manager = new THREE.LoadingManager();
  manager.addHandler(/\.dds$/i, new DDSLoader());

  // comment in the following line and import TGALoader if your asset uses TGA textures
  // manager.addHandler( /\.tga$/i, new TGALoader() );

  new MTLLoader(manager).load(
    "/public/scene_mesh_textured.mtl",
    function (materials) {
      materials.preload();

      new OBJLoader(manager).setMaterials(materials).load(
        "/public/scene_mesh_decimated_textured.obj",
        function (object) {
          object.position.y = -95;
          scene.add(object);
        },
        onProgress,
        onError
      );
    },
    null,
    function (error) {
      console.log(error);
    }
  );

  //

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  document.addEventListener("mousemove", onDocumentMouseMove, false);

  //

  window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
  mouseX = (event.clientX - windowHalfX) / 2;
  mouseY = (event.clientY - windowHalfY) / 2;
}

//

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += (-mouseY - camera.position.y) * 0.05;

  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}
