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

void CalculateSpotLight( in vec3 lightPos, in vec3 normal,  in vec3 lightDir,  in vec4 lightAmb, in vec4 lightDiff, in vec4 lightSpec,  inout vec4 ambient,  inout vec4 diffuse,  inout vec4 specular )
{
    float   nDotVP,
            nDotHV,
            pf,
            d,
            attenuation,
            spotDot;
    vec3    vp;

    // compute the half vector
    vec3 halfVector = normalize( vec3(0.0, 0.0, 1.0) - lightDir);

    // compute the vector from the surface to the light source
    vp = lightPos - vECPos.xyz;
    d  = length(vp);
    vp = normalize( vp );

    vec3 mapNormal = texture2D(u_normalMap, vec2(vNormal.w, vECPos.w)).xyz * 2.0 - 1.0;
    mapNormal = normalize(mapNormal.x*vec3(normal.z, 0.0, -normal.x) + vec3(0.0, mapNormal.y, 0.0) + mapNormal.z*normal);

    nDotVP = max( 0.0,  -dot(mapNormal, normalize(lightDir)));
    nDotHV = max( 0.0,  dot(mapNormal, halfVector));

    if (nDotVP == 0.0)
        pf = 0.0;
    else
        pf = pow(nDotHV, u_matShininess);

    // compute the attenuation
    attenuation = clamp(1.0 - d * 0.01, 0.0, 1.0);

    // check if the point on the surface is within the cone of the light
    float spotCosCutoff = 0.8,  spotAttenuation;
    float spotExponent = 6.0;
    spotDot = dot( -vp, lightDir );
    if (spotDot < spotCosCutoff)
        spotAttenuation = 0.0;
    else
        spotAttenuation = pow( spotDot, spotExponent );
    attenuation *= spotAttenuation;

    ambient  += lightAmb  * attenuation;
    diffuse  += lightDiff * attenuation * nDotVP;
    specular += lightSpec * attenuation * pf;
}

