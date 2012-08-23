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

//var Texture = require("js/lib/rdge/texture").Texture;


///////////////////////////////////////////////////////////////////////
// Class Light
//     Base light class
///////////////////////////////////////////////////////////////////////
var Light = function Light()
{
    this.LIGHT_TYPE_UNDEFINED    = -1;
    this.LIGHT_TYPE_AMBIENT      =  0;
    this.LIGHT_TYPE_DIRECTIONAL  =  1;
    this.LIGHT_TYPE_POINT        =  2;
    this.LIGHT_TYPE_SPOT         =  3;

    ///////////////////////////////////////////////////////////////////////
    // Instance variables
    ///////////////////////////////////////////////////////////////////////
    this._type = this.LIGHT_TYPE_AMBIENT;    // ambient by default

    this._index = 0;        // the index of the set of uniform variables

    // all lights have an ambient, diffuse and specular component
    this._ambient  = [0.2, 0.2, 0.2,  1.0];
    this._diffuse  = [0.6, 0.6, 0.6,  1.0];
    this._specular = [1.0, 1.0, 1.0,  1.0];

    this._rdgeLightNode = RDGE.createLightNode("myLight");
    this._rdgeLightNode.setAmbientColor( this._ambient );
    this._rdgeLightNode.setDiffuseColor( this._diffuse );
    this._rdgeLightNode.setSpecularColor( this._specular );



    ///////////////////////////////////////////////////////////////////////
    // Editable properties
    ///////////////////////////////////////////////////////////////////////
    this._propNames = ["ambient"];
    this._propLabels = ["Ambient Color"];
    this._propTypes = ["color"];
    this._propValues = [];

    this._propValues[this._propNames[0]] = [0.2, 0.2, 0.2,  1.0];


    ///////////////////////////////////////////////////////////////////////
    // Property Accessors
    ///////////////////////////////////////////////////////////////////////
    this.getType        = function()    {  return this._type;               };
    this.setType        = function(t)   {  this._type = t;                  };
    
    this.getAmbient     = function()    {  return this._ambient.slice();    };
     this.setAmbient     = function(a)   {  this._ambient  = a.slice();      this._rdgeLightNode.setAmbientColor( this._ambient );      };
   
    this.getIndex       = function()    {  return this._index;              };
    this.setIndex       = function(i)   {  this._index = i;                 };

    this.getRDGELightNode   = function()    {  return this._rdgeLightNode;  };

    ///////////////////////////////////////////////////////////////////////
    // Common Methods
    ///////////////////////////////////////////////////////////////////////
    this.getAllProperties = function( propNames,  propValues,  propTypes,  propLabels) {
        // clear all the input arrays if there is junk in them
        propNames.length    = 0;
        propValues.length   = 0;
        propTypes.length    = 0;
        propLabels.length   = 0;

        var nProps = this._propNames.length;
        for (var i=0;  i<nProps;  i++) {
            propNames[i]    = this._propNames[i];
            propValues[i]   = this._propValues[this._propNames[i]];
            propTypes[i]    = this._propTypes[i];
            propLabels[i]   = this._propLabels[i];
        }
    };

    this.exportJSON = function()
    {
        var jObj =
        {
            'type'      : this.getType(),
            'ambient'   : this.getAmbient(),
//            'diffuse'   : this.getDiffuse(),
//            'specular'  : this.getSpecular()
        };

        return jObj;
    };

    this.importJSON = function (jObj)
    {
        this.setType( jObj.type );
        this.setAmbient( jObj.ambient );
        this.setDiffuse( jObj.diffuse );
        this.setSpecular( jObj.specular );
    };

    this.setUniforms = function()
    {
        if (this._type == this.LIGHT_TYPE_AMBIENT)
        {
            var name = "u_light" + this._index;
            RDGE.rdgeGlobalParameters[name + "Type"].set( [this.getType()] );
            RDGE.rdgeGlobalParameters[name +  "Amb"].set( this._ambient );
        }
    }
};

if (typeof exports === "object") {
    exports.Light = Light;
}
