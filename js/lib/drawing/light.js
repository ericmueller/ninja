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
    var LIGHT_TYPE_UNDEFINED    = -1;
    var LIGHT_TYPE_DIRECTIONAL  =  0;
    var LIGHT_TYPE_POINT        =  1;
    var LIGHT_TYPE_SPOT         =  2;

    ///////////////////////////////////////////////////////////////////////
    // Instance variables
    ///////////////////////////////////////////////////////////////////////
    this._type = -1;    // undefined

    // all lights have an ambient, diffuse and specular component
    this._ambient  = [0.2, 0.2, 0.2,  1.0];
    this._diffuse  = [0.6, 0.6, 0.6,  1.0];
    this._specular = [1.0, 1.0, 1.0,  1.0];

    ///////////////////////////////////////////////////////////////////////
    // Property Accessors
    ///////////////////////////////////////////////////////////////////////
    this.getType        = function()    {  return this._type;               };
    this.getAmbient     = function()    {  return this._ambient.slice();    };
    this.getDiffuse     = function()    {  return this._diffuse.slice();    };
    this.getSpecular    = function()    {  return this._specular.slice();   };

    this.setType        = function(t)   {  this._type = t;                  };
    this.setAmbient     = function(a)   {  this._ambient  = a.slice();      };
    this.setDiffuse     = function(d)   {  this._diffuse  = d.slice();      };
    this.setSpecular    = function(s)   {  this._specular = s.slice();      };

    ///////////////////////////////////////////////////////////////////////
    // Common Methods
    ///////////////////////////////////////////////////////////////////////
    this.exportJSON = function()
    {
        var jObj =
        {
            'type'      : this.getType(),
            'ambient'   : this.getName(),
            'diffuse'   : this.getDiffuse(),
            'specular'  : this.getSpecular()
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
};

if (typeof exports === "object") {
    exports.Light = Light;
}
