// ***************************************************************************
// Export 2DBlogProject_pt1.jsx by Tim Miller, May 25th 2011
// www.rocket5studios.com
// www.twitter.com/rocket5studios
//
// This script is from part 1 in a series on using Photoshop as a level editor for Corona SDK
// Check my blog at www.rocket5studios.com/blog for updates
//
// Photoshop setup:
// Art .png's go in a group named "tiles"
// Collision vector objects go in a group named "collision"
// ***************************************************************************

var docRef = app.activeDocument;
var layers = docRef.layerSets;
var output = "";
var tileVars = "tiles";
var colliderVars = "colliders";
var tex_name;
var var_name;
var tx;
var ty;
var res_width;
var res_height;
var pos_x;
var pos_y;
var objNum = 0;

function getLayerInfo(layer) {
	tex_name = layer.name;
	var_name = layer.name;

	// layer position
	tx = getObjectLeft(layer);
	ty = getObjectTop(layer);

	// texture size
	res_width = getObjectWidth(layer);
	res_height = getObjectHeight(layer);

	// layer position offset
	pos_x = tx + res_width*0.5;
	pos_y = ty + res_height*0.5;
}

function main() {
	
	output += headerString();
	
	for (var i=0, il=layers.length; i<il; i++) {
		
		var layer = layers[i];
		var artLayers = layer.artLayers;
	
		output += subGroupHeaderString(layer.name);
	
		for (var a=0, al=artLayers.length; a<al; a++) {
		
			var artLayer = artLayers[a];
						
			getLayerInfo(artLayer);
			
			if(layer.name.search(/tiles/) != -1) {
				output += newImageRectString(tileVars, var_name, "midground", tex_name, res_width, res_height, pos_x, pos_y);
			}
			
			else if (layer.name.search(/collision/) != -1) {
				output += colliderString(colliderVars, "collider", "collision", tx, ty, res_width, res_height);
			}
		}

	}
	
	output += footerString();
	
	saveFile();
}

main();

function newImageRectString(var_table, var_name, layerSet, tex_name, res_width, res_height, pos_x, pos_y) {
	return "\
	"+var_table+"[\""+var_name+"\"] = display.newImageRect("+layerSet+", \"sprites/"+tex_name+".png\", "+res_width+", "+res_height+"); "+var_table+"."+var_name+".x = "+pos_x+"; "+var_table+"."+var_name+".y = "+pos_y+"\
	";
}

function colliderString(var_table, var_name, current_layerSet, tx, ty, res_width, res_height) {
	
	// local door1_door_collide = display.newRect( sensor, 82, 128, 21, 46 ); door1_door_collide.name = "collide"
	// door1_door_collide.isVisible = false; physics.addBody( door1_door_collide, "static",  { isSensor = false } )
	
	return "\
	"+var_table+"[\""+var_name+"\"] = display.newRect("+current_layerSet+", "+tx+", "+ty+", "+res_width+", "+res_height+"); "+var_table+"."+var_name+".name = \"collide\"\
	"+var_table+"."+var_name+".isVisible = false; physics.addBody("+var_table+"."+var_name+", \"static\",  { isSensor = false })\
	";
}

function subGroupHeaderString(current_subLayerSet) {
	return "\
	-------------------------------------------------------------------------------------------------\
	-- "+current_subLayerSet+"\
	";
}

function headerString() {
return "\
-------------------------------------------------------------------------------------------------\
-- SETUP PHYSICS\
\
local physics = require \"physics\"\
physics.start()\
physics.setGravity(0, 20)\
--physics.setDrawMode(\"hybrid\")\
\
-------------------------------------------------------------------------------------------------\
-- iOS SETTINGS\
\
display.setStatusBar( display.HiddenStatusBar )\
--system.activate(\"multitouch\")\
\
local gameLayer = display.newGroup()\
\
function load()\
	\
	-------------------------------------------------------------------------------------------------\
	-- BACKGROUND\
	\
	local background = display.newGroup()\
	backgroundRec = display.newRect(background, 0, 0, 480, 320); backgroundRec:setFillColor(26, 25, 21)\
	gameLayer:insert(background)\
	\
	-------------------------------------------------------------------------------------------------\
	-- LAYER GROUPS\
	\
	local midground = display.newGroup()\
	local collision = display.newGroup()\
	gameLayer:insert(midground)\
	gameLayer:insert(collision)\
	\
	-------------------------------------------------------------------------------------------------\
	-- VARIABLE TABLES\
	\
	local "+tileVars+" ={}\
	local "+colliderVars+" ={}\
	";
}

function footerString() {
return "\
end\
\
load()\
";
}

/* ================== HELPER FUNCTIONS ============================= */

//get object x
function getObjectLeft(current_artElement) {
	return current_artElement.bounds[0].as("px");
}

//get object y
function getObjectTop(current_artElement) {
	return current_artElement.bounds[1].as("px");
}

//get object width
function getObjectWidth(current_artElement) {
	var elX = current_artElement.bounds[0].as("px");
	return current_artElement.bounds[2].as("px") - elX;
}

//get height of an object
function getObjectHeight(current_artElement) {
	var elY = current_artElement.bounds[1].as("px");
	return current_artElement.bounds[3].as("px") - elY;
}

/* ================== SAVE ============================= */

function saveFile() {
	// Verifies which kind of line feed
	if ($.os.search(/windows/i) != -1) {
		fileLineFeed = "Windows"
	} else {
		fileLineFeed = "Macintosh"
	}
	dire = docRef.path //current application folder
	fileOut = new File(dire+"/main.lua")
	fileOut.lineFeed = fileLineFeed
	fileOut.open("w", "TEXT", "????")
	fileOut.write(output)
	fileOut.close()
	alert("main.lua file was saved at "+dire);
}