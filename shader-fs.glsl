precision mediump float;

varying vec2 textureCoord;
uniform sampler2D uTexture;

varying vec3 vNormal;

uniform vec3 uLightPosition;
uniform vec3 uCameraPosition;

uniform vec4 uLightAmbient;
uniform vec4 uLightDiffuse;
uniform vec4 uLightSpecular;

uniform vec4 uMaterialAmbient;
uniform vec4 uMaterialDiffuse;
uniform vec4 uMaterialSpecular;

void main(void) {
	vec3 L = normalize(uLightPosition);
	vec3 N = normalize(vNormal);

	//Lambert's cosine law
	float lambertTerm = dot(N,-L);

	vec4 LA = uLightAmbient * uMaterialAmbient;
	vec4 LD = vec4(0.0,0.0,0.0,1.0);
	vec4 LS = vec4(0.0,0.0,0.0,1.0);

	if(lambertTerm > 0.0) //only if lambertTerm is positive
	{
		LD = uLightDiffuse * uMaterialDiffuse * lambertTerm; //add diffuse term

		vec3 E = normalize(uCameraPosition);
		vec3 R = reflect(L, N);
		float specular = pow( max(dot(R, E), 0.0), 230.0);//uShininess

		LS = uLightSpecular * uMaterialSpecular * specular; //add specular term
	}

	//Final color
	vec4 finalColor = LA + LD + LS;
	finalColor.a = 1.0;
	

	vec4 textureColor = texture2D(uTexture, textureCoord);
	gl_FragColor = textureColor;
	// gl_FragColor = vec4(textureColor.rgb * finalColor.rgb, textureColor.a);
}