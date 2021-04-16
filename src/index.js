import './index.css'
import * as PIXI from 'pixi.js';
import {TweenLite, Sine} from 'gsap';
import jt from 'jstrig';
import nj from 'numjs';


const chartColor = 0xcaedff;
const dotStyles = [
  {fill: chartColor, fillOpacity: 1, strokeWidth: 0, stroke: 0x000000, strokeOpacity: 0, radius: 4}
];
let particles = [];
let app;
const shift = 300;
let labelContainer;
const containerScale = .33;

const line = [[{x: 0, y: 0}, {x: 0, y: -200}]]
const happy = [[{x:120.56201171875,y:-119.43798828125},{x:120.27734375,y:-127.8408203125},{x:118.68408203125,y:-140.78466796875},{x:115.69873046875,y:-153.4765625},{x:111.353515625,y:-165.7587890625},{x:105.701171875,y:-177.48779296875},{x:98.814453125,y:-188.52734375},{x:90.779296875,y:-198.74951171875},{x:81.693359375,y:-208.03662109375},{x:71.66259765625,y:-216.2783203125},{x:60.8046875,y:-223.37451171875},{x:49.24267578125,y:-229.23681640625},{x:37.11376953125,y:-233.78759765625},{x:24.56884765625,y:-236.96826171875},{x:11.755859375,y:-238.74755859375},{x:-1.1982421875,y:-239.1416015625},{x:-14.2001953125,y:-238.22216796875},{x:-27.0146484375,y:-235.89453125},{x:-39.486328125,y:-232.17529296875},{x:-51.46044921875,y:-227.10791015625},{x:-62.79931640625,y:-220.76025390625},{x:-73.37255859375,y:-213.2109375},{x:-83.0576171875,y:-204.55419921875},{x:-91.74169921875,y:-194.89111328125},{x:-99.3203125,y:-184.33349609375},{x:-105.69921875,y:-173.005859375},{x:-110.796875,y:-161.0361328125},{x:-114.54541015625,y:-148.5693359375},{x:-116.90380859375,y:-135.76025390625},{x:-117.853515625,y:-122.76025390625},{x:-117.48681640625,y:-109.8017578125},{x:-115.73779296875,y:-96.98388671875},{x:-112.5859375,y:-84.43212890625},{x:-108.06640625,y:-72.2978515625},{x:-102.23681640625,y:-60.7314453125},{x:-95.17138671875,y:-49.86083984375},{x:-86.95751953125,y:-39.8134765625},{x:-77.69384765625,y:-30.70458984375},{x:-67.490234375,y:-22.642578125},{x:-56.46337890625,y:-15.724609375},{x:-44.74169921875,y:-10.041015625},{x:-32.4619140625,y:-5.66357421875},{x:-19.7763671875,y:-2.6484375},{x:-6.83642578125,y:-1.0244140625},{x:6.16845703125,y:-0.83349609375},{x:19.04736328125,y:-2.1015625},{x:31.72802734375,y:-4.76416015625},{x:44.05126953125,y:-8.79638671875},{x:55.87158203125,y:-14.150390625},{x:67.04345703125,y:-20.75634765625},{x:77.44482421875,y:-28.5322265625},{x:86.95361328125,y:-37.3828125},{x:95.45849609375,y:-47.2021484375},{x:102.85791015625,y:-57.87841796875},{x:109.05859375,y:-69.2880859375},{x:113.9814453125,y:-81.29736328125},{x:117.56298828125,y:-93.75732421875},{x:119.7607421875,y:-106.521484375},{x:120.56201171875,y:-119.43798828125}],[{x:-18.45751953125,y:-158.81689453125},{x:-19.54638671875,y:-165.61181640625},{x:-27.30615234375,y:-175.84326171875},{x:-39.48681640625,y:-178.9892578125},{x:-51.42041015625,y:-174.23681640625},{x:-57.5625,y:-163.009765625},{x:-55.798828125,y:-150.4541015625},{x:-46.58984375,y:-141.61865234375},{x:-33.8095703125,y:-140.22265625},{x:-23.07958984375,y:-147.05126953125},{x:-18.45751953125,y:-158.81689453125}],[{x:60.4775390625,y:-158.81689453125},{x:59.388671875,y:-165.61181640625},{x:51.62890625,y:-175.84326171875},{x:39.4482421875,y:-178.9892578125},{x:27.5146484375,y:-174.23681640625},{x:21.37255859375,y:-163.009765625},{x:23.13623046875,y:-150.4541015625},{x:32.34521484375,y:-141.61865234375},{x:45.12548828125,y:-140.22265625},{x:55.85546875,y:-147.05126953125},{x:60.4775390625,y:-158.81689453125}],[{x:-78.9169921875,y:-101.65966796875},{x:-72.01953125,y:-90.7021484375},{x:-63.4599609375,y:-80.9541015625},{x:-53.5048828125,y:-72.59765625},{x:-42.421875,y:-65.77197265625},{x:-30.47119140625,y:-60.57666015625},{x:-17.9013671875,y:-57.080078125},{x:-4.96728515625,y:-55.31640625},{x:8.0244140625,y:-55.3466796875},{x:20.83447265625,y:-57.16845703125},{x:33.29150390625,y:-60.72412109375},{x:45.154296875,y:-65.9794921875},{x:56.162109375,y:-72.86376953125},{x:66.06005859375,y:-81.2744140625},{x:74.58447265625,y:-91.0712890625},{x:81.47119140625,y:-101.65966796875}]];
const person = [[{x:34.169921875,y:-194.44140625},{x:32.861328125,y:-181.73486328125},{x:28.73291015625,y:-169.49169921875},{x:21.5625,y:-158.7216796875},{x:11.2314453125,y:-151.0205078125},{x:-1.35546875,y:-148.90673828125},{x:-13.50244140625,y:-153.64111328125},{x:-22.56884765625,y:-162.8525390625},{x:-28.3525390625,y:-174.3623046875},{x:-31.1416015625,y:-186.9287109375},{x:-31.251953125,y:-199.90380859375},{x:-28.71240234375,y:-212.6943359375},{x:-23.20263671875,y:-224.45947265625},{x:-14.43310546875,y:-233.9580078125},{x:-2.50390625,y:-238.9326171875},{x:10.19482421875,y:-237.58935546875},{x:20.78515625,y:-230.38330078125},{x:28.232421875,y:-219.73193359375},{x:32.61572265625,y:-207.42724609375},{x:34.169921875,y:-194.44140625}],[{x:39.37548828125,y:-154.25146484375},{x:46.59033203125,y:-151.42236328125},{x:56.76513671875,y:-143.48193359375},{x:64.57421875,y:-133.1103515625},{x:70.220703125,y:-121.37744140625},{x:74.2333984375,y:-108.98291015625},{x:77.064453125,y:-96.2705078125},{x:79.0322265625,y:-83.3994140625},{x:80.34912109375,y:-70.451171875},{x:81.1611328125,y:-57.46630859375},{x:81.572265625,y:-44.4638671875},{x:81.62451171875,y:-31.466796875},{x:80.9365234375,y:-18.521484375},{x:79.36328125,y:-5.64794921875},{x:70.72509765625,y:-0.5},{x:57.72509765625,y:-0.5},{x:44.72509765625,y:-0.5},{x:31.72509765625,y:-0.5},{x:18.72509765625,y:-0.5},{x:5.72509765625,y:-0.5},{x:-7.27490234375,y:-0.5},{x:-20.27490234375,y:-0.5},{x:-33.27490234375,y:-0.5},{x:-46.27490234375,y:-0.5},{x:-59.27490234375,y:-0.5},{x:-72.27490234375,y:-0.5},{x:-77.40673828125,y:-9.8388671875},{x:-78.626953125,y:-22.74658203125},{x:-78.9716796875,y:-35.71142578125},{x:-78.81201171875,y:-48.7177734375},{x:-78.30810546875,y:-61.71533203125},{x:-77.37744140625,y:-74.6923828125},{x:-75.90771484375,y:-87.62060546875},{x:-73.73779296875,y:-100.45068359375},{x:-70.6240234375,y:-113.08251953125},{x:-66.20947265625,y:-125.31298828125},{x:-59.98046875,y:-136.69970703125},{x:-51.40478515625,y:-146.3984375},{x:-40.4736328125,y:-153.34228515625},{x:-32.57275390625,y:-146.4951171875},{x:-24.15234375,y:-136.65771484375},{x:-13.35400390625,y:-129.4130859375},{x:-0.70068359375,y:-126.11181640625},{x:12.01611328125,y:-127.91015625},{x:23.3515625,y:-134.0830078125},{x:32.51416015625,y:-143.25},{x:39.37548828125,y:-154.25146484375}]];
let shapes = [
  {name: 'Happy', data: happy},
  {name: 'Line', data: line},
  {name: 'Person', data: person}
];
let points = shapes[0].data;
let ratio = 0;
let paths = [];
let distances = [];
let position = {x: 0, y: 0};
let chartData = [];
let shapeIndex = 0;

function getDataTotal () {
  let total = 0;
  for(let i = 0; i < chartData.length; i++) {
    total+=chartData[i].value;
  }
  return total;
}

function getHighest () {
  let highest = -99999999999;
  for(let i = 0; i < chartData.length; i++) {
    if(chartData[i].value > highest) {
      highest = chartData[i].value;
    }
  }
  return highest;
}

function populateData () {
  const total = getDataTotal();
  let dataIndex = 0;
  let valueCumulation = chartData[0].value;
  for (let i = 0; i < chartData.length; i++) {
    chartData[i].particles = [];
  }
  for (let i = 0; i < particles.length; i++) {
    const valueRatio = valueCumulation / total;
    if(i > valueRatio * particles.length){
      dataIndex++;
      valueCumulation+=chartData[dataIndex].value;
    }
    chartData[dataIndex].particles.push(particles[i]);
  }
}

function createApp() {
  const appContainer = document.querySelector('.pixi-stage');
  const appSize = {
    width: appContainer.getBoundingClientRect().width,
    height: appContainer.getBoundingClientRect().height
  };
  return new PIXI.Application({
    view: appContainer,
    width: appSize.width,
    height: appSize.height,
    transparent: true,
  });
}


function createDot (position, props, graphic) {
  let g = graphic ? graphic : new PIXI.Graphics();
  g.clear();
  g.beginFill(props.fill,props.fillOpacity);
  g.lineStyle(props.strokeWidth,props.stroke,props.strokeOpacity);
  g.drawCircle(position.x, position.y, props.radius);
  g.endFill();
  return g;
}

function processRatios() {
    let distList = [];
    for (let i = 0; i < points.length; i++) {
        paths.push(pointPath(points[i]));
        distList.push(paths[i][paths[i].length - 1].dist);
    }

    const total = nj.array(distList).sum();
    let cumulation = 0;
    for (let i = 0; i < distList.length; i++) {
        let value = distList[i];
        let distEntry = { lastSum: cumulation, value: value, ratioLastSum: cumulation / total, ratioValue: value / total };
        cumulation += value;
        distEntry.sum = cumulation;
        distEntry.ratioSum = cumulation / total;
        distances.push(distEntry);
    }
}
function pointPath(_points) {
    let breaks = [];
    let totalDistance = 0;
    breaks.push({ x: _points[0].x, y: _points[0].y, dist: totalDistance });
    for (let i = 1; i < _points.length; i++) {
        let dist = jt.distance(_points[i], _points[i - 1]);
        totalDistance += Number(dist);
        breaks.push({ x: _points[i].x, y: _points[i].y, dist: totalDistance });
    }
    return breaks;
}
function plotToPath(_ratio, _points) {
    const _path = pointPath(_points);
    const totalDistance = _path[_path.length - 1].dist;
    const _fullRat = totalDistance * _ratio;
    let _section = -1;
    for (let i = 1; i < _path.length; i++) {
        if (_fullRat <= _path[i].dist && _fullRat > _path[i - 1].dist) {
            _section = i - 1;
        }
    }
    const cData = _path[Number(_section)];
    const nData = _path[Number(_section + 1)];
    const base = nData.dist - cData.dist;
    const diff = _fullRat - cData.dist;
    const _newRat = diff / base;
    const newPoint = { x: cData.x + ((nData.x - cData.x) * _newRat), y: cData.y + ((nData.y - cData.y) * _newRat) };
    //trace(newPoint.x);
    return newPoint;
}
function plotToPathGroup(_ratio, _pathGroup) {
    let targetGroupIndex = 0;
    let groupRatio = 0;
    for (let i = 0; i < distances.length; i++) {
        if (_ratio < distances[i].ratioSum) {
            targetGroupIndex = i;

            i = distances.length;
        }
    }
    groupRatio = (_ratio - distances[targetGroupIndex].ratioLastSum) / distances[targetGroupIndex].ratioValue;
    return plotToPath(groupRatio, _pathGroup[targetGroupIndex]);
}
function plot (_ratio) {
    ratio = _ratio;
    position = plotToPathGroup(ratio, points);
    return position;
}
function setPoints (_points) {
    points = _points;
    paths = [];
    // let totalPathDistance = 0;
    distances = [];
    processRatios();
}
function getPosition () {
    return position;
}

function tweenSteps (target, steps, update, complete, _index) {
  const index = _index | 0;
  if (steps.length > index) {
      let tweenData = {
          onComplete: tweenSteps,
          ease: steps[index].ease ? steps[index].ease : Sine.easeInOut,
          onUpdate: update ? update : () => {},
          onUpdateParams: [index,target,steps],
          onCompleteParams: [target, steps, update, complete, index + 1]
      };
      for(let v in steps[index].values){
          tweenData[v] = steps[index].values[v];

      }
      TweenLite.to(target, Number(steps[index].duration), tweenData);
  }
  else {
      if (complete) {
          complete();
      }
  }
}
// function perpetuate(target,values,onUpdate,onIterate){
//   tweenSteps(target,values,onUpdate, () => {perpetuate(target,values,onUpdate,onIterate)},onIterate);
// }


function mapToShape (index, pList, offset, scale, scatter) {
  const particleList = pList ? pList : particles;
  setPoints(shapes[index].data, .5);
  particleList[0].alpha = 0;
  for(let i = 1; i < particleList.length; i++){
      particleList[i].alpha = 1;
      let targetPos = plot(i/particleList.length);
      targetPos.x = targetPos.x * scale;
      targetPos.y = targetPos.y * scale;
      // particleList[i].scale = i == 0 ? {x: 10, y: 10} : {x: 10, y: 10};
      if(offset){
        targetPos.x += offset.x;
        targetPos.y += offset.y;
      }
      // let easeToggle = Math.random();
      const durationTotal = 2;
      let xInDuration = (durationTotal / 4) + (Math.random() * (durationTotal / 2));
      let xOutDuration = durationTotal - xInDuration;
      let yInDuration = (durationTotal / 4) + (Math.random() * (durationTotal / 2));
      let yOutDuration = durationTotal - yInDuration;
      let xList = [];
      let yList = [];
      if(scatter){
        xList.push({duration: xInDuration, ease: Math.random() > .5 ? Sine.easeIn : Sine.easeOut, values: {x: getRandomPointPosition().x}});
        yList.push({duration: yInDuration, ease: Math.random() > .5 ? Sine.easeOut : Sine.easeIn, values: {y: getRandomPointPosition().y}});
      }
      xList.push({duration: xOutDuration, ease: Math.random() > .5 ? Sine.easeOut : Sine.easeIn, values: {x: targetPos.x}});
      yList.push({duration: yOutDuration, ease: Math.random() > .5 ? Sine.easeIn : Sine.easeOut, values: {y: targetPos.y}});
      tweenSteps(particleList[i].position, xList);
      tweenSteps(particleList[i].position, yList);
  }
}

function getRandomPointPosition () {
  return {x: Math.random() * 850, y: Math.random() * 600};
}

function rendrerChart(index, scatter){
  populateData();
  for(let i = 0; i < chartData.length; i++){
    mapToShape(index, chartData[i].particles, {x: shift * i, y: 550}, chartData[i].value / getHighest(), scatter);
  }
}

function renderSymbolSelectors(){
  const selectorContainer = document.querySelector('.symbol-selector');
  for(let i = 0; i < shapes.length; i++) {
    let label = document.createElement('label');
    let input = document.createElement('input');
    let text = document.createElement('span');
    input.setAttribute('type', 'radio');
    input.setAttribute('name', 'shape');
    input.setAttribute('val', i);
    if(i == 0) {
      input.checked = true;
    }
    input.addEventListener('change', (e) => {
      if(e.returnValue){
        shapeIndex = Number(e.currentTarget.getAttribute('val'));
        rendrerChart(shapeIndex, true);
      }
    })
    text.innerText = shapes[i].name;
    selectorContainer.appendChild(label);
    label.appendChild(input);
    label.appendChild(text);
  }
}

function createLabels(){
  for(let i = labelContainer.children.length; i >= 0; i--) {
    labelContainer.removeChild(labelContainer.children[i]);
  }
  for(let i = 0; i < chartData.length; i++) {
    let label = new PIXI.Text(chartData[i].label, {fontFamily : 'Arial', fontSize: 48, fill: chartColor});
    label.position.x = shift * i;
    label.position.y = 200;
    label.anchor.x = 0.5;
    labelContainer.addChild(label);
  }
}

function readData(){
  chartData = [];
  const valueElements = document.querySelectorAll('.values label');
  for(let i = 0; i < valueElements.length; i++) {
    const input = valueElements[i].querySelector('input[type="number"]');
    chartData.push({
      value: Number(input.value),
      label: valueElements[i].querySelector('span').innerText,
      particles: []
    });
    input.addEventListener('change', () => {
      chartData[i].value = Number(input.value);
      rendrerChart(shapeIndex);
    });
    input.addEventListener('keyup', () => {
      chartData[i].value = Number(input.value);
      rendrerChart(shapeIndex);
    });
  }
}

function init (count) {
  // processRatios();
  const container = new PIXI.Sprite();
  app.stage.addChild(container);
  container.scale.x = containerScale;
  container.scale.y = container.scale.x;
  labelContainer = new PIXI.Sprite();
  container.addChild(labelContainer);
  labelContainer.y = 400;
  readData();
  for(let i = 0; i < count; i++){
    const dot = createDot({x: 0, y: 0}, dotStyles[0]);
    const randomPos = getRandomPointPosition();
    dot.position.x = randomPos.x;
    dot.position.y = randomPos.y;
    container.addChild(dot);
    particles.push(dot);
  }
  container.x = ((chartData.length - 1) * shift * container.scale.x) / 3;
  createLabels();
  rendrerChart(shapeIndex, true);
  renderSymbolSelectors();
}



window.onload = () => {
  app = createApp();
  init(300);
  // setInterval(() => {mapToShape(Math.floor(Math.random()*3));}, 5000);
};