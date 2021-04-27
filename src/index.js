import './index.css'
import * as THREE from 'three';
import {TweenLite} from 'gsap';


let scene;
let camera;
let cameraGuide = {x: 0, y: 0, z: 0};
let renderer;
let perspective = 70;
let dataPointLabels = ['Data Point 1', 'Data Point 2', 'Data Point 3', 'Data Point 4', 'Data Point 5', 'Data Point 6', 'Data Point 7', 'Data Point 8', 'Data Point 9', 'Data Point 10', 'Data Point 11', 'Data Point 12', 'Data Point 13', 'Data Point 14', 'Data Point 15']
let positionMax = 10;
let cameraBase = {x: (positionMax * 1.5), y: (positionMax * 1.5)};
let scaleMin = .05;
let scaleMax = .25;
let metrics = ['Value 1', 'Value 2', 'Value 3', 'Value 4', 'Value 5', 'Value 6', 'Value 7', 'Value 8', 'Value 9'];
let metricsMap = [0, 1, 2];
let colors = ['cc0000', '00cc00', '0000cc'];
let chartData = [];
let spheres = [];
let mainElement;
let shiftFactor = {x: 1, y: 1};
let usePerspective = true;
let hOffset = 0;
let vOffset = 0;
let xBar = {};
let yBar = {};
let zBar = {};
let xBarSelected = {};
let yBarSelected = {};
let zBarSelected = {};
let selectedPointIndex = -1;

function initialize(){
  const dataPointSelect = document.createElement('select');
  const dataPointOption = document.createElement('option');
  dataPointOption.innerHTML = 'Select a data point';
  dataPointOption.setAttribute('value', -1);
  dataPointSelect.appendChild(dataPointOption);
  document.querySelector('.data-point-selector').appendChild(dataPointSelect);
  for(let i = 0; i < dataPointLabels.length; i++){
    let values = [];
    for(let j = 0; j < metrics.length; j++){
      values.push(Math.random() * positionMax);
    }
    chartData.push(values);
    const dataPointOption = document.createElement('option');
    dataPointOption.innerHTML = dataPointLabels[i];
    dataPointOption.setAttribute('value', i);
    dataPointSelect.appendChild(dataPointOption);
  }
  dataPointSelect.value = -1;
  dataPointSelect.addEventListener('change', (e) => {
    selectedPointIndex = e.srcElement.value;
    selectPoint(selectedPointIndex);
  });
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

function togglePerspective(e){
  usePerspective = e.srcElement.checked;
  let targetValues = {
    cp: usePerspective ? positionMax * 1.5 : positionMax * .5,
    shift: usePerspective ? 1 : 0

  };
  TweenLite.to(shiftFactor, .5, {x: targetValues.shift, y: targetValues.shift});
  TweenLite.to(cameraBase, .5, {x: targetValues.cp, y: targetValues.cp, onUpdate: () => {
    cameraGuide.x = cameraBase.x + (hOffset * -1 * shiftFactor.x);
    cameraGuide.y = cameraBase.y + (vOffset * shiftFactor.y);
    // camera.position.x = cameraBase.x + (hOffset * -1 * shiftFactor.x);
    // camera.position.y = cameraBase.y + (vOffset * shiftFactor.y);
    camera.rotation.y = 30 * (Math.PI / 180) * shiftFactor.x;
    camera.rotation.x = -45 * (Math.PI / 180) * shiftFactor.x;
    camera.rotation.z = 30 * (Math.PI / 180) * shiftFactor.x;
    zBar.scale.x = .1 * shiftFactor.x;
    zBar.scale.y = .1 * shiftFactor.x;
  }});
  upateSpheres();
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
      z: usePerspective ? chartData[i][metricsMap[2]] : 0,
      onUpdate: () => {
        spheres[i].position.x = current.x;
        spheres[i].position.y = current.y;
        spheres[i].position.z = current.z;
        if(selectedPointIndex == i){
          selectPoint(selectedPointIndex);
        }
      }
    });
  }
}
function processEvent(e){
  return {x: e.pageX, y: e.pageY};
}
function onUserMove(e){
  const cursorPosition = processEvent(e);
  const bounds = mainElement.getBoundingClientRect();
  const hCenter = bounds.width / 2;
  hOffset = (hCenter - cursorPosition.x) * .005;
  const vCenter = bounds.height / 2;
  vOffset = (vCenter - cursorPosition.y) * .005;
  // console.log(cursorPosition);
  // camera.rotation.y = (30 + hOffset) * (Math.PI / 180);
  cameraGuide.x = cameraBase.x + (hOffset * -1 * shiftFactor.x);
  cameraGuide.y = cameraBase.y + (vOffset * shiftFactor.y);
  // camera.position.x = cameraBase.x + (hOffset * -1 * shiftFactor.x);
  // camera.position.y = cameraBase.y + (vOffset * shiftFactor.y);
  cameraGuide.z = (positionMax * 1.5) + (hOffset * shiftFactor.x);
}

function onMetricChange(e){
  const index = Number(e.srcElement.getAttribute('index'));
  metricsMap[index] = Number(e.srcElement.value);
  upateSpheres();
}

function pupetualRender(){
  let val = {n: 0};
  TweenLite.to(val, 1, {n: 1, onComplete: pupetualRender, onUpdate: () => {
    camera.position.x += (cameraGuide.x - camera.position.x) / 5;
    camera.position.y += (cameraGuide.y - camera.position.y) / 5;
    camera.position.z += (cameraGuide.z - camera.position.z) / 5;
    renderer.render(scene, camera);
  }});
}

function selectPoint (pointIndex) {
  if(pointIndex > -1){
    xBarSelected.position.x = spheres[pointIndex].position.x / 2;
    xBarSelected.position.y = spheres[pointIndex].position.y;
    xBarSelected.position.z = spheres[pointIndex].position.z;
    xBarSelected.scale.x = spheres[pointIndex].position.x;

    yBarSelected.position.x = spheres[pointIndex].position.x;
    yBarSelected.position.y = spheres[pointIndex].position.y / 2;
    yBarSelected.position.z = spheres[pointIndex].position.z;
    yBarSelected.scale.y = spheres[pointIndex].position.y;

    zBarSelected.position.x = spheres[pointIndex].position.x;
    zBarSelected.position.y = spheres[pointIndex].position.y;
    zBarSelected.position.z = spheres[pointIndex].position.z / 2;
    zBarSelected.scale.z = spheres[pointIndex].position.z * shiftFactor.x;
  }
  else{
    xBarSelected.scale.x = 0;
    yBarSelected.scale.y = 0;
    zBarSelected.scale.z = 0;
  }
  
}

window.onload = () => {
  initialize();
  const propertySelectorElement = document.querySelector('.propery-selectors');
  for(let i = 0; i < metricsMap.length; i++) {
    const metricContainer = document.createElement('div');
    metricContainer.style.color = `#${colors[i]}`;
    const select = document.createElement('select');
    metricContainer.appendChild(select);
    for(let j = 0; j < metrics.length; j++) {
      const option = document.createElement('option');
      option.setAttribute('value', j);
      option.innerHTML = metrics[j];
      select.appendChild(option);
    }
    propertySelectorElement.appendChild(metricContainer);
    select.value = i;
    select.setAttribute('index', i);
    select.addEventListener('change', onMetricChange);
  }
  
  
  const containerElement = document.querySelector('#three-stage');
  const _width = containerElement.getBoundingClientRect().width;
  const _height = containerElement.getBoundingClientRect().height;
  renderer = new THREE.WebGLRenderer({ alpha: true });
  // self.$data.renderer = new self.$data.THREE.WebGLRenderer()
  renderer.setSize(_width, _height);
  containerElement.appendChild(renderer.domElement);
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(perspective, _width / _height, 1, 1000);
  cameraGuide.x = cameraBase.x;
  cameraGuide.y = cameraBase.y;
  // cameraGuide.z = positionMax * 1.5;
  // camera.position.x = cameraBase.x;
  // camera.position.y = cameraBase.y;
  cameraGuide.z = positionMax * 1.5;
  camera.rotation.y = 30 * (Math.PI / 180) * shiftFactor.x;
  camera.rotation.x = -45 * (Math.PI / 180) * shiftFactor.x;
  camera.rotation.z = 30 * (Math.PI / 180) * shiftFactor.x;
  

  for(let i = 0; i < chartData.length; i++){
    spheres.push(createSphere());
  }
  xBar = createBox(Number(`0x${colors[0]}`));
  xBar.position.x = positionMax / 2;
  xBar.scale.x = positionMax;
  xBar.scale.y = .1;
  xBar.scale.z = .1;

  yBar = createBox(Number(`0x${colors[1]}`));
  yBar.position.y = positionMax / 2;
  yBar.scale.x = .1;
  yBar.scale.y = positionMax;
  yBar.scale.z = .1;

  zBar = createBox(Number(`0x${colors[2]}`));
  zBar.position.z = positionMax / 2;
  zBar.scale.x = .1 * shiftFactor.x;
  zBar.scale.y = .1 * shiftFactor.x;
  zBar.scale.z = positionMax * shiftFactor.x;

  xBarSelected = createBox(Number(`0x${colors[0]}`));
  xBarSelected.position.x = positionMax / 2;
  xBarSelected.scale.x = 0;
  xBarSelected.scale.y = .05;
  xBarSelected.scale.z = .05;

  yBarSelected = createBox(Number(`0x${colors[1]}`));
  yBarSelected.position.y = positionMax / 2;
  yBarSelected.scale.x = .05;
  yBarSelected.scale.y = 0;
  yBarSelected.scale.z = .05;

  zBarSelected = createBox(Number(`0x${colors[2]}`));
  zBarSelected.position.z = positionMax / 2;
  zBarSelected.scale.x = .05 * shiftFactor.x;
  zBarSelected.scale.y = .05 * shiftFactor.x;
  zBarSelected.scale.z = 0;


  upateSpheres();
  // console.log(spheres);
  // console.log(camera);

  mainElement = document.querySelector('main');
  mainElement.addEventListener("mousemove", onUserMove);
  document.querySelector('.perspective-toggle input').checked = true;
  document.querySelector('.perspective-toggle input').addEventListener('change', togglePerspective);

  pupetualRender();
}

// let camera = !self.isOrthographic > 0 ? new THREE.PerspectiveCamera(self.perspective, _width / _height, 1, 1000) : new THREE.OrthographicCamera(_width / (self.$data.axisData.scale * -2), _width / (self.$data.axisData.scale * 2), _height / (self.$data.axisData.scale * -2), _height / (self.$data.axisData.scale * 2), 1, 1000)
    