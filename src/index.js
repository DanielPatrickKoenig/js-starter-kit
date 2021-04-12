import './index.css'
import * as PIXI from 'pixi.js';
import {TweenLite, Sine} from 'gsap';
import jt from 'jstrig';
import nj from 'numjs';

const chartMargin = {top: 10, bottom : 15, left: 130, right: 10};
let chartSize = {width: 0, height: 0};
const dotStyles = [
  {fill: 0x000000, fillOpacity: 1, strokeWidth: 0, stroke: 0x000000, strokeOpacity: 0, radius: 4}
];
let particles = [];
let app;

const house = [[{x:300.94140625,y:289.755859375},{x:310.146484375,y:298.73681640625},{x:319.2763671875,y:307.99169921875},{x:328.4052734375,y:317.2470703125},{x:337.5341796875,y:326.50244140625},{x:346.6640625,y:335.75732421875},{x:355.79296875,y:345.01220703125},{x:364.921875,y:354.267578125},{x:374.0517578125,y:363.5224609375},{x:383.1806640625,y:372.77783203125},{x:392.3095703125,y:382.03271484375},{x:401.439453125,y:391.2880859375},{x:410.568359375,y:400.54296875},{x:419.6982421875,y:409.79736328125},{x:428.8271484375,y:419.05322265625},{x:437.9560546875,y:428.3076171875},{x:443.7236328125,y:436.27734375},{x:430.7236328125,y:436.27734375},{x:424.5,y:443.0537109375},{x:424.5,y:456.0537109375},{x:424.5,y:469.0537109375},{x:424.5,y:482.0537109375},{x:424.5,y:495.0537109375},{x:424.5,y:508.0537109375},{x:424.5,y:521.0537109375},{x:424.5,y:534.0537109375},{x:424.5,y:547.0537109375},{x:424.5,y:560.0537109375},{x:424.5,y:573.0537109375},{x:424.5,y:586.0537109375},{x:424.5,y:599.0537109375},{x:418.9462890625,y:606.5},{x:405.9462890625,y:606.5},{x:392.9462890625,y:606.5},{x:385.5,y:600.9462890625},{x:385.5,y:587.9462890625},{x:385.5,y:574.9462890625},{x:385.5,y:561.9462890625},{x:385.5,y:548.9462890625},{x:385.5,y:535.9462890625},{x:379.9462890625,y:528.5},{x:366.9462890625,y:528.5},{x:353.9462890625,y:528.5},{x:340.9462890625,y:528.5},{x:329.5,y:530.0537109375},{x:329.5,y:543.0537109375},{x:329.5,y:556.0537109375},{x:329.5,y:569.0537109375},{x:329.5,y:582.0537109375},{x:329.5,y:595.0537109375},{x:327.9462890625,y:606.5},{x:314.9462890625,y:606.5},{x:301.9462890625,y:606.5},{x:288.94580078125,y:606.5},{x:275.94580078125,y:606.5},{x:262.94580078125,y:606.5},{x:249.94580078125,y:606.5},{x:236.94580078125,y:606.5},{x:223.94580078125,y:606.5},{x:210.94580078125,y:606.5},{x:197.94580078125,y:606.5},{x:184.94580078125,y:606.5},{x:178.5,y:599.9462890625},{x:178.5,y:586.9462890625},{x:178.5,y:573.9462890625},{x:178.5,y:560.9462890625},{x:178.5,y:547.9462890625},{x:178.5,y:534.9462890625},{x:178.5,y:521.9462890625},{x:178.5,y:508.9462890625},{x:178.5,y:495.9462890625},{x:178.5,y:482.9462890625},{x:178.5,y:469.9462890625},{x:178.5,y:456.9462890625},{x:178.5,y:443.9462890625},{x:173.16845703125,y:436.27734375},{x:164.0029296875,y:428.9423828125},{x:160.16845703125,y:436.27734375},{x:173.13232421875,y:419.68798828125},{x:182.26123046875,y:410.43310546875},{x:191.390625,y:401.177734375},{x:200.52001953125,y:391.9228515625},{x:209.6494140625,y:382.66748046875},{x:218.7783203125,y:373.41259765625},{x:227.90771484375,y:364.1572265625},{x:237.037109375,y:354.90234375},{x:246.16650390625,y:345.6474609375},{x:255.29541015625,y:336.39208984375},{x:264.4248046875,y:327.13720703125},{x:273.55419921875,y:317.8818359375},{x:282.68310546875,y:308.626953125},{x:291.8125,y:299.37158203125}],[{x:235,y:489.5},{x:229.5,y:497},{x:229.5,y:510},{x:229.5,y:523},{x:229.5,y:536},{x:233,y:545.5},{x:246,y:545.5},{x:259,y:545.5},{x:272,y:545.5},{x:285,y:545.5},{x:285.5,y:543},{x:285.5,y:530},{x:285.5,y:517},{x:285.5,y:504},{x:285.5,y:491},{x:274,y:489.5},{x:261,y:489.5},{x:248,y:489.5}]];
const happy = [[{x:306.3447265625,y:245.09521484375},{x:319.3310546875,y:245.1865234375},{x:332.201171875,y:246.54150390625},{x:344.8671875,y:249.205078125},{x:357.197265625,y:253.1572265625},{x:369.0712890625,y:258.35888671875},{x:380.357421875,y:264.7490234375},{x:390.9404296875,y:272.25732421875},{x:400.7197265625,y:280.802734375},{x:409.5947265625,y:290.294921875},{x:417.474609375,y:300.64111328125},{x:424.27734375,y:311.732421875},{x:429.9267578125,y:323.46142578125},{x:434.3603515625,y:335.71044921875},{x:437.533203125,y:348.3525390625},{x:439.412109375,y:361.25537109375},{x:439.9912109375,y:373.62353515625},{x:439.2451171875,y:386.546875},{x:437.2001953125,y:399.33837890625},{x:433.86328125,y:411.8662109375},{x:429.2666015625,y:424.0068359375},{x:423.462890625,y:435.62109375},{x:416.513671875,y:446.595703125},{x:408.5,y:456.8212890625},{x:399.5029296875,y:466.1943359375},{x:389.6162109375,y:474.6201171875},{x:378.9375,y:482.01171875},{x:367.578125,y:488.2890625},{x:355.6455078125,y:493.3837890625},{x:343.263671875,y:497.2392578125},{x:330.5654296875,y:499.81640625},{x:317.6796875,y:501.0947265625},{x:304.6796875,y:501.0234375},{x:291.71875,y:499.611328125},{x:278.96484375,y:496.90234375},{x:266.55419921875,y:492.9140625},{x:254.61767578125,y:487.69140625},{x:243.27880859375,y:481.2919921875},{x:232.6513671875,y:473.7861328125},{x:222.8408203125,y:465.2568359375},{x:213.947265625,y:455.7919921875},{x:206.1171875,y:445.486328125},{x:199.263671875,y:434.4453125},{x:193.6328125,y:422.7802734375},{x:189.2275390625,y:410.6025390625},{x:186.09716796875,y:398.0419921875},{x:184.26953125,y:385.23095703125},{x:183.74560546875,y:372.29052734375},{x:184.42919921875,y:359.27490234375},{x:186.4228515625,y:346.404296875},{x:189.71826171875,y:333.8076171875},{x:194.2861328125,y:321.62255859375},{x:200.0751953125,y:309.9765625},{x:207.0205078125,y:298.9892578125},{x:215.04443359375,y:288.76806640625},{x:224.06298828125,y:279.41552734375},{x:233.9833984375,y:271.02685546875},{x:244.70654296875,y:263.689453125},{x:256.1240234375,y:257.48095703125},{x:268.12060546875,y:252.47119140625},{x:280.57958984375,y:248.7138671875},{x:293.36572265625,y:246.25}],[{x:270.21630859375,y:306.0595703125},{x:280.1953125,y:313.603515625},{x:282.3759765625,y:322.06103515625},{x:276.80126953125,y:333.28271484375},{x:264.904296875,y:337.27734375},{x:253.73828125,y:330.96337890625},{x:250.86279296875,y:318.79443359375},{x:257.6552734375,y:308.119140625}],[{x:365.310546875,y:306.0595703125},{x:375.291015625,y:313.603515625},{x:377.4716796875,y:322.06103515625},{x:371.896484375,y:333.28271484375},{x:360.0009765625,y:337.27734375},{x:348.8349609375,y:330.96240234375},{x:345.958984375,y:318.79345703125},{x:352.75,y:308.119140625}],[{x:234.6904296875,y:389.58447265625},{x:241.78515625,y:400.47265625},{x:250.23583984375,y:410.34716796875},{x:259.87939453125,y:419.07470703125},{x:270.64306640625,y:426.396484375},{x:282.396484375,y:432.025390625},{x:294.90576171875,y:435.7294921875},{x:307.849609375,y:437.40625},{x:320.7998046875,y:437.0009765625},{x:333.48828125,y:434.5439453125},{x:345.64453125,y:430.0771484375},{x:356.98046875,y:423.763671875},{x:367.296875,y:415.86767578125},{x:376.4892578125,y:406.671875},{x:384.478515625,y:396.4033203125}]];
const eye = [[{x:294.86083984375,y:341.7177734375},{x:307.5947265625,y:343.7177734375},{x:319.8916015625,y:347.6748046875},{x:331.56640625,y:353.2744140625},{x:342.57421875,y:360.14208984375},{x:352.9794921875,y:367.9296875},{x:362.896484375,y:376.3388671875},{x:372.4921875,y:385.1220703125},{x:381.962890625,y:394.0439453125},{x:391.5654296875,y:402.82470703125},{x:401.669921875,y:411.0234375},{x:412.8505859375,y:417.6943359375},{x:420.578125,y:422.8427734375},{x:412.23046875,y:432.818359375},{x:402.6884765625,y:441.6513671875},{x:392.2099609375,y:449.333984375},{x:380.955078125,y:455.814453125},{x:369.08203125,y:461.05078125},{x:356.740234375,y:465.0341796875},{x:344.076171875,y:467.791015625},{x:331.2197265625,y:469.375},{x:318.27734375,y:469.861328125},{x:305.2529296875,y:469.2783203125},{x:292.30712890625,y:467.84375},{x:279.4169921875,y:466.0517578125},{x:266.56396484375,y:464.013671875},{x:253.75390625,y:461.7412109375},{x:240.9853515625,y:459.23046875},{x:228.26416015625,y:456.490234375},{x:215.59326171875,y:453.521484375},{x:202.97802734375,y:450.3251953125},{x:190.42236328125,y:446.8984375},{x:177.9345703125,y:443.2353515625},{x:165.5390625,y:439.326171875},{x:153.23974609375,y:435.1416015625},{x:140.63623046875,y:429.9140625},{x:149.89501953125,y:420.693359375},{x:159.3935546875,y:411.7734375},{x:169.119140625,y:403.1103515625},{x:179.0712890625,y:394.7109375},{x:189.2578125,y:386.59912109375},{x:199.6943359375,y:378.8125},{x:210.40087890625,y:371.40478515625},{x:221.4013671875,y:364.44580078125},{x:232.73193359375,y:358.03466796875},{x:244.42529296875,y:352.31103515625},{x:256.5126953125,y:347.474609375},{x:269.0107421875,y:343.8173828125},{x:281.8798828125,y:341.7587890625}],[{x:229.4990234375,y:363.404296875},{x:226.34716796875,y:376.046875},{x:225.6611328125,y:389.0654296875},{x:227.328125,y:401.83837890625},{x:231.47412109375,y:414.05224609375},{x:237.94140625,y:425.2392578125},{x:246.47314453125,y:434.9970703125},{x:256.7490234375,y:442.9619140625},{x:268.392578125,y:448.828125},{x:280.97021484375,y:452.3583984375},{x:293.98095703125,y:453.40625},{x:306.7822265625,y:451.818359375},{x:319.0712890625,y:447.7841796875},{x:330.376953125,y:441.4609375},{x:340.2919921875,y:433.0947265625},{x:348.4482421875,y:423.001953125},{x:354.5341796875,y:411.55419921875},{x:358.30078125,y:399.1787109375},{x:359.6123046875,y:386.3408203125},{x:358.2626953125,y:373.337890625}],[{x:290.365234375,y:354.54541015625},{x:303.06640625,y:356.15283203125},{x:314.0625,y:362.72119140625},{x:321.662109375,y:373.22900390625},{x:324.6044921875,y:385.98388671875},{x:324.0498046875,y:392.02783203125},{x:319.1640625,y:403.904296875},{x:310.041015625,y:413.03076171875},{x:298.1689453125,y:417.92626953125},{x:285.23193359375,y:417.56494140625},{x:273.42041015625,y:412.05615234375},{x:264.80615234375,y:402.4736328125},{x:260.80517578125,y:390.3759765625},{x:261.76806640625,y:377.4326171875},{x:267.71826171875,y:365.94287109375},{x:277.79052734375,y:357.86865234375}]];
const person = [[{x:300.5830078125,y:308.185546875},{x:313.259765625,y:309.98876953125},{x:324.630859375,y:315.95361328125},{x:333.7861328125,y:325.11767578125},{x:340.2822265625,y:336.4072265625},{x:343.9697265625,y:348.94287109375},{x:344.8720703125,y:359.47265625},{x:343.255859375,y:372.2578125},{x:338.8046875,y:384.39404296875},{x:331.5693359375,y:395.13623046875},{x:321.7509765625,y:403.58447265625},{x:309.9169921875,y:408.6767578125},{x:297.0439453125,y:409.45068359375},{x:284.53662109375,y:405.66748046875},{x:273.9013671875,y:398.19775390625},{x:265.830078125,y:388.095703125},{x:260.578125,y:376.32763671875},{x:258.2158203125,y:363.68017578125},{x:258.5693359375,y:350.67822265625},{x:261.71142578125,y:338.0341796875},{x:267.73583984375,y:326.53076171875},{x:276.5361328125,y:317.02294921875},{x:287.77099609375,y:310.5625}],[{x:355.7333984375,y:403.5},{x:344.626953125,y:407.5234375},{x:335.4296875,y:416.6865234375},{x:324.5419921875,y:423.72265625},{x:312.380859375,y:428.0693359375},{x:299.53515625,y:429.2841796875},{x:286.6376953125,y:427.09765625},{x:274.67138671875,y:421.9052734375},{x:264.2099609375,y:414.1884765625},{x:255.57861328125,y:404.517578125},{x:243.38671875,y:403.5},{x:231.4462890625,y:408.0654296875},{x:226.50048828125,y:419.8330078125},{x:226.5,y:432.8642578125},{x:226.5,y:445.8642578125},{x:226.5,y:458.8642578125},{x:226.5,y:471.8642578125},{x:226.5,y:484.8642578125},{x:226.5,y:497.8642578125},{x:226.5,y:510.8642578125},{x:226.5,y:523.8642578125},{x:230.8642578125,y:532.5},{x:243.8642578125,y:532.5},{x:256.8642578125,y:532.5},{x:269.8642578125,y:532.5},{x:282.8642578125,y:532.5},{x:295.8642578125,y:532.5},{x:308.8642578125,y:532.5},{x:321.8642578125,y:532.5},{x:334.8642578125,y:532.5},{x:347.8642578125,y:532.5},{x:360.8642578125,y:532.5},{x:373.8642578125,y:532.5},{x:377.5,y:532},{x:377.5,y:519},{x:377.5,y:506},{x:377.5,y:493},{x:377.5,y:480},{x:377.5,y:467},{x:377.5,y:454},{x:377.5,y:441},{x:377.5,y:428},{x:376.5,y:414.94970703125},{x:368.2529296875,y:405.25927734375}]];
let shapes = [
  {name: 'Happy', data: happy},
  {name: 'House', data: house},
  {name: 'Eye', data: eye},
  {name: 'Person', data: person}
];
let points = shapes[0].data;
let ratio = 0;
let paths = [];
let distances = [];
let position = {x: 0, y: 0};

let chartData = [
  {label: 'Value 1', particles: [], value: 12},
  {label: 'Value 2', particles: [], value: 9},
  {label: 'Value 3', particles: [], value: 14},
  {label: 'Value 4', particles: [], value: 4}
];

function getDataTotal () {
  let total = 0;
  for(let i = 0; i < chartData.length; i++) {
    total+=chartData[i].value;
  }
  return total;
}

function populateData () {
  const total = getDataTotal();
  let dataIndex = 0;
  let valueCumulation = chartData[0].value;
  // console.log(total);
  // console.log(valueCumulation);
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
  chartSize.width = appSize.width - (chartMargin.left + chartMargin.right);
  chartSize.height = appSize.height - (chartMargin.top + chartMargin.bottom);
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
    // totalPathDistance = total;
    // console.log(distances);
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
    // console.log(targetGroupIndex);
    // console.log(groupRatio);
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


function mapToShape (index, pList, offset) {
  const particleList = pList ? pList : particles;
  setPoints(shapes[index].data, .5);
  for(let i = 1; i < particleList.length; i++){
      let targetPos = plot(i/particleList.length);
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
      console.log(targetPos);
      tweenSteps(particleList[i], [{duration: xInDuration, ease: Math.random() > .5 ? Sine.easeIn : Sine.easeOut, values: {x: getRandomPointPosition().x}}, {duration: xOutDuration, ease: Math.random() > .5 ? Sine.easeOut : Sine.easeIn, values: {x: targetPos.x}}], update, completed);
      tweenSteps(particleList[i], [{duration: yInDuration, ease: Math.random() > .5 ? Sine.easeOut : Sine.easeIn, values: {y: getRandomPointPosition().y}}, {duration: yOutDuration, ease: Math.random() > .5 ? Sine.easeIn : Sine.easeOut, values: {y: targetPos.y}}], update, completed);
  }
}
function update(){
  // console.log(particles[20]);
}
function completed(){
  console.log('COMPLETED!!!!!');
}
function getRandomPointPosition () {
  return {x: Math.random() * 1000, y: Math.random() * 800};
}

function rendrerChart(index){
  populateData();
  const shift = 300;
  for(let i = 0; i < chartData.length; i++){
    mapToShape(index, chartData[i].particles, {x: shift * i, y: 0});
  }
}

function init (count) {
  // processRatios();
  const container = new PIXI.Sprite();
  app.stage.addChild(container);
  container.scale.x = .33;
  container.scale.y = container.scale.x;
  for(let i = 0; i < count; i++){
    const dot = createDot({x: 0, y: 0}, dotStyles[0]);
    const randomPos = getRandomPointPosition();
    dot.position.x = randomPos.x;
    dot.position.y = randomPos.y;
    container.addChild(dot);
    particles.push(dot.position);
  }
  // setInterval(() => {mapToShape(Math.floor(Math.random() * 3));}, 5000);
  // populateData();
  // console.log(chartData);
  // mapToShape(0);
  rendrerChart(0);
}



window.onload = () => {
  app = createApp();
  init(300);
  // setInterval(() => {mapToShape(Math.floor(Math.random()*3));}, 5000);
};