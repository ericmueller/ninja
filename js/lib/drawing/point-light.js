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


var DirectionalLight = require("js/lib/drawing/directional-light").DirectionalLight;


var PointLight = function PointLight()
{
    ///////////////////////////////////////////////////////////////////////
    // Properties
    ///////////////////////////////////////////////////////////////////////
    this._type = this.LIGHT_TYPE_POINT;

    this.getTypeName    = function()    {  return "point";  }

    ///////////////////////////////////////////////////////////////////////
    // Editable properties
    ///////////////////////////////////////////////////////////////////////
    this._propNames = ["ambient",               "diffuse",              "specular",             "position" ];
    this._propLabels = ["Ambient Color",        "Diffuse Color",        "Specular Color",       "Position" ];
    this._propTypes = ["color",                 "color",                "color",                "vector3d" ];
    this._propValues = [];

    this._propValues[this._propNames[0]] = [0.2, 0.2, 0.2,  1.0];
    this._propValues[this._propNames[1]] = [0.5, 0.5, 0.5,  1.0];
    this._propValues[this._propNames[2]] = [1.0, 1.0, 1.0,  1.0];
    this._propValues[this._propNames[3]] = [0.0, 0.0,  5.0,];

    this.getPosition  = function()  {  return this._propValues["position"].slice();   }


    ///////////////////////////////////////////////////////////////////////
    // Methods
    ///////////////////////////////////////////////////////////////////////
    this.setUniforms = function()
    {
        var name = "u_light" + this._index;
        RDGE.rdgeGlobalParameters[name + "Type"].set( [this.getType()] );

        RDGE.rdgeGlobalParameters[name + "Amb"].set( this.getAmbient() );
        RDGE.rdgeGlobalParameters[name + "Diff"].set( this.getDiffuse() );
        RDGE.rdgeGlobalParameters[name + "Spec"].set( this.getSpecular() );

        RDGE.rdgeGlobalParameters[name + "Pos"].set( this.getPosition() );
    }
};




PointLight.prototype = new DirectionalLight();

if (typeof exports === "object") {
    exports.PointLight = PointLight;
}




