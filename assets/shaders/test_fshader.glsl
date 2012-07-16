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

//#define USE_POINT_LIGHT 1
//#define USE_DIRECTIONAL_LIGHT 2
#define USE_SPOT_LIGHT 3


// diffuse map
uniform sampler2D u_colMap;


// varyings
varying vec4 vNormal; // w = texcoord.x
varying vec4 vECPos;  // w = texcoord.y
varying vec3 vEyePos;
//varying vec4 vShadowCoord;
//varying vec2 vEnvTexCoord;
//varying float vDiffuseIntensity;

#if defined( USE_POINT_LIGHT ) || defined( USE_DIRECTIONAL_LIGHT ) || defined( USE_SPOT_LIGHT )
//material uniforms
uniform vec4   u_matAmbient;
uniform vec4   u_matDiffuse;
uniform vec4   u_matSpecular;
uniform float  u_matShininess;
uniform vec4   u_matEmission;
uniform float  u_renderGlow;

// lighting uniforms
uniform vec3 u_light0Pos;
uniform vec4 u_light0Diff;
uniform vec4 u_light0Amb;
uniform vec4 u_light0Spec;

// environment map
uniform sampler2D envMap;

// normal map
uniform sampler2D u_normalMap;

// specular map
uniform sampler2D u_glowMap;

// depth map
uniform sampler2D depthMap;
#endif

#if defined( PC )


#if defined( USE_DIRECTIONAL_LIGHT )
void CalculateDirectionalLight( in vec3 normal,  out vec4 ambient,  out vec4 diffuse,  out vec4 specular )
{
    float nDotVP;
    float nDotHV;
    float pf;

    vec3 halfVector = normalize(vec3(0,0,1) + u_light0Pos);

    vec3 mapNormal = texture2D(u_normalMap, vec2(vNormal.w, vECPos.w)).xyz * 2.0 - 1.0;
    mapNormal = normalize(mapNormal.x*vec3(normal.z, 0.0, -normal.x) + vec3(0.0, mapNormal.y, 0.0) + mapNormal.z*normal);

    nDotVP = max( 0.0,  dot(mapNormal, normalize(u_light0Pos)));
    nDotHV = max( 0.0,  dot(mapNormal, halfVector));

    if (nDotVP == 0.0)
        pf = 0.0;
    else
        pf = pow(nDotHV, u_matShininess);

    ambient  = u_matAmbient * u_light0Amb;
    diffuse  = u_light0Diff * nDotVP;
    specular = 2.0 * vec4(pf) * u_light0Spec;
}
#endif


#if defined( USE_POINT_LIGHT )
void CalculatePointLight( vec4 colMapTexel,  vec3 normal,  inout vec4 rtnAmbient,  inout vec4 rtnDiffuse,  inout vec4 rtnSpecular )
{
    vec4 ambient, diffuse, specular;

    // normal mapping
    vec3 mapNormal = texture2D(u_normalMap, vec2(vNormal.w, vECPos.w)).xyz * 2.0 - 1.0;
    mapNormal = normalize(mapNormal.x*vec3(normal.z, 0.0, -normal.x) + vec3(0.0, mapNormal.y, 0.0) + mapNormal.z*normal);

    // create envmap coordinates
    //vec3 r = reflect( normalize(vec3(vECPos.xyz - vEyePos.xyz)), mapNormal);
    //float m = 2.0 * sqrt( r.x*r.x + r.y*r.y + r.z*r.z );

    // calculate environment map texel
    //vec4 envMapTexel = vec4(texture2D(envMap, vec2(r.x/m + 0.5, r.y/m + 0.5)).rgb, 0.0);

    // lighting
    vec3 lightDirection = u_light0Pos - vECPos.xyz;
    float lightDist = length(lightDirection);
    lightDirection /= lightDist;

    float attenuation = clamp(1.0 - lightDist * 0.01, 0.0, 1.0);

    vec3 halfVec = normalize(lightDirection + vEyePos);

    float diffuseIntensity = max(0.0, dot(mapNormal, lightDirection));
    float specularModifier = max(0.0, dot(mapNormal, halfVec));

    float pf;
    if(diffuseIntensity == 0.0)
        pf = 0.0;
    else
        pf = pow(specularModifier, 76.0);

    ambient = u_matAmbient * u_light0Amb;

    //vec4 diffuse = u_matDiffuse * (colMapTexel + envMapTexel)*shadowCoef;
    //vec4 diffuse = u_matDiffuse * (colMapTexel + envMapTexel);
    diffuse = u_matDiffuse;

    if (u_renderGlow <= 0.5) {
        diffuse *= u_light0Diff;
    }

    #if defined( USE_ENV_MAP )
        specular = 2.0 * pf * envMapTexel;
    #else
        specular = 2.0 * vec4(pf) * u_light0Spec;
    #endif

    rtnAmbient  += ambient;
    rtnDiffuse  += diffuse;
    rtnSpecular += specular;
}
#endif

#if defined (USE_SPOT_LIGHT)
void CalculateSpotLight( vec3 normal,  inout vec4 ambient,  inout vec4 diffuse,  inout vec4 specular )
{
    float   nDotVP,
            nDotHV,
            pf,
            d,
            attenuation,
            spotDot;
    vec3    vp;

    // compute the half vector
    vec3 halfVector = normalize(vec3(0,0,1) + u_light0Pos);

    // compute the vector from the surface to the light source
    vp = u_light0Pos - vECPos.xyz;
    d  = length(vp);
    vp = normalize( vp );

    vec3 mapNormal = texture2D(u_normalMap, vec2(vNormal.w, vECPos.w)).xyz * 2.0 - 1.0;
    mapNormal = normalize(mapNormal.x*vec3(normal.z, 0.0, -normal.x) + vec3(0.0, mapNormal.y, 0.0) + mapNormal.z*normal);

    nDotVP = max( 0.0,  dot(mapNormal, normalize(u_light0Pos)));
    nDotHV = max( 0.0,  dot(mapNormal, halfVector));

    if (nDotVP == 0.0)
        pf = 0.0;
    else
        pf = pow(nDotHV, u_matShininess);

    // compute the attenuation
    attenuation = clamp(1.0 - d * 0.01, 0.0, 1.0);

    // check if the point on the surface is within the cone of the light
    vec3 spotDir = normalize( -u_light0Pos );        // obviously, these 4 should be uniforms
    float spotCosCutoff = 0.999,  spotAttenuation;
    float spotExponent = 6.0;
    spotDot = dot( -vp, spotDir );
    if (spotDot < spotCosCutoff)
        spotAttenuation = 0.0;
    else
        spotAttenuation = pow( spotDot, spotExponent );
    attenuation *= spotAttenuation;

    ambient  += u_light0Amb  * attenuation;
    diffuse  += u_light0Diff * attenuation * nDotVP;
    specular += u_light0Spec * attenuation * pf;
}
#endif


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

    vec4    ambient = vec4(0,0,0,0),  diffuse = vec4(0,0,0,0),  specular = vec4(0,0,0,0);
    #if defined (USE_POINT_LIGHT)
       CalculatePointLight( vNormal.xyz,   ambient,  diffuse,  specular  );
    #elif defined (USE_DIRECTIONAL_LIGHT)
        CalculateDirectionalLight( vNormal.xyz,   ambient,  diffuse,  specular  );
    #elif defined (USE_SPOT_LIGHT)
        CalculateSpotLight( vNormal.xyz,  ambient,  diffuse,  specular );
    #else
        ambient  = u_light0Amb;
        diffuse  = u_light0Diff;
        specular = u_light0Spec;
    #endif
    gl_FragColor = ((colMapTexel*(ambient + diffuse)) + specular);

}

#endif

