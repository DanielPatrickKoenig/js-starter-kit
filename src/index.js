import './index.css'
import * as PIXI from 'pixi.js';
import {TweenLite, Sine} from 'gsap';
let app = {};
let data = {};
let colors = [0x24c2d9, 0xeb8e0a, 0xf04db1, 0x6ed75d, 0xa45bff, 0xc4cf7c, 0x989bad];
let bars = [];
const chartMargin = {top: 10, bottom : 15, left: 130, right: 10};
const waveCount = 6;
let chartSize = {width: 0, height: 0};
let barValues = [];
let sideLabelContainer;
let bottomLabelContainer;
const labelMatrix = [
  [1, 3], 
  [2, 3], 
  [3, 4], 
  [4, 5], 
  [5, 6],
  [10, 3], 
  [15, 4],
  [20, 5], 
  [50, 6], 
  [100, 5], 
  [250, 6], 
  [500, 4], 
  [1000, 5]
];
function createApp() {
  const appContainer = document.querySelector('.pixi-stage');
  const appSize = {
    width: appContainer.getBoundingClientRect().width,
    height: appContainer.getBoundingClientRect().height
  };
  chartSize.width = appSize.width - (chartMargin.left + chartMargin.right);
  chartSize.height = appSize.height - (chartMargin.top + chartMargin.bottom);
  return new PIXI.Application({
    view: appContainer,
    width: appSize.width,
    height: appSize.height,
    transparent: true,
  });
}
function initValues () {
  const inputs = document.querySelectorAll('input[type="number"]')
  for(let i = 0; i < inputs.length; i++){
    let wave = [];
    for(let j = 0; j < waveCount; j++){
      wave.push({y: 0});
    }
    let barVal = {
      height: 0,
      intensity: 1,
      wave
    };
    barValues.push(barVal);
    for(let j = 0; j < wave.length; j++){
      shiftPoint(wave[j], i, () => {redraw(barVal, i)});
    }
    inputs[i].value = Math.round(Math.random() * 100);
    inputs[i].addEventListener('change', updateValues);
    inputs[i].addEventListener('keyup', updateValues);
  }
}
function updateValues () {
  const inputs = document.querySelectorAll('.chart-inputs input[type="number"]');
  data = {};
  for(let i = 0; i < inputs.length; i++){
    const labelText = inputs[i].getAttribute('id');
    if(inputs[i].value > Number(inputs[i].getAttribute('max'))){
      inputs[i].value = inputs[i].getAttribute('max');
    }
    if(inputs[i].value < Number(inputs[i].getAttribute('min'))){
      inputs[i].value = inputs[i].getAttribute('min');
    }
    data[labelText] = {
      label: labelText,
      value: Number(inputs[i].value)
    }
  }
  render();
}
function getHighestValue(){
  let heighest = -9999999999999;
  for(let item in data){
    if(data[item].value > heighest){
      heighest = data[item].value;
    }
  }
  return heighest;

}
function render () {
  let maxVal = getHighestValue();
  const highest = createSideLabels(maxVal);
  let keys = Object.keys(data);
  for(let i = 0; i < keys.length; i++){
    let height = (data[keys[i]].value / highest) * chartSize.height;
    // barValues.push({ height });
    if (barValues[i].height != height) {
      TweenLite.to(barValues[i], .5, {height});
      const calculatedIntensity = (Math.random() * .75) + 1.6;
      barValues[i].intensity = calculatedIntensity < height ? calculatedIntensity : height;
    }
  }
  createBottomLabels();
}

function getDimensions (index) {
  const footprint = 1 / Object.keys(data).length;
  const offset = chartSize.width * footprint * index;
  const barWidth = chartSize.width * footprint * .8;
  return { footprint, offset, barWidth };
}

function redraw (barVal, index) {
  const dimensions = getDimensions(index);
  // let offset = chartSize.width * footprint * index;
  // let barWidth = chartSize.width * footprint * .8;
  let points = [
    {x: chartMargin.left + dimensions.barWidth + dimensions.offset, y: chartMargin.top + chartSize.height},
    {x: chartMargin.left + dimensions.offset, y: chartMargin.top + chartSize.height}
  ];
  for(let i = 0; i < barVal.wave.length; i++){
    let point =  {
      x: chartMargin.left + ((dimensions.barWidth / (barVal.wave.length - 1)) * i) + dimensions.offset, 
      y: chartMargin.top + chartSize.height - barVal.height + barVal.wave[i].y,
    };
    if(i > 0){
      point.curves = 2;
    }
    points.push(point);
  }
  let bar = createBar(colors[index], points, bars[index], (dimensions.barWidth / waveCount) / 2);
  if(!bars[index]){
    bars.push(bar);
    app.stage.addChild(bar);
  }
  if(barValues[index].intensity > 0){
    barValues[index].intensity -= .0002;
  }
  app.stage.addChild(sideLabelContainer);
}

function createSideLabels (max) {
  if(!sideLabelContainer){
    sideLabelContainer = new PIXI.Sprite();
    app.stage.addChild(sideLabelContainer);
  }
  for (let i = sideLabelContainer.children.length; i >= 0; i--) {
    sideLabelContainer.removeChild(sideLabelContainer.children[i]);
  }
  let labelIndex = 0;
  for (let i = 0; i < labelMatrix.length; i++) {
    if(labelMatrix[i][0] < max) {
      labelIndex = i + 1;
    }
  }
  for (let i = 0; i <= labelMatrix[labelIndex][1]; i++) {
    let label = new PIXI.Text((labelMatrix[labelIndex][0] / (labelMatrix[labelIndex][1] - 1)) * i,{fontFamily : 'Arial', fontSize: '12', fill: 0x000000, align: 'left'});
    label.y = (chartMargin.top + chartSize.height) - (chartSize.height / (labelMatrix[labelIndex][1] - 1) * i);
    sideLabelContainer.addChild(label);
    let g = new PIXI.Graphics();
    g.lineStyle(1,0x000000,1);
    g.moveTo(0, 0);
    g.lineTo(document.querySelector('.pixi-stage').getBoundingClientRect().width, 0);
    g.y = label.y;
    sideLabelContainer.addChild(g);
  }
  return labelMatrix[labelIndex][0];
}

function createBottomLabels (width) {
  if (!bottomLabelContainer) {
    bottomLabelContainer = new PIXI.Sprite();
    app.stage.addChild(bottomLabelContainer);
  }
  for (let i = bottomLabelContainer.children.length; i >= 0; i--) {
    bottomLabelContainer.removeChild(bottomLabelContainer.children[i]);
  }
  let keys = Object.keys(data);
  for(let i = 0; i < keys.length; i++){
    const dimensions = getDimensions(i);
    let label = new PIXI.Text(data[keys[i]].label, {fontFamily : 'Arial', fontSize: '12', fill: 0x000000});
    label.x = chartMargin.left + dimensions.offset + (dimensions.barWidth / 2);
    label.y = chartMargin.top + chartSize.height;
    label.anchor.x = 0.5;
    bottomLabelContainer.addChild(label);
  }
  
}

function createBar (color, path, graphic, spread) {
  let g = graphic ? graphic : new PIXI.Graphics();
  g.clear();
  g.beginFill(color,1);
  g.moveTo(path[0].x, path[0].y);
  for(let i = 1; i < path.length; i++){
      if(!path[i].curves){
        g.bezierCurveTo(path[i].x, path[i].y, path[i].x, path[i].y, path[i].x, path[i].y);
      }
      else if(path[i].curves == 2){
        g.bezierCurveTo(path[i-1].x + spread, path[i-1].y, path[i].x - spread, path[i].y, path[i].x, path[i].y);
      }
  }
  g.endFill();
  return g;
}
function shiftPoint (point, index, handler) {
  const maxShift = 10;
  TweenLite.to(point, (Math.random() * .2) + .5, {
    y: ((Math.random() * maxShift) - (maxShift / 2)) * barValues[index].intensity,
    onComplete: shiftPoint,
    onCompleteParams: [point, index, handler],
    onUpdate: () => {
      handler();
    },
    ease: Sine.easeInOut
  })
}
window.onload = () => {
  initValues();
  app = createApp();
  updateValues();
};