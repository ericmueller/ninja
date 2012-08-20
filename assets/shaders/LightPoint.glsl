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

void CalculatePointLight( in vec3 lightPos,  in vec3 normal, in vec4 lightAmb,  in vec4 lightDiff, in vec4 lightSpec,  inout vec4 rtnAmbient,  inout vec4 rtnDiffuse,  inout vec4 rtnSpecular )
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
    vec3 lightDirection = lightPos - vECPos.xyz;
    float lightDist = length(lightDirection);
    lightDirection /= lightDist;

    float attenuation = clamp(1.0 - lightDist * 0.01, 0.0, 1.0);

    //vec3 halfVec = normalize(lightDirection + vEyePos);
    vec3 halfVec = normalize( vec3(0.0, 0.0, 1.0) + lightDirection);

    float diffuseIntensity = max(0.0, dot(mapNormal, lightDirection));
    float specularModifier = max(0.0, dot(mapNormal, halfVec));

    float pf;
    if(diffuseIntensity == 0.0)
        pf = 0.0;
    else
        pf = pow(specularModifier, 76.0);

    ambient = u_matAmbient * lightAmb;

    //vec4 diffuse = u_matDiffuse * (colMapTexel + envMapTexel)*shadowCoef;
    //vec4 diffuse = u_matDiffuse * (colMapTexel + envMapTexel);
    diffuse = u_matDiffuse;

    //if (u_renderGlow <= 0.5) {
        diffuse *= lightDiff;
    //}

    #if defined( USE_ENV_MAP )
        specular = 2.0 * pf * envMapTexel;
    #else
        specular = 2.0 * vec4(pf) * lightSpec;
    #endif

    rtnAmbient  += ambient;
    rtnDiffuse  += diffuse;
    rtnSpecular += specular;
}
