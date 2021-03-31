import './index.css'
import * as PIXI from 'pixi.js';
import {TweenLite, Sine} from 'gsap';
let app = {};
let data = {};
let colors = [0xcc0000, 0x00cc00, 0x0000cc];
let bars = [];
const chartMargin = {top: 10, bottom : 15, left: 130, right: 10};
const waveCount = 6;
let chartSize = {width: 0, height: 0};
let barValues = [];
let mode = 0;
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
  data = {
    value1: {
      label: 'Value 1',
      value: Number(document.querySelector('#value1').value)
    },
    value2: {
      label: 'Value 2',
      value: Number(document.querySelector('#value2').value)
    },
    value3: {
      label: 'Value 3',
      value: Number(document.querySelector('#value3').value)
    }
  };
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
  let highest = getHighestValue();
  let keys = Object.keys(data);
  for(let i = 0; i < keys.length; i++){
    let height = (data[keys[i]].value / highest) * chartSize.height;
    // barValues.push({ height });
    if (barValues[i].height != height) {
      TweenLite.to(barValues[i], .5, {height});
      barValues[i].intensity = (Math.random() * .75) + 1.6;
    }
  }
}
function redraw (barVal, index) {
  let offset = chartSize.width * .33 * index;
  let barWidth = chartSize.width * .28;
  let points = [
    {x: chartMargin.left + barWidth + offset, y: chartMargin.top + chartSize.height},
    {x: chartMargin.left + offset, y: chartMargin.top + chartSize.height}
  ];
  for(let i = 0; i < barVal.wave.length; i++){
    let point =  {
      x: chartMargin.left + ((barWidth / (barVal.wave.length - 1)) * i) + offset, 
      y: chartMargin.top + chartSize.height - barVal.height + barVal.wave[i].y,
    };
    if(i > 0){
      point.curves = 2;
    }
    points.push(point);
  }
  let bar = createBar(colors[index], points, bars[index], (barWidth / waveCount) / 2);
  if(!bars[index]){
    bars.push(bar);
    app.stage.addChild(bar);
  }
  if(barValues[index].intensity > 0){
    barValues[index].intensity -= .0002;
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