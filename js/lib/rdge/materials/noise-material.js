/* <copyright>
Copyright (c) 2012, Motorola Mobility LLC.
All Rights Reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice,
  this list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of Motorola Mobility LLC nor the names of its
  contributors may be used to endorse or promote products derived from this
  software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.
</copyright> */

var Material = require("js/lib/rdge/materials/material").Material;
var Texture = require("js/lib/rdge/texture").Texture;
var MathUtils = require("js/helper-classes/3D/math-utils").MathUtilsClass;

///////////////////////////////////////////////////////////////////////
// Class GLMaterial
//      RDGE representation of a material.
///////////////////////////////////////////////////////////////////////
var NoiseMaterial = function NoiseMaterial()
{
	var MaterialLibrary = require("js/models/materials-model").MaterialsModel;

	// initialize the inherited members
	this.inheritedFrom = Material;
	this.inheritedFrom();

	///////////////////////////////////////////////////////////////////////
	// Instance variables
	///////////////////////////////////////////////////////////////////////
	this._name = "Noise";
	this._shaderName = "noise";

	this._time = 0.0;
	this._dTime = 0.01;

	this._glTextures = [];

	this._perlinNoise = new PerlinNoise();
	this._xRes = 128;
	this._yRes = 128;

	///////////////////////////////////////////////////////////////////////
	// Property Accessors
	///////////////////////////////////////////////////////////////////////
	this.isAnimated = function () { return (MathUtils.fpSign(this.getSpeed()) != 0);	};
	this.getShaderDef = function () { return noiseMaterialDef; };

	this.hasNormalMap = function () { return true; }

	this._texMap = 'assets/images/cubelight.png';

	///////////////////////////////////////////////////////////////////////
	// Material Property Accessors
	///////////////////////////////////////////////////////////////////////


	var u_tex0_index = 0,
		u_xScale_index = 1,
		u_yScale_index = 2,
		u_speed_index = 3,
		u_color1_index = 4,
		u_color2_index = 5;

	this._propNames = ["u_tex0",		"u_xscale",	"u_yscale",	"u_speed",  "u_color1",  "u_color2"];
	this._propLabels = ["Texture map",	"X Scale",	"Y Scale",	"Speed",	"Color A",	"Color B"];
	this._propTypes = ["file",			"float",	"float",	"float",	"color",	"color"];
	this._propValues = [];

	this._propValues[this._propNames[u_tex0_index]] = this._texMap.slice(0);
	this._propValues[this._propNames[u_xScale_index]] = 10.0;
	this._propValues[this._propNames[u_yScale_index]] = 10.0;
	this._propValues[this._propNames[u_speed_index]] = 0.0;
	this._propValues[this._propNames[u_color1_index]] = [0, 0, 0,  1];
	this._propValues[this._propNames[u_color2_index]] = [1, 1, 1,  1];
	///////////////////////////////////////////////////////////////////////

	this.getXScale	= function()	{  return this._propValues[ this._propNames[u_xScale_index] ]	};
	this.getYScale = function () { return this._propValues[this._propNames[u_yScale_index]] };

	this.getColor1 = function () { return this._propValues[this._propNames[u_color1_index]].slice(); }
	this.getColor2 = function () { return this._propValues[this._propNames[u_color2_index]].slice(); }

	this.getSpeed = function () { return this._propValues[this._propNames[u_speed_index]]; }


	///////////////////////////////////////////////////////////////////////
	// Methods
	///////////////////////////////////////////////////////////////////////
	// duplicate method required

	this.init = function (world) {
		// save the world
		if (world) this.setWorld(world);
		this._xRes = world.getViewportWidth();
		this._yRes = world.getViewportHeight();
		this._xRes = 64;
		this._yRes = 64;

		// this variable declared above is inherited set to a smaller delta.
		// the noise material runs a little faster
		this._dTime = 0.01;

		// create a canvas to render the noise into
		var viewUtils = require("js/helper-classes/3D/view-utils").ViewUtils;
		var NJUtils = require("js/lib/NJUtils").NJUtils;
		var app = viewUtils.getApplication();
		this._renderCanvas = app.njUtils.make("canvas", { "data-RDGE-id": NJUtils.generateRandom() }, app.ninja.currentDocument);
		this.renderNoise(this._xRes, this._yRes, this.getXScale(), this.getYScale(), this._renderCanvas);
		var texture = new Texture(this.getWorld(), this._renderCanvas);
		this._glTextures["u_tex0"] = texture;

		// set up the shader
		this._shader = this.buildShader(noiseMaterialDef);

		// set up the material node
		this._materialNode = RDGE.createMaterialNode("noiseMaterial" + "_" + world.generateUniqueNodeID());
		this._materialNode.setShader(this._shader);

		this._time = 0;

		// set the shader values in the shader
		this.setShaderValues();
		this.update(0);
	};

	this.resetToDefault = function () {
		this._propValues[this._propNames[u_xScale_index]] = 10.0;
		this._propValues[this._propNames[u_yScale_index]] = 10.0;
		this._propValues[this._propNames[u_speed_index]] = 0.0;
		this._propValues[this._propNames[u_color1_index]] = [0, 0, 0, 1];
		this._propValues[this._propNames[u_color2_index]] = [1, 1, 1, 1];

		var nProps = this._propNames.length;
		for (var i = 0; i < nProps; i++)
		{
			var prop = this._propNames[i];
			if (prop != "u_tex0")
				this.setProperty(prop, this._propValues[prop]);
		}
	};

	this.update = function (time) {
		var material = this._materialNode;
		if (material) {
			var technique = material.shaderProgram['default'];
			var renderer = RDGE.globals.engine.getContext().renderer;
			if (renderer && technique) {
				var glTex = this._glTextures["u_tex0"];
				if (glTex) {
					// re-render the noise
					this.renderNoise(this._xRes, this._yRes, this.getXScale(), this.getYScale(), this._renderCanvas, this._time);
					glTex.render();
					var tex = glTex.getTexture();
					if (tex) {
						technique.u_tex0.set(tex);
						technique.u_normalMap.set(tex);
					}
				}

				this._time += this.getSpeed() * this._dTime;
			}
		}
	};

	this.renderNoise = function (w, h, xScale, yScale, noiseCanvas,  z)
	{
		noiseCanvas.width = w;
		noiseCanvas.height = h;

		// create the image data
		var ctx = noiseCanvas.getContext("2d");
		if (!ctx) throw new Error("Could not get 2D context for noise canvas");
		var imageData = ctx.createImageData(w, h);
		var data = imageData.data;

		var pn = this._perlinNoise;
		var r, g, b;
		var n;
		var index = 0;
		var c1 = this.getColor1(), c2 = this.getColor2();
		var yScale = this.getYScale(),  xScale = this.getXScale();
		for (var iRow = 0; iRow < h; iRow++) {
			var y = yScale * (iRow / h);
			for (iCol = 0; iCol < w; iCol++) {
				var x = xScale * (iCol / w);
				n = pn.noise(x, y, z);
				r = Math.round(255 * (c1[0] + n * (c2[0] - c1[0])));
				g = Math.round(255 * (c1[1] + n * (c2[1] - c1[1])));
				b = Math.round(255 * (c1[2] + n * (c2[2] - c1[2])));

				//r = 255; g = 0; b = 0;

				data[index] = r;
				data[index + 1] = g;
				data[index + 2] = b;
				data[index + 3] = 255;

				index += 4;
			}
		}

		ctx.putImageData(imageData, 0, 0);
		return noiseCanvas;
	}
}


	//////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////

		// This is a port of Ken Perlin's Java code.
		PerlinNoise = function () {
	
			var p = new Array(512)
			var permutation = [151, 160, 137, 91, 90, 15,
				131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23,
				190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
				88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166,
				77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244,
				102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196,
				135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123,
				5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42,
				223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
				129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228,
				251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107,
				49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
				138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180
			];
			for (var i = 0; i < 256 ; i++)
				p[256 + i] = p[i] = permutation[i];
	
			this.noise = function (x, y, z) {
	
				var X = Math.floor(x) & 255,                  // FIND UNIT CUBE THAT
					Y = Math.floor(y) & 255,                  // CONTAINS POINT.
					Z = Math.floor(z) & 255;
				x -= Math.floor(x);                                // FIND RELATIVE X,Y,Z
				y -= Math.floor(y);                                // OF POINT IN CUBE.
				z -= Math.floor(z);
				var u = fade(x),                                // COMPUTE FADE CURVES
					   v = fade(y),                                // FOR EACH OF X,Y,Z.
					   w = fade(z);
				var A = p[X] + Y, AA = p[A] + Z, AB = p[A + 1] + Z,      // HASH COORDINATES OF
					B = p[X + 1] + Y, BA = p[B] + Z, BB = p[B + 1] + Z;      // THE 8 CUBE CORNERS,
	
				return scale(lerp(w, lerp(v, lerp(u, grad(p[AA], x, y, z),  // AND ADD
											   grad(p[BA], x - 1, y, z)), // BLENDED
									   lerp(u, grad(p[AB], x, y - 1, z),  // RESULTS
											   grad(p[BB], x - 1, y - 1, z))),// FROM  8
							   lerp(v, lerp(u, grad(p[AA + 1], x, y, z - 1),  // CORNERS
											   grad(p[BA + 1], x - 1, y, z - 1)), // OF CUBE
									   lerp(u, grad(p[AB + 1], x, y - 1, z - 1),
											   grad(p[BB + 1], x - 1, y - 1, z - 1)))));
			}
	
			function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); };
	
			function lerp(t, a, b) { return a + t * (b - a); };
	
			function grad(hash, x, y, z) {
				var h = hash & 15;                      // CONVERT LO 4 BITS OF HASH CODE
				var u = h < 8 ? x : y,                 // INTO 12 GRADIENT DIRECTIONS.
					   v = h < 4 ? y : h == 12 || h == 14 ? x : z;
				return ((h & 1) == 0 ? u : -u) + ((h & 2) == 0 ? v : -v);
			};
	
			function scale(n) { return (1 + n) / 2; };
		}
	
		function turbulence(x, y, z, octaves) {
	
			var t = 0;
			var f = 1;
			var n = 0;
	
			for (var i = 0; i < octaves; i++, f *= 2) {
				n += PerlinNoise.noise(x * f, y * f, z) / f;
				t += 1 / f;
			}
			return n / t;  // rescale back to 0..1
		}
	
		// Perlin's bias function
		function bias(a, b) {
			return Math.pow(a, Math.log(b) / Math.log(0.5));
		}

	//////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////

	///////////////////////////////////////////////////////////////////////////////////////
	// RDGE shader

	// shader spec (can also be loaded from a .JSON file, or constructed at runtime)
		var noiseMaterialDef =
		{
			'shaders':
			{
				'defaultVShader':"assets/shaders/Basic.vert.glsl",
				'defaultFShader':"assets/shaders/BasicTex.frag.glsl"
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
							'u_tex0': { 'type': 'tex2d' },
							'u_normalMap': { 'type': 'tex2d' },
							'u_time': { 'type': 'float' },
							'u_speed'  : { 'type' : 'float' },
							'u_xscale' : { 'type' : 'float' },
							'u_yscale' : { 'type' : 'float' },
							'u_color1' : { 'type': 'vec4' },
							'u_color2' : { 'type' : 'vec4' }
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

	if (typeof exports === "object") {
		exports.NoiseMaterial = NoiseMaterial;
	}

