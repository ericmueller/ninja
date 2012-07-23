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

var PulseMaterial = require("js/lib/rdge/materials/pulse-material").PulseMaterial;
var Texture = require("js/lib/rdge/texture").Texture;

///////////////////////////////////////////////////////////////////////
// Class GLMaterial
//      RDGE representation of a material.
///////////////////////////////////////////////////////////////////////
var WaterMaterial = function WaterMaterial()
{
    ///////////////////////////////////////////////////////////////////////
    // Instance variables
    ///////////////////////////////////////////////////////////////////////
    this._name = "Water";
    this._shaderName = "water";

    this._defaultTexMap = 'assets/images/rocky-normal.jpg';

    this._time = 0.0;
    this._dTime = 0.01;

    // array textures indexed by shader uniform name
    this._glTextures = [];

    this.isAnimated         = function()            {  return true;             };
    this.getShaderDef       = function()            {  return waterMaterialDef; };

    ///////////////////////////////////////////////////////////////////////
    // Properties
    ///////////////////////////////////////////////////////////////////////
    // all defined in parent PulseMaterial.js
    // load the local default value
    this._propNames         = ["u_tex0",        "u_emboss", "u_delta",      "u_intensity",      "u_speed"];
    this._propLabels        = ["Texture map",   "Emboss",   "Delta",        "Intensity",        "Speed"];
    this._propTypes         = ["file",          "float",    "float",            "float",        "float"];

    var u_tex_index         = 0,
        u_emboss_index      = 1,
        u_delta_index       = 2,
        u_intensity_index   = 3,
        u_speed_index       = 4;

    this._propValues        = [];
    this._propValues[ this._propNames[u_tex_index       ] ] = this._defaultTexMap.slice(0);
    this._propValues[ this._propNames[u_emboss_index    ] ] = 0.3;
    this._propValues[ this._propNames[u_delta_index     ] ] = 20.0;
    this._propValues[ this._propNames[u_intensity_index ] ] = 3.0;
    this._propValues[ this._propNames[u_speed_index     ] ] = 0.2;

    ///////////////////////////////////////////////////////////////////////
    // Methods
    ///////////////////////////////////////////////////////////////////////

    this.init = function (world) {
        // save the world
        if (world) this.setWorld(world);

        // set up the shader
        this._shader = new RDGE.jshader();
        this._shader.def = waterMaterialDef;
        this._shader.init();

        // set up the material node
        this._materialNode = RDGE.createMaterialNode("waterMaterial" + "_" + world.generateUniqueNodeID());
        this._materialNode.setShader(this._shader);

        this._time = 0;
        if (this._shader && this._shader['default'])
            this._shader['default'].u_time.set([this._time]);

        // set the shader values in the shader
        this.setShaderValues();
        this.setResolution([world.getViewportWidth(), world.getViewportHeight()]);
        this.update(0);
    };

	this.resetToDefault = function()
	{
		this._propValues[ this._propNames[u_tex_index		] ]	= this._defaultTexMap.slice(0);
		this._propValues[ this._propNames[u_emboss_index	] ]	= 0.3;
		this._propValues[ this._propNames[u_delta_index		] ]	= 20.0;
		this._propValues[ this._propNames[u_intensity_index	] ]	= 3.0;
		this._propValues[ this._propNames[u_speed_index		] ]	= 0.2;

		var nProps = this._propNames.length;
		for (var i=0; i<nProps;  i++)
			this.setProperty( this._propNames[i],  this._propValues[this._propNames[i]]  );
};
};

///////////////////////////////////////////////////////////////////////////////////////
// RDGE shader

// shader spec (can also be loaded from a .JSON file, or constructed at runtime)
var waterMaterialDef =
{ 'shaders':
    {
        'defaultVShader': "assets/shaders/Basic.vert.glsl",
        'defaultFShader': "assets/shaders/Water2.frag.glsl"
    },
    'techniques':
    {
        'default':
        [
            {
                'vshader': 'defaultVShader',
                'fshader': 'defaultFShader',
                // attributes
                'attributes':
                {
                    'vert': { 'type': 'vec3' },
                    'normal': { 'type': 'vec3' },
                    'texcoord': { 'type': 'vec2' }
                },
                // parameters
                'params':
                {
                    'u_tex0': { 'type': 'tex2d' },
                    'u_time': { 'type': 'float' },
                    'u_emboss': { 'type': 'float' },
                    'u_delta': { 'type': 'float' },
                    'u_speed': { 'type': 'float' },
                    'u_intensity': { 'type': 'float' },
                    'u_resolution': { 'type': 'vec2' }
                },

                // render states
                'states':
                {
                    'depthEnable': true,
                    'offset': [1.0, 0.1]
                }
            }
        ]
    }
};

var BlueSkyMaterial = function BlueSkyMaterial()
{
    // initialize the inherited members
    this.inheritedFrom = WaterMaterial;
    this.inheritedFrom();

    this._name = "Blue Sky";
    this._shaderName = "blueSky";

    this._defaultTexMap = 'assets/images/bluesky.png';
    this._propValues[this._propNames[0]] = this._defaultTexMap.slice(0);

    //this._diffuseColor = [0.5, 0.5, 0.5, 0.5];
    //this._propValues[this._propNames[1]] = this._diffuseColor.slice();

    this.init = function (world)
    {
        // save the world
        if (world) this.setWorld(world);

        // set up the shader
        this._shader = new RDGE.jshader();
        this._shader.def = waterMaterialDef;
        this._shader.init();

        // set up the material node
        this._materialNode = RDGE.createMaterialNode("blueSkyMaterial" + "_" + world.generateUniqueNodeID());
        this._materialNode.setShader(this._shader);

        this._time = 0;
        if (this._shader && this._shader['default'])
            this._shader['default'].u_time.set([this._time]);

        // set the shader values in the shader
        this.setShaderValues();
        this.setResolution([world.getViewportWidth(), world.getViewportHeight()]);
        this.update(0);
    }
}


BlueSkyMaterial.prototype = new PulseMaterial();
if (typeof exports === "object") {
    exports.BlueSkyMaterial = BlueSkyMaterial;
}


WaterMaterial.prototype = new PulseMaterial();

if (typeof exports === "object") {
    exports.WaterMaterial = WaterMaterial;
}
