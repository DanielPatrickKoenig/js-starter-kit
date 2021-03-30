import './index.css'
import * as PIXI from 'pixi.js';
import {TweenLite} from 'gsap';
let app = {};
let data = {};
let colors = [0xcc0000, 0x00cc00, 0x0000cc];
let bars = [];
const chartMargin = {top: 10, bottom : 15, left: 130, right: 10};
let chartSize = {width: 0, height: 0};
let heightValus = [{height: 0}, {height: 0}, {height: 0}];
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
    // heightValus.push({ height });
    if (heightValus[i].height != height) {
      TweenLite.to(heightValus[i], .5, {height, onUpdate: () => {
        console.log(heightValus[i].height)
        redraw(heightValus[i].height, i);
      }});
    }
  }
}
function redraw (height, index) {
  let offset = chartSize.width * .33 * index;
  let points = [
    {x: chartMargin.left + offset, y: chartMargin.top + chartSize.height},
    {x: chartMargin.left + (chartSize.width * .28) + offset, y: chartMargin.top + chartSize.height},
    {x: chartMargin.left + (chartSize.width * .28) + offset, y: chartMargin.top + chartSize.height - height},
    {x: chartMargin.left + offset, y: chartMargin.top + chartSize.height - height}
    
  ];
  let bar = createBar(colors[index], points, bars[index]);
  if(!bars[index]){
    bars.push(bar);
    app.stage.addChild(bar);
  }

  // let firstRun = !bars.length;
  // if(mode == 0){
  //   let highest = getHighestValue();
  //   let i = 0;
  //   for(let item in data){
  //     let offset = chartSize.width * .33 * i;
  //     let points = [
  //       {x: chartMargin.left + offset, y: chartMargin.top + chartSize.height},
  //       {x: chartMargin.left + (chartSize.width * .28) + offset, y: chartMargin.top + chartSize.height},
  //       {x: chartMargin.left + (chartSize.width * .28) + offset, y: chartMargin.top + chartSize.height - ((data[item].value / highest) * chartSize.height)},
  //       {x: chartMargin.left + offset, y: chartMargin.top + chartSize.height - ((data[item].value / highest) * chartSize.height)}
        
  //     ];
  //     console.log(points);
  //     let bar = createBar(colors[i], points, bars[i]);
  //     if(firstRun){
  //       bars.push(bar);
  //       app.stage.addChild(bar);
  //     }
  //     i++;
  //   }
  // }
  // console.log(app);
  // console.log(data);
}
function createBar (color, path, graphic) {
  let g = graphic ? graphic : new PIXI.Graphics();
  g.clear();
  g.beginFill(color,1);
  g.moveTo(path[0].x, path[0].y);
  for(let i = 1; i < path.length; i++){
      if(!path[i].curves){
        g.lineTo(path[i].x, path[i].y);
      }
      else if(path[i].curves == 2){
        g.bezierCurveTo(path[i][0].x, path[i][0].y, path[i][1].x, path[i][1].y, path[i][2].x, path[i][2].y);
      }
  }
  g.endFill();
  return g;
}
window.onload = () => {
  initValues();
  app = createApp();
  updateValues();
};