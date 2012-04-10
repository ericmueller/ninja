/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */

var MaterialParser		= require("js/lib/rdge/materials/material-parser").MaterialParser;
var Material			= require("js/lib/rdge/materials/material").Material;
var GLWorld				= require("js/lib/drawing/world").World;
var Texture				= require("js/lib/rdge/texture").Texture;

///////////////////////////////////////////////////////////////////////
// Class GLMaterial
//      RDGE representation of a material.
///////////////////////////////////////////////////////////////////////
var CloudMaterial = function CloudMaterial() {
    ///////////////////////////////////////////////////////////////////////
    // Instance variables
    ///////////////////////////////////////////////////////////////////////
	this._name = "CloudMaterial";
	this._shaderName = "cloud";

	this._texMap = 'assets/images/cloud2.jpg';
	this._diffuseColor = [0.5, 0.5, 0.5, 0.5];

	// base size of cloud polygons.  Random adjustments made to each quad
	this._cloudSize = 40;

	this._time = 0.0;
	this._dTime = 0.01;

	// parameter initial values
	this._time			= 0.0;
	this._surfaceAlpha	= 0.5;
	this._zmin			= 0.1;
	this._zmax			= 10.0;


    ///////////////////////////////////////////////////////////////////////
    // Property Accessors
    ///////////////////////////////////////////////////////////////////////
	this.getName		= function()	{ return this._name;			};
	this.getShaderName	= function()	{  return this._shaderName;		};

	this.getTextureMap			= function()		{  return this._propValues[this._propNames[0]] ? this._propValues[this._propNames[0]].slice() : null	};
	this.setTextureMap			= function(m)		{  this._propValues[this._propNames[0]] = m ? m.slice(0) : null;  this.updateTexture();  	};

	this.isAnimated			= function()			{  return true;					};

    ///////////////////////////////////////////////////////////////////////
    // Material Property Accessors
    ///////////////////////////////////////////////////////////////////////
	this._propNames			= ["texmap",		"diffusecolor"];
	this._propLabels		= ["Texture map",	"Diffuse Color"];
	this._propTypes			= ["file",			"color"];
	this._propValues		= [];

	this._propValues[ this._propNames[0] ] = this._texMap.slice(0);
	this._propValues[ this._propNames[1] ] = this._diffuseColor.slice();

    this.setProperty = function( prop, value )
	{
		if (prop === 'color')  prop = 'diffusecolor';

		// make sure we have legitimate imput
		var ok = this.validateProperty( prop, value );
		if (!ok) {
			console.log( "invalid property in Radial Gradient Material:" + prop + " : " + value );
        }

		switch (prop)
		{
			case "texmap":
				this.setTextureMap(value);
				break;

			case "color":
				break;
		}
	};
    ///////////////////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////////////////
    // Methods
    ///////////////////////////////////////////////////////////////////////
	// duplcate method requirde
	this.dup = function( world )
	{
		// save the world
		if (world)  this.setWorld( world );

		// allocate a new uber material
		var newMat = new CloudMaterial();

		// copy over the current values;
		var propNames = [],  propValues = [],  propTypes = [],  propLabels = [];
		this.getAllProperties( propNames,  propValues,  propTypes,  propLabels);
		var n = propNames.length;
		for (var i=0;  i<n;  i++) {
			newMat.setProperty( propNames[i], propValues[i] );
        }

		return newMat;
	};

	this.init = function( world )
	{
		var GLWorld = require("js/lib/drawing/world").World;

		// save the world
		if (world)  this.setWorld( world );

		// this variable declared above is inherited set to a smaller delta.
		// the cloud material runs a little faster
		this._dTime = 0.01;

		// create a canvas to render into
		var doc = world.getCanvas().ownerDocument;
		var canvasID = "__canvas__";
		this._srcCanvas = doc.createElement(canvasID);

		// build a world to do the rendering
		this._srcWorld = new GLWorld( this._srcCanvas, true );
		var srcWorld = this._srcWorld;

		// build the geometry
		var prim = this.buildGeometry();

		// set up the shader
		this._shader = new jshader();
		this._shader.def = cloudMaterialDef;
		this._shader.init();

		// set up the material node
		this._materialNode = createMaterialNode("cloudMaterial" + "_" + world.generateUniqueNodeID());
		this._materialNode.setShader(this._shader);

		// initialize the shader uniforms
		this._time = 0;
		if (this._shader && this._shader['default']) {
			var t = this._shader['default'];
			if (t)
			{
				t.u_time.set( [this._time] );
				t.u_surfaceAlpha.set( [this._surfaceAlpha] );
				t.u_zmin.set( [this._zmin] );
				t.u_zmax.set( [this._zmax] );
			}
        }

		// add the nodes to the tree
		var trNode = createTransformNode("objRootNode_" + this._srcWorld._nodeCounter++);
		srcWorld._rootNode.insertAsChild( trNode );
		trNode.attachMeshNode(srcWorld.renderer.id + "_prim_" + srcWorld._nodeCounter++, prim);
        trNode.attachMaterial( this._materialNode );

		// create the texture
		var wrap = 'REPEAT',  mips = true;
		this._glTex = new Texture( dstWorld, canvasID,  wrap, mips );

		// set the shader values in the shader
		this.updateTexture();
		this.update( 0 );
	};

	this.updateTexture = function() {
		var material = this._materialNode;
		if (material) {
			var technique = material.shaderProgram['default'];
			var renderer = g_Engine.getContext().renderer;
			if (renderer && technique) {
				var texMapName = this._propValues[this._propNames[0]];
				var wrap = 'REPEAT',  mips = true;
				var tex = this.loadTexture( texMapName, wrap, mips );

				if (tex) {
					technique.u_tex0.set( tex );
                }
			}
		}
	};

	this.update = function( time )
	{
		var material = this._materialNode;
		if (material)
		{
			var technique = material.shaderProgram['default'];
			var renderer = g_Engine.getContext().renderer;
			if (renderer && technique) {
				if (this._shader && this._shader['default']) {
					this._shader['default'].u_time.set( [this._time] );
                }
				this._time += this._dTime;

				if (this._glTex)
				{
					this._glTex.render();
					var tex = this._glTex.getTexture();
					technique.u_tex0.set( tex );
				}

                if (this._time > 200.0)  this._time = 0.0;
			}
		}
	};

	this.buildGeometry = function()
	{
		var RectangleGeometry	= require("js/lib/geom/rectangle").RectangleGeometry;

		RectangleGeometry.init();

		var verts	= [],
			norms	= [ [0,0,1], [0,0,1], [0,0,1], [0,0,1] ],
			uvs		= [ [0,0], [1,0], [1,1], [0,1] ];

		for ( i = 0; i < 2; i++ )
		{
			var x = Math.random() * 1000 - 500,
				y = - Math.random() * Math.random() * 200 - 15,
				z = i,
				zRot = Math.random() * Math.PI,
				size = this._cloudSize * Math.random() * Math.random() * 1.5 + 0.5;
			var sz = 0.5*size;

			verts[0] = [x-sz, y-sz, z];
			verts[1] = [x-sz, y+sz, z];
			verts[2] = [x+sz, y+sz, z];
			verts[3] = [x+sz, y-sz, z];
			RectangleGeometry.addQuad( verts,  normals, uvs )
		}

		return RectangleGeometry.buildPrimitive();
	};

	// JSON export
	this.exportJSON = function()
	{
		var jObj =
		{
			'material'		: this.getShaderName(),
			'name'			: this.getName(),
			'texture'		: this._propValues[this._propNames[0]]
		};

		return jObj;
	};

	this.importJSON = function( jObj )
	{
        if (this.getShaderName() != jObj.material)  throw new Error( "ill-formed material" );
        this.setName(  jObj.name );

        try {
			this._propValues[this._propNames[0]] = jObj.texture;
        }
        catch (e)
        {
            throw new Error( "could not import material: " + jObj );
        }
	}


	this.export = function() {
		// every material needs the base type and instance name
		var exportStr = "material: " + this.getShaderName() + "\n";
		exportStr += "name: " + this.getName() + "\n";

		var world = this.getWorld();
		if (!world)
			throw new Error( "no world in material.export, " + this.getName() );

		var texMapName =  this._propValues[this._propNames[0]];
		exportStr += "texture: " +texMapName + "\n";
		
		// every material needs to terminate like this
		exportStr += "endMaterial\n";

		return exportStr;
	};

	this.import = function( importStr ) {
		var pu = new MaterialParser( importStr );
		var material = pu.nextValue( "material: " );
		if (material != this.getShaderName())  throw new Error( "ill-formed material" );
		this.setName(  pu.nextValue( "name: ") );

		var rtnStr;
        try {
			this._propValues[this._propNames[0]] = pu.nextValue( "texture: " );

            var endKey = "endMaterial\n";
            var index = importStr.indexOf( endKey );
            index += endKey.length;
            rtnStr = importStr.substr( index );
        }
        catch (e)
        {
            throw new Error( "could not import material: " + importStr );
        }

		return rtnStr;
	}
};

///////////////////////////////////////////////////////////////////////////////////////
// RDGE shader
 
// shader spec (can also be loaded from a .JSON file, or constructed at runtime)
var cloudMaterialDef =
{'shaders': 
	{
		'defaultVShader':"assets/shaders/Cloud.vert.glsl",
		'defaultFShader':"assets/shaders/Cloud.frag.glsl"
	},
	'techniques':
	{ 
		'default':
		[
			{
				'vshader' : 'defaultVShader',
				'fshader' : 'defaultFShader',
				// attributes
				'attributes' :
				{
					'vert'  :   { 'type' : 'vec3' },
					'normal' :  { 'type' : 'vec3' },
					'texcoord'  :   { 'type' : 'vec2' }
				},
				// parameters
				'params' : 
				{
					'u_tex0'			: { 'type' : 'tex2d' },
					'u_time'			: { 'type' : 'float' },
					'u_surfaceAlpha'	: { 'type' : 'float' },
					'u_zmin'			: { 'type' : 'float' },
					'u_zmax'			: { 'type' : 'float' }
				},

				// render states
				'states' : 
				{
					'depthEnable' : true,
					'offset':[1.0, 0.1]
				}
			}
		]
	}
};




CloudMaterial.prototype = new Material();

if (typeof exports === "object") {
    exports.CloudMaterial = CloudMaterial;
}

