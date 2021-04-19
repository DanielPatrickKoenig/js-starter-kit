import './index.css'
import * as THREE from 'three';
import {TweenLite} from 'gsap';


let scene;
let camera;
let renderer;
let perspective = 70;
let points = 120;
let positionMax = 10;
let scaleMin = .05;
let scaleMax = .25;
let metrics = ['Value 1', 'Value 2', 'Value 3', 'Value 4', 'Value 5', 'Value 6', 'Value 7', 'Value 8', 'Value 9'];
let metricsMap = [0, 1, 2 ,3];
let chartData = [];
let spheres = [];
for(let i = 0; i < points; i++){
  let values = [];
  for(let j = 0; j < metrics.length; j++){
    values.push(Math.random() * positionMax);
  }
  chartData.push(values);
}

function createBox(color) {
  const geometry = new THREE.BoxBufferGeometry(1);
  const phongMat = new THREE.MeshBasicMaterial({color})
  const mesh = new THREE.Mesh(geometry, phongMat);
  scene.add(mesh);
  return mesh;
}

function createSphere(){
  const geometry = new THREE.SphereBufferGeometry(1);
  const phongMat = new THREE.MeshPhongMaterial({color: 0x0000cc, specular: 0xffffff})
  const mesh = new THREE.Mesh(geometry, phongMat);
  mesh.scale.x = .1;
  mesh.scale.y = .1;
  mesh.scale.z = .1;
  mesh.position.x = positionMax / 2;
  mesh.position.y = positionMax / 2;
  mesh.position.z = positionMax / 2;
  scene.add(mesh);
  return mesh;
}

function upateSpheres(){
  for(let i = 0; i < chartData.length; i++){
    let current = {
      x: spheres[i].position.x,
      y: spheres[i].position.y,
      z: spheres[i].position.z
    };
    TweenLite.to(current, .5, {
      x: chartData[i][metricsMap[0]],
      y: chartData[i][metricsMap[1]],
      z: chartData[i][metricsMap[2]],
      onUpdate: () => {
        spheres[i].position.x = current.x;
        spheres[i].position.y = current.y;
        spheres[i].position.z = current.z;
        renderer.render(scene, camera);
      }
    });
  }
}

window.onload = () => {
  
  const containerElement = document.querySelector('#three-stage');
  const _width = containerElement.getBoundingClientRect().width;
  const _height = containerElement.getBoundingClientRect().height;
  renderer = new THREE.WebGLRenderer({ alpha: true });
  // self.$data.renderer = new self.$data.THREE.WebGLRenderer()
  renderer.setSize(_width, _height);
  containerElement.appendChild(renderer.domElement);
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(perspective, _width / _height, 1, 1000);
  camera.position.x = positionMax * 1.5;
  camera.position.y = positionMax * 1.5;
  camera.position.z = positionMax * 1.5;
  camera.rotation.y = 30 * (Math.PI / 180);
  camera.rotation.x = -45 * (Math.PI / 180);
  camera.rotation.z = 30 * (Math.PI / 180);
  

  for(let i = 0; i < chartData.length; i++){
    spheres.push(createSphere());
  }
  const xBar = createBox(0xcc0000);
  xBar.position.x = positionMax / 2;
  xBar.scale.x = positionMax;
  xBar.scale.y = .1;
  xBar.scale.z = .1;

  const yBar = createBox(0x00cc00);
  yBar.position.y = positionMax / 2;
  yBar.scale.x = .1;
  yBar.scale.y = positionMax;
  yBar.scale.z = .1;

  const zBar = createBox(0x0000cc);
  zBar.position.z = positionMax / 2;
  zBar.scale.x = .1;
  zBar.scale.y = .1;
  zBar.scale.z = positionMax;
  upateSpheres();
  console.log(spheres);
}

// let camera = !self.isOrthographic > 0 ? new THREE.PerspectiveCamera(self.perspective, _width / _height, 1, 1000) : new THREE.OrthographicCamera(_width / (self.$data.axisData.scale * -2), _width / (self.$data.axisData.scale * 2), _height / (self.$data.axisData.scale * -2), _height / (self.$data.axisData.scale * 2), 1, 1000)
    