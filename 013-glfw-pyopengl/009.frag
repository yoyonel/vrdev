#version 330

in vec3 ourColor;
in vec2 TexCoord;

out vec4 color;

uniform sampler2D ourTexture;

vec4 original()
{
  vec2 uv = TexCoord;
  return texture(ourTexture, uv);
}

vec4 circle()
{
  vec2 uv = TexCoord;
  uv.x = sqrt( (0.5 * 0.5) - ((uv.x-0.5)*(uv.x-0.5)) );
  return texture(ourTexture, uv);
}

vec4 distortion(float tech_DistortionFactor)
{
  vec2 uv = TexCoord;

  uv.x += tech_DistortionFactor * (-2.0 * uv.x + 1.0) * uv.x * (uv.x);
  // Use this to curve as a cylinder
  uv.y += tech_DistortionFactor * (-2.0 * uv.y + 1.0) * uv.x * (uv.x - 1.0);

  return texture(ourTexture, uv);
}

vec4 ring(float thickness)
{
  vec2 uv = TexCoord;

  float dist = distance(uv, vec2(0,0));
  float radius = 0.5;
  if ( abs (dist - radius) < thickness) {
    color = vec4(1.0, 0.0, 0.0, 1.0); 
  } else {
    color = vec4(0.0, 0.0, 1.0, 1.0); 
  }
  return color;
}

vec4 simple_curve(float tech_DistortionFactor)
{
   // http://www.sudoplaygames.com/blog/2014/10/02/how-to-a-simple-curved-gui.html
  // float tech_DistortionFactor = 0.2;
  vec2 uv = TexCoord;
  uv.y += tech_DistortionFactor * (-2.0 * uv.y + 1.0) * uv.x * (uv.x - 1.0);
  color = texture(ourTexture, uv);
  return color;
}

vec4 circle_disk_fake_sphere()
{
  // http://www.geeks3d.com/20130705/shader-library-circle-disc-fake-sphere-in-glsl-opengl-glslhacker/4/
  vec2 p = -1.0 + 2.0 * TexCoord;
  // float r = 0.8*sqrt(dot(p,p));
  float r = 0.64*dot(p, p);
  if(r<1.0) {
    vec2 uv;

    // sqrt(1-(x-1)^2)

    float f = (1.0-sqrt(1.0-r))/(r);
    uv.x = p.x*f + 0.5;
    uv.y = p.y*f + 0.5;
    color = texture(ourTexture, uv);
  } else {
    // Transparent
    color = vec4(1.0, 0.0, 0.0, 1.0);
  } 
  return color;
}

void main()
{
  // color = original();
  // color = circle();
  // float tech_DistortionFactor = 0.6;
  // color = distortion(tech_DistortionFactor);
  // color = ring(0.05);
  // float tech_DistortionFactor = 0.2;
  // color = simple_curve(tech_DistortionFactor);
  color = circle_disk_fake_sphere();
}
