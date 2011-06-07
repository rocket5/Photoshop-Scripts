//@include "stdlib.js"
var docRef = app.activeDocument;
var layers = Stdlib.getLayersList(docRef, false, true);

for (var i = 0; i < layers.length; i++) {
   var layer = layers[i];
   renameLayer(layer);
}

// borrowed from RenameLayers.jsx by Mark Walsh
function renameLayer(objectRef) {
	var theRegEx = new RegExp(/(\s*copy\s*\d*)+$/);
	if (theRegEx.test(objectRef.name)) {
		// save state of layer (visible or invisible)
		var layerVisible = objectRef.visible;
		var indexNumber = 0;
		
		indexnumber = objectRef.name.indexOf(" copy");
		objectRef.name = objectRef.name.substr(0,indexnumber);
		objectRef.visible = layerVisible;
	}
	return 0;
}


