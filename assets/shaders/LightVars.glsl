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


// lighting uniforms
uniform vec3 u_light0Pos;
uniform vec4 u_light0Diff;
uniform vec4 u_light0Amb;
uniform vec4 u_light0Spec;
uniform  int u_light0Type;

uniform vec3 u_light1Pos;
uniform vec4 u_light1Diff;
uniform vec4 u_light1Amb;
uniform vec4 u_light1Spec;
uniform  int u_light1Type;

uniform vec3 u_light2Pos;
uniform vec4 u_light2Diff;
uniform vec4 u_light2Amb;
uniform vec4 u_light2Spec;
uniform  int u_light2Type;

uniform vec3 u_light3Pos;
uniform vec4 u_light3Diff;
uniform vec4 u_light3Amb;
uniform vec4 u_light3Spec;
uniform  int u_light3Type;


//material uniforms
uniform vec4   u_matAmbient;
uniform vec4   u_matDiffuse;
uniform vec4   u_matSpecular;
//uniform vec4   u_matEmission;
//uniform float  u_renderGlow;

