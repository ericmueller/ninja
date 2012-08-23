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


var Light = require("js/lib/drawing/light").Light;
var vecUtils = require("js/helper-classes/3D/vec-utils").VecUtils;


var DirectionalLight = function DirectionalLight()
{
    ///////////////////////////////////////////////////////////////////////
    // Properties
    ///////////////////////////////////////////////////////////////////////
    this._type = this.LIGHT_TYPE_DIRECTIONAL;

    this._direction = [0, 0, -1];


    ///////////////////////////////////////////////////////////////////////
    // Methods
    ///////////////////////////////////////////////////////////////////////
    this.getDirection    = function()    {  return this._direction.slice();     }
    this.setDirection    = function(d)   {  this._direction = d.slice();     this._rdgeLightNode.dir =  d.slice();      }
    
    this.getDiffuse     = function()    {  return this._diffuse.slice();    };
    this.setDiffuse     = function(d)   {  this._diffuse  = d.slice();      this._rdgeLightNode.setDiffuseColor( this._diffuse );      };
    
    this.getSpecular    = function()    {  return this._specular.slice();   };
    this.setSpecular    = function(s)   {  this._specular = s.slice();      this._rdgeLightNode.setSpecularColor( this._specular );    };



    this.setUniforms = function()
    {
        var name = "u_light" + this._index;
        RDGE.rdgeGlobalParameters[name + "Type"].set( [this.getType()] );

        RDGE.rdgeGlobalParameters[name + "Amb"].set( this.getAmbient() );
        RDGE.rdgeGlobalParameters[name + "Diff"].set( this.getDiffuse() );
        RDGE.rdgeGlobalParameters[name + "Spec"].set( this.getSpecular() );

        RDGE.rdgeGlobalParameters[name + "Dir"].set( this.getDirection() );
    }
};



DirectionalLight.prototype = new Light();

if (typeof exports === "object") {
    exports.DirectionalLight = DirectionalLight;
}




