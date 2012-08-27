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

#ifdef GL_ES
precision highp float;
#endif


// diffuse map
uniform sampler2D u_colMap;

// varyings
varying vec4 vNormal; // w = texcoord.x
varying vec4 vECPos;  // w = texcoord.y
varying vec3 vEyePos;
//varying vec4 vShadowCoord;
//varying vec2 vEnvTexCoord;
//varying float vDiffuseIntensity;


// environment map
uniform sampler2D envMap;

// normal map
uniform sampler2D u_normalMap;

// specular map
uniform sampler2D u_glowMap;

// depth map
uniform sampler2D depthMap;

#if defined( PC )

// ADD LIGHT FUNCTIONS HERE

void main()
{
    /*
    vec4 rgba_depth = texture2D(depthMap, vShadowCoord.xy/vShadowCoord.w, -32.0);
    const vec4 bit_shift = vec4(1.0/(256.0*256.0*256.0), 1.0/(256.0*256.0), 1.0/256.0, 1.0);
    float dist = vShadowCoord.w/200.0;
    float d = dot(rgba_depth, bit_shift);
    float shadowCoef = (dist > d + 0.00779) ? (0.6) : (1.0);
    */

    vec4 colMapTexel = vec4(texture2D(u_colMap, vec2(vNormal.w, vECPos.w)).rgb, 1.0);

    vec4 ambient = vec4(0,0,0,0),  diffuse = vec4(0,0,0,0),  specular = vec4(0,0,0,0);
    // ADD LIGHT CALLS HERE

    #if defined (USE_LIGHTS)
        gl_FragColor = color + u_lightAmount*((color*(ambient + diffuse)) + specular);
    #else
        gl_FragColor = color;
    #endif
}

#endif

