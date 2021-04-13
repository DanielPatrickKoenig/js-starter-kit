

function createPaths(layer){
    var currentLayer = layer;
    app.executeMenuCommand("deselectall");
    var firstPointList = [];
    var closeStatuses = [];
    for(var i = 0; i < currentLayer.pathItems.length;i++){
        closeStatuses.push(currentLayer.pathItems[i].closed);
        currentLayer.pathItems[i].strokeDashes = new Array(1,12);
        firstPointList.push({left: currentLayer.pathItems[i].pathPoints[0].anchor[0], top: currentLayer.pathItems[i].pathPoints[0].anchor[1]});
        currentLayer.pathItems[i].selected = true;
    }

    app.executeMenuCommand("Expand3");
    app.executeMenuCommand("deselectall");
    var listGroup = [];
    var listGroupString = '[';
    var n = 0;
    for(var i = currentLayer.pageItems.length - 1; i >=0 ;i--){
        // $.writeln(currentLayer.pageItems[i]);
        listGroupString += n == 0 ? '' : ',';
        currentLayer.pageItems[i].selected = true;
        app.executeMenuCommand("ungroup");
        app.executeMenuCommand("noCompoundPath");
        listGroup.push([]);
        listGroupString+='['
        var m = 0;
        // var targetItem = currentLayer.pathItems[0];
        var targetItem = getClosestPathItem(firstPointList[i], currentLayer.pathItems);
        
        while(m < currentLayer.pathItems.length){
            
            listGroup[listGroup.length - 1].push(
                {
                    x: targetItem.left,
                    y: targetItem.top * -1
                }
            );

            listGroupString += m == 0 ? '' : ',';
            listGroupString += '{x:'+targetItem.left.toString()+',y:'+(targetItem.top * -1).toString()+'}';
            
            
            var pos = {left: targetItem.left, top: targetItem.top};
            targetItem.left = 10000;
            targetItem.top = 10000;
            targetItem = getClosestPathItem(pos, currentLayer.pathItems);
            
            
            // currentLayer.pathItems[j].remove();
            m++;
        }
        if(closeStatuses[i]){
            listGroup[listGroup.length - 1].push(
                {
                    x: listGroup[listGroup.length - 1][0].x,
                    y: listGroup[listGroup.length - 1][0].y
                }
            );
            listGroupString += ',{x:'+listGroup[listGroup.length - 1][0].x.toString()+',y:'+listGroup[listGroup.length - 1][0].y.toString()+'}';
        }
        
        for(var j = currentLayer.pathItems.length - 1; j >= 0;j--){
            currentLayer.pathItems[j].remove();
        }
        listGroupString += ']';
        n++;
        
    }
    listGroupString += ']';
    return listGroupString;
}


function getDistance(x1, y1, x2, y2) {

    var distx = x2 - x1;
    var disty = y2 - y1;
    return Math.sqrt(Math.pow(distx, 2) + Math.pow(disty, 2));
}
function getClosestPathItem(item, items){
    var closest = 99999999999;
    var closestItem = item;
    for(var i = 0; i < items.length; i++){
        var dist = getDistance(item.left, item.top, items[i].left, items[i].top);
        if(dist < closest){
            closest = dist;
            closestItem = items[i];
        }
    }
    return closestItem;

}

var fileContent = 'const Points = [';
//     {name: 'House', data: house},
//     {name: 'Happy', data: happy},
//     {name: 'Eye', data: eye},
//     {name: 'Person', data: person},
//     {name: 'Line Thing', data: linething}
// ]
// export default Points;

for(var i = 0; i < app.activeDocument.layers.length;i++){
    $.writeln(app.activeDocument.layers[i].name);
    fileContent += i > 0 ? ',' : '';
    var pathData = createPaths(app.activeDocument.layers[i]);
    fileContent += "{ name: '" + app.activeDocument.layers[i].name + "', data: " + pathData + "}";
}

fileContent += ']; export default Points;';

// var pathString = createPaths(app.activeDocument.layers[0]);
$.writeln(fileContent);
app.executeMenuCommand("undo");


var scriptFolderPath = File($.fileName).path; // the URI of the folder that contains the script file    

var JFile = new File(scriptFolderPath + encodeURI("/dot-and-outline-output.txt"));

    var content = fileContent;

    

    writeFile(JFile, content);

   

    

    // File.write(content);

    alert("File created!");

function writeFile(fileObj, fileContent, encoding) {

    encoding = encoding || "utf-8";

    fileObj = (fileObj instanceof File) ? fileObj : new File(fileObj);

    var parentFolder = fileObj.parent;

    if (!parentFolder.exists && !parentFolder.create())

        throw new Error("Cannot create file in path " + fileObj.fsName);

    fileObj.encoding = encoding;

    fileObj.open("w");

    fileObj.write(fileContent);

    fileObj.close();

    return fileObj;

}
