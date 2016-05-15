var VSHADER_SOURCE =
  'struct MatlT {\n' +    
  '   vec3 emit;\n' +     
  '   vec3 ambi;\n' +     
  '   vec3 diff;\n' +     
  '   vec3 spec;\n' +     
  '   int shiny;\n' +     
    '};\n' +
  'uniform int v_mode; \n' +
  'uniform int v_lightswitch; \n' +
  'uniform int v_lightonoff; \n' +
  'struct LampT {\n' +    
  '   vec3 pos;\n' +      
  '   vec3 ambi;\n' +     
  '   vec3 diff;\n' +    
  '   vec3 spec;\n' +    
  '}; \n' +
  'uniform LampT u_LampSet[2];\n' +    
  'uniform vec3 u_eyeWorld; \n' +  
  'uniform vec3 u_eyeWorld2; \n' +  
  'uniform mat4 v_ProjMatrix;\n' +
  'uniform mat4 v_ViewMatrix;\n' +
  'uniform mat4 v_NormalMatrix;\n' +
  'uniform MatlT u_MatlSet[1];\n' +  
  'varying vec3 v_Kd; \n' +            
  'varying vec4 v_Position; \n' +
  'varying vec3 v_Normal; \n' +
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Normal;\n' +
  'varying vec4 v_color;\n' +
  'void main() {\n' +
  '  gl_Position = v_ProjMatrix * v_ViewMatrix * a_Position;\n' +
  '  v_Position = v_ViewMatrix * a_Position; \n' +
  '  v_Normal = normalize(vec3(v_NormalMatrix * a_Normal));\n' +
  '  v_Kd = u_MatlSet[0].diff; \n' +
  '  vec3 normal = normalize(v_Normal); \n' +
  '  vec3 lightdirection = normalize(u_LampSet[0].pos - v_Position.xyz);\n' +
  '  vec3 eyeDirection = normalize(u_eyeWorld - v_Position.xyz); \n' +
  '  float DotL = max(dot(lightdirection, normal), 0.0); \n' +
  '  vec3 H = normalize(lightdirection + eyeDirection); \n' +
  '  float nDotH = max(dot(H, normal), 0.0); \n' +
  '  float e64 = pow(nDotH, float(u_MatlSet[0].shiny));\n' +
  '  if(v_mode == 0) { \n' +
  '  vec3 reflectDir = reflect(-lightdirection, normal);\n' +
  '  nDotH = max(dot(reflectDir, eyeDirection), 0.0);\n' +
  '  e64 = pow(nDotH, float(u_MatlSet[0].shiny)/4.0);\n' +
  '  } \n' +
  '  vec3 lightdirection2 = normalize(u_LampSet[1].pos - v_Position.xyz);\n' +
  '  vec3 eyeDirection2 = normalize(u_eyeWorld2 - v_Position.xyz); \n' + 
  '  float DotL2 = max(dot(lightdirection2, normal), 0.0); \n' +
  '  vec3 H2 = normalize(lightdirection2 + eyeDirection2); \n' +
  '  float nDotH2 = max(dot(H2, normal), 0.0); \n' +
  '  float e642 = pow(nDotH2, float(u_MatlSet[0].shiny));\n' +
  '  if(v_mode == 0) { \n' +
  '  vec3 reflectDir2 = reflect(-lightdirection2, normal);' +
  '  nDotH2 = max(dot(reflectDir2, eyeDirection2), 0.0);' +
  '  e642 = pow(nDotH2, float(u_MatlSet[0].shiny)/4.0);' +
  '  }\n' +
  '  vec3 emissive = u_MatlSet[0].emit;' +
  '  vec3 ambient = u_LampSet[0].ambi * u_MatlSet[0].ambi;\n' +
  '  vec3 ambient2 = u_LampSet[1].ambi * u_MatlSet[0].ambi;\n' +
  '  vec3 diffuse = u_LampSet[0].diff * v_Kd * DotL;\n' +
  '  vec3 diffuse2 = u_LampSet[1].diff * v_Kd * DotL2;\n' +
  '  vec3 speculr = u_LampSet[0].spec * u_MatlSet[0].spec * e64;\n' +
  '  vec3 speculr2 = u_LampSet[1].spec * u_MatlSet[0].spec * e642;\n' +
  '  if(v_lightswitch == 1) { \n' +
    'if(v_lightonoff == 1) {\n' +
    'v_color= vec4(emissive + emissive + ambient + diffuse + speculr + ambient2 + diffuse2 + speculr2, 1.0);} \n' +
    'else v_color = vec4(emissive + ambient + diffuse + speculr, 1.0);}\n' +
  '  else { if(v_lightonoff == 1) { v_color = vec4(emissive + ambient2 + diffuse2 + speculr2, 1.0);} \n' +
          'else v_color = vec4(0,0,0, 1.0);} \n' +
  '}\n'
  ;
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision highp float;\n' +
  '#endif\n' +
  'precision highp int;\n' +
  'uniform int v_mode; \n' +
  'uniform int v_lightswitch; \n' +
  'uniform int v_lightonoff; \n' +
  'uniform int v_shaderFlg; \n' +
  'struct LampT {\n' +    
  '   vec3 pos;\n' +      
  '   vec3 ambi;\n' +     
  '   vec3 diff;\n' +    
  '   vec3 spec;\n' +    
  '}; \n' +
  'struct MatlT {\n' +    
  '   vec3 emit;\n' +     
  '   vec3 ambi;\n' +     
  '   vec3 diff;\n' +     
  '   vec3 spec;\n' +     
  '   int shiny;\n' +     
  '   };\n' +
  'uniform LampT u_LampSet[2];\n' +   
  'uniform MatlT u_MatlSet[1];\n' +   
  'uniform vec3 u_eyeWorld; \n' +  
  'uniform vec3 u_eyeWorld2; \n' +  
  'varying vec3 v_Normal;\n' +       
  'varying vec4 v_Position;\n' +      
  'varying vec3 v_Kd; \n' + 
  'varying vec4 v_color;\n' +         
  'void main() { \n' +
  '  vec3 normal = normalize(v_Normal); \n' +
  '  vec3 lightdirection = normalize(u_LampSet[0].pos - v_Position.xyz);\n' +
  '  vec3 eyeDirection = normalize(u_eyeWorld - v_Position.xyz); \n' +
  '  float DotL = max(dot(lightdirection, normal), 0.0); \n' +
  '  vec3 H = normalize(lightdirection + eyeDirection); \n' +
  '  float nDotH = max(dot(H, normal), 0.0); \n' +
  '  float e64 = pow(nDotH, float(u_MatlSet[0].shiny));\n' +
  '  if(v_mode == 0) { \n' +
  '  vec3 reflectDir = reflect(-lightdirection, normal);\n' +
  '  nDotH = max(dot(reflectDir, eyeDirection), 0.0);\n' +
  '  e64 = pow(nDotH, float(u_MatlSet[0].shiny)/4.0);\n' +
  '  } \n' +
  '  vec3 lightdirection2 = normalize(u_LampSet[1].pos - v_Position.xyz);\n' +
  '  vec3 eyeDirection2 = normalize(u_eyeWorld2 - v_Position.xyz); \n' + 
  '  float DotL2 = max(dot(lightdirection2, normal), 0.0); \n' +
  '  vec3 H2 = normalize(lightdirection2 + eyeDirection2); \n' +
  '  float nDotH2 = max(dot(H2, normal), 0.0); \n' +
  '  float e642 = pow(nDotH2, float(u_MatlSet[0].shiny));\n' +
  '  if(v_mode == 0) { \n' +
  '  vec3 reflectDir2 = reflect(-lightdirection2, normal);' +
  '  nDotH2 = max(dot(reflectDir2, eyeDirection2), 0.0);' +
  '  e642 = pow(nDotH2, float(u_MatlSet[0].shiny)/4.0);' +
  '  }\n' +
  '  vec3 emissive = u_MatlSet[0].emit;' +
  '  vec3 ambient = u_LampSet[0].ambi * u_MatlSet[0].ambi;\n' +
  '  vec3 ambient2 = u_LampSet[1].ambi * u_MatlSet[0].ambi;\n' +
  '  vec3 diffuse = u_LampSet[0].diff * v_Kd * DotL;\n' +
  '  vec3 diffuse2 = u_LampSet[1].diff * v_Kd * DotL2;\n' +
  '  vec3 speculr = u_LampSet[0].spec * u_MatlSet[0].spec * e64;\n' +
  '  vec3 speculr2 = u_LampSet[1].spec * u_MatlSet[0].spec * e642;\n' +
  ' if(v_shaderFlg == 1){gl_FragColor = v_color;\n' +
  '}else{if(v_lightswitch == 1) { \n' +
  'if(v_lightonoff == 1) {\n' +
  'gl_FragColor = vec4(emissive + emissive + ambient + diffuse + speculr + ambient2 + diffuse2 + speculr2, 1.0);} \n' +
  'else  gl_FragColor = vec4(emissive + ambient + diffuse + speculr, 1.0);}\n' +
  'else { \n' +
  'if(v_lightonoff == 1) {gl_FragColor = vec4(emissive + ambient2 + diffuse2 + speculr2, 1.0);} \n' +
  'else gl_FragColor = vec4(0,0,0, 1.0);} \n' +
  '}\n' +
'}\n';
  
var floatsPerVertex = 9;  
                        
var LAST_UPDATE = -1;
var LAST_UPDATE2= 0;
var LOOK_STEP = 0.02;
var ANGLE_STEP = 45.0;

var myViewMatrix = new Matrix4();
var projMatrix = new Matrix4();
var normalMatrix = new Matrix4();

var vloc_eyeWorld  = false;
var vloc_eyeWorld2  = false;
var myu_ViewMatrix = false;
var u_ProjMatrix = false;
var u_NormalMatrix = false;
var canvas  = false;
var gl      = false;
var u_mode = false;
var mode = false;
var u_lightswitch = false;
var lightswitch = false;
var shaderFlg=false;
var u_shaderFlg=false;

var u_lightonoff = false;
var lightonoff = false;
var vloc_Ke = false;
var vloc_Ka = false;
var vloc_Kd = false;
var vloc_Ks = false;
var vloc_Kshiny = false;

var eyeWorld = new Float32Array(3);  
var eyeWorld2 = new Float32Array(3); 
var lamp0 = new LightsT();
var lamp1 = new LightsT();

var matlSel= 1;       
var matl0 = new Material(matlSel);  

var lightx = 0;
var lighty = 0;
var lightz = 0;

var r1=1;
var g1=1;
var b1=1;
var r2=1;
var g2=1;
var b2=1;
var r3=30;
var g3=30;
var b3=30;


function main() {
  var canvas = document.getElementById('webgl');
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  var n = initVertexBuffers(gl);

  if (n < 0) {
    console.log('Failed to specify the vertex information');
    return;
  }

  gl.clearColor(0.0, 0.0, 0.0, 1);
  gl.enable(gl.DEPTH_TEST); 
 
  window.addEventListener("keydown", myKeyDown, false);
  window.addEventListener("keyup", myKeyUp, false);
  window.addEventListener("keypress", myKeyPress, false);

  vloc_eyeWorld  = gl.getUniformLocation(gl.program, 'u_eyeWorld');
  vloc_eyeWorld2  = gl.getUniformLocation(gl.program, 'u_eyeWorld2');
  myu_ViewMatrix = gl.getUniformLocation(gl.program, 'v_ViewMatrix');
  u_ProjMatrix = gl.getUniformLocation(gl.program, 'v_ProjMatrix');
  u_NormalMatrix = gl.getUniformLocation(gl.program, 'v_NormalMatrix');
  
  u_mode = gl.getUniformLocation(gl.program, 'v_mode');
  u_lightswitch = gl.getUniformLocation(gl.program, 'v_lightswitch');
  u_lightonoff = gl.getUniformLocation(gl.program, 'v_lightonoff');
  u_shaderFlg=gl.getUniformLocation(gl.program, 'v_shaderFlg');
  
  mode = 1;
  lightswitch = 1;
  lightonoff = 0;
  shaderFlg=0;

  vloc_Ke = gl.getUniformLocation(gl.program, 'u_MatlSet[0].emit');
  vloc_Ka = gl.getUniformLocation(gl.program, 'u_MatlSet[0].ambi');
  vloc_Kd = gl.getUniformLocation(gl.program, 'u_MatlSet[0].diff');
  vloc_Ks = gl.getUniformLocation(gl.program, 'u_MatlSet[0].spec');
  vloc_Kshiny = gl.getUniformLocation(gl.program, 'u_MatlSet[0].shiny');
  
  if(!vloc_Ke || !vloc_Ka || !vloc_Kd || !vloc_Ks || !vloc_Kshiny) {
    console.log('Failed to get GPUs Reflectance storage locations');
    return;
  }

  if (!vloc_eyeWorld || !vloc_eyeWorld2 ||
      !myu_ViewMatrix || !u_ProjMatrix || !u_NormalMatrix) {
    console.log('Failed to get GPUs matrix storage locations');
    return;
    }

  lamp0.u_pos  = gl.getUniformLocation(gl.program, 'u_LampSet[0].pos'); 
  lamp0.u_ambi = gl.getUniformLocation(gl.program, 'u_LampSet[0].ambi');
  lamp0.u_diff = gl.getUniformLocation(gl.program, 'u_LampSet[0].diff');
  lamp0.u_spec = gl.getUniformLocation(gl.program, 'u_LampSet[0].spec');
  if( !lamp0.u_pos || !lamp0.u_ambi || !lamp0.u_diff || !lamp0.u_spec ) {
    console.log('Failed to get GPUs Lamp0 storage locations');
    return;
  }

  lamp1.u_pos  = gl.getUniformLocation(gl.program, 'u_LampSet[1].pos'); 
  lamp1.u_ambi = gl.getUniformLocation(gl.program, 'u_LampSet[1].ambi');
  lamp1.u_diff = gl.getUniformLocation(gl.program, 'u_LampSet[1].diff');
  lamp1.u_spec = gl.getUniformLocation(gl.program, 'u_LampSet[1].spec');
  if( !lamp1.u_pos || !lamp1.u_ambi || !lamp1.u_diff || !lamp1.u_spec ) {
    console.log('Failed to get GPUs Lamp0 storage locations');
    return;
  }

  gl.uniform3fv(vloc_eyeWorld, eyeWorld);
  gl.uniform3fv(vloc_eyeWorld2, eyeWorld2);
 
  eyeWorld2.set([0, 5, 4]);

  
  // lamp0.I_ambi.elements.set([r1, g1, b1]);
  // lamp0.I_diff.elements.set([r2, g2, b2]);
  // lamp0.I_spec.elements.set([r3, g3, b3]);

  if (!myu_ViewMatrix || !u_ProjMatrix) { 
    console.log('Failed to get myu_ViewMatrix or u_ProjMatrix');
    return;
  }
    
  var currentAngle = 0;
  var tick = function() {
    eyeWorld.set([g_EyeX, g_EyeY, g_EyeZ]);

    lamp1.I_pos.elements.set([g_EyeX, g_EyeY, g_EyeZ]);
    lamp0.I_pos.elements.set([lightx, lighty, lightz]);    
    lamp1.I_ambi.elements.set([0.5, 0.5, 0.5]);
    lamp1.I_diff.elements.set([1, 1, 1]);
    lamp1.I_spec.elements.set([10, 10, 10]);


    lamp0.I_ambi.elements.set([r1, g1, b1]);
    lamp0.I_diff.elements.set([r2, g2, b2]);
    lamp0.I_spec.elements.set([r3, g3, b3]);

    currentAngle = animate(currentAngle);
    canvas.width = innerWidth;    
    canvas.height = innerHeight;
    initVertexBuffers(gl);
    draw(gl, currentAngle, canvas);  
    requestAnimationFrame(tick, canvas);   
  };
  tick();             

}

function makeGroundGrid() {
  var xcount = 100;     
  var ycount = 100;   
  var xymax =  100;  
  var xColr = new Float32Array([1, 1, 1]);  // bright yellow
  var yColr = new Float32Array([0.5, 0.5, 0.5]);  // bright green.
  gndVerts = new Float32Array(floatsPerVertex*2*(xcount+ycount));

            
  var xgap = xymax/(xcount-1);    // HALF-spacing between lines in x,y;
  var ygap = xymax/(ycount-1);    // (why half? because v==(0line number/2))
  
  for(v=0, j=0; v<2*xcount; v++, j+= floatsPerVertex) {
    if(v%2==0) {  // put even-numbered vertices at (xnow, -xymax, 0)
      gndVerts[j  ] = -xymax + (v  )*xgap;  // x
      gndVerts[j+1] = -xymax;               // y
      gndVerts[j+2] = 0.0;                  // z
    }
    else {        // put odd-numbered vertices at (xnow, +xymax, 0).
      gndVerts[j  ] = -xymax + (v-1)*xgap;  // x
      gndVerts[j+1] = xymax;                // y
      gndVerts[j+2] = 0.0;                  // z
    }
    gndVerts[j+3] = xColr[0];     // red
    gndVerts[j+4] = xColr[1];     // grn
    gndVerts[j+5] = xColr[2];     // blu

    gndVerts[j+6] = 0;     // red
    gndVerts[j+7] = 0;     // grn
    gndVerts[j+8] = 1;     // blu
  }
  
  for(v=0; v<2*ycount; v++, j+= floatsPerVertex) {
    if(v%2==0) {    // put even-numbered vertices at (-xymax, ynow, 0)
      gndVerts[j  ] = -xymax;               // x
      gndVerts[j+1] = -xymax + (v  )*ygap;  // y
      gndVerts[j+2] = 0.0;                  // z
    }
    else {          // put odd-numbered vertices at (+xymax, ynow, 0).
      gndVerts[j  ] = xymax;                // x
      gndVerts[j+1] = -xymax + (v-1)*ygap;  // y
      gndVerts[j+2] = 0.0;                  // z
    }
    gndVerts[j+3] = yColr[0];     // red
    gndVerts[j+4] = yColr[1];     // grn
    gndVerts[j+5] = yColr[2];     // blu

    gndVerts[j+6] = 0;     // red
    gndVerts[j+7] = 0;     // grn
    gndVerts[j+8] = 1;     // blu
  }
}

function initVertexBuffers(gl) {
//==============================================================================
  var a = Math.sqrt(0.5);
  var a1=a/2;
  forestVerts = new Float32Array([

    // body
       -0.4,  0.0, -1.0,      1.0, 0.2, 0.1,   0.0, 0.0, -1.0,
       -0.4,  0.0,  1.0,      1.0, 1.0, 0.2,   0.0, 0.0, -1.0,
        0.4,  0.0,  1.0,      1.0, 0.7, 0.3,   0.0, 0.0, -1.0,

       -0.4,  0.0, -1.0,      1.0, 0.2, 0.4,   0.0, 0.0, -1.0,
        0.4,  0.0,  1.0,      1.0, 1.0, 0.5,   0.0, 0.0, -1.0,
        0.4,  0.0, -1.0,      1.0, 0.2, 0.7,   0.0, 0.0, -1.0,//bottom

       -0.4,  0.0,  1.0,      1.0, 0.0, 0.6,   0.0, 1.0,  0.0,
        0.4,  0.0,  1.0,      1.0, 0.0, 0.8,   0.0, 1.0,  0.0,
        0.4,  0.5,  1.0,      1.0, 0.0, 0.9,   0.0, 1.0,  0.0,

        0.4,  0.5,  1.0,      1.0, 0.7, 1.0,   0.0, 1.0,  0.0,
       -0.4,  0.0,  1.0,      1.0, 0.0, 0.9,   0.0, 1.0,  0.0,
       -0.4,  0.5,  1.0,      1.0, 0.5, 0.8,   0.0, 1.0,  0.0,//front

        0.4,  0.0,  1.0,      1.0, 0.5, 0.7,   1.0, 0.0,  0.0,
        0.4,  0.0, -1.0,      1.0, 0.5, 0.6,   1.0, 0.0,  0.0,
        0.4,  0.5,  1.0,      1.0, 0.5, 0.5,   1.0, 0.0,  0.0,

        0.4,  0.0, -1.0,      1.0, 0.5, 0.4,   1.0, 0.0,  0.0,
        0.4,  0.5,  1.0,      1.0, 0.5, 0.3,   1.0, 0.0,  0.0,
        0.4,  0.5, -1.0,      1.0, 0.5, 0.2,   1.0, 0.0,  0.0,//right

        0.4,  0.5, -1.0,      1.0, 1.0, 0.1,   0.0,-1.0,  0.0,
        0.4,  0.0, -1.0,      1.0, 1.0, 0.2,   0.0,-1.0,  0.0,
       -0.4,  0.0, -1.0,      1.0, 1.0, 0.3,   0.0,-1.0,  0.0,

       -0.4,  0.0, -1.0,      1.0, 1.0, 0.4,   0.0,-1.0,  0.0,
        0.4,  0.5, -1.0,      1.0, 1.0, 0.5,   0.0,-1.0,  0.0,
       -0.4,  0.5, -1.0,      1.0, 1.0, 0.6,   0.0,-1.0,  0.0,//back

       -0.4,  0.5, -1.0,      1.0, 1.0, 0.7,   0.0, 0.0,  1.0,
        0.4,  0.5, -1.0,      1.0, 1.0, 0.8,   0.0, 0.0,  1.0,
        0.4,  0.5,  1.0,      1.0, 1.0, 1.0,   0.0, 0.0,  1.0,

       -0.4,  0.5, -1.0,      1.0, 1.0, 1.0,   0.0, 0.0,  1.0,
        0.4,  0.5,  1.0,      1.0, 1.0, 0.9,   0.0, 0.0,  1.0,
       -0.4,  0.5,  1.0,      1.0, 1.0, 0.8,   0.0, 0.0,  1.0,//top
 
       -0.4,  0.5, -1.0,      1.0, 0.6, 0.7,  -1.0, 0.0,  0.0,
       -0.4,  0.5,  1.0,      1.0, 0.6, 0.6,  -1.0, 0.0,  0.0,
       -0.4,  0.0, -1.0,      1.0, 0.6, 0.5,  -1.0, 0.0,  0.0,

       -0.4,  0.5,  1.0,      1.0, 0.6, 0.4,  -1.0, 0.0,  0.0,
       -0.4,  0.0, -1.0,      1.0, 0.6, 0.3,  -1.0, 0.0,  0.0,
       -0.4,  0.0,  1.0,      1.0, 0.6, 0.2,  -1.0, 0.0,  0.0,//left
       //fengche(36+36)
        0.0,  0.0,  0.0,      0.4, 0.1, 0.9,   0.0, 0.0, -1.0,
        0.0,  0.0,  1.0,      0.4, 0.1, 0.8,   0.0, 0.0, -1.0,
        2.0,  0.0,  1.0,      0.4, 0.1, 0.7,   0.0, 0.0, -1.0,

        0.0,  0.0,  0.0,      0.4, 0.2, 0.9,   0.0, 0.0, -1.0,
        2.0,  0.0,  1.0,      0.4, 0.2, 0.8,   0.0, 0.0, -1.0,
        2.0,  0.0,  0.0,      0.4, 0.2, 0.7,   0.0, 0.0, -1.0,//bottom

        2.0,  0.0,  1.0,      0.5, 0.1, 0.8,   1.0, 0.0,  0.0,
        2.0,  0.0,  0.0,      0.5, 0.1, 0.7,   1.0, 0.0,  0.0,
        1.0,  1.0,  1.0,      0.5, 0.1, 0.6,   1.0, 0.0,  0.0,

        2.0,  0.0,  0.0,      0.5, 0.2, 0.8,   1.0, 0.0,  0.0,
        1.0,  1.0,  1.0,      0.5, 0.2, 0.7,   1.0, 0.0,  0.0,
        1.0,  1.0,  0.0,      0.5, 0.2, 0.6,   1.0, 0.0,  0.0,//right

        1.0, 1.0, 1.0,        0.9, 1.0, 0.9,   0.0, 0.0, 1.0,
        1.0, 1.0, 0.0,        0.9, 1.0, 0.8,   0.0, 0.0, 1.0,
        0.0, 1.0, 1.0,        0.9, 1.0, 0.7,   0.0, 0.0, 1.0,

        1.0, 1.0, 0.0,     0.9,0.9,0.9,0.0, 0.0, 1.0,
        0.0, 1.0, 1.0,     0.9,0.9,0.8,0.0, 0.0, 1.0,
        0.0, 1.0, 0.0,     0.9,0.9,0.7,0.0, 0.0, 1.0,//top

        0.0, 1.0, 1.0,     0.4,0.1,0.9,-1, 0.0, 0.0,
        0.0, 1.0, 0.0,     0.4,0.1,0.8,-1, 0.0, 0.0,
        0.0, 0.0, 0.0,     0.4,0.1,0.7,-1, 0.0, 0.0,

        0.0, 1.0, 1.0,     0.4,0.2,0.9,-1, 0.0, 0.0,
        0.0, 0.0, 0.0,     0.4,0.2,0.8,-1, 0.0, 0.0,
        0.0, 0.0, 1.0,     0.4,0.2,0.7,-1, 0.0, 0.0,//left

        0.0, 1.0, 1.0,     0.5,0.1,0.1, 0.0, 1.0, 0.0,
        0.0, 0.0, 1.0,     0.5,0.1,0.2, 0.0, 1.0, 0.0,
        2.0, 0.0, 1.0,     0.5,0.1,0.3, 0.0, 1.0, 0.0,

        2.0, 0.0, 1.0,     0.5,0.2,0.1,0.0, 1, 0.0,
        0.0, 1.0, 1.0,     0.5,0.2,0.2,0.0, 1, 0.0,
        1.0, 1.0, 1.0,     0.5,0.2,0.3,0.0, 1, 0.0,//front

        2.0, 0.0, 0.0,    0.9,0.9,0.1,0.0, -1, 0.0,
        1.0, 1.0, 0.0,    0.9,0.9,0.2,0.0, -1, 0.0,
        0.0, 1.0, 0.0,    0.9,0.9,0.3,0.0, -1, 0.0,

        2.0, 0.0, 0.0,    0.9,1,0.1,0.0, -1, 0.0,
        0.0, 1.0, 0.0,    0.9,1,0.2,0.0, -1, 0.0,
        0.0, 0.0, 0.0,    0.9,1,0.3,0.0, -1, 0.0,//back

        //node for cylinder(72+96)
      0.0,  0.0,  0.0,     0.8, 0.1, 0.1, 0.0, 0.0, 0.0,  
      0.5,  0.0,  0.0,     0.8, 0.1 ,0.2, 0.0, 0.0, 0.0, 
       a1,  0.0,  -a1,    0.8, 0.1 ,0.3, 0.0, 0.0, 0.0,//1

      0.0,  0.0,  0.0,    0.7, 0.1 ,0.4, 0.0, 0.0, 0.0,  
       a1,  0.0,  -a1,     0.7, 0.1 ,0.5, 0.0, 0.0, 0.0, 
      0.0,  0.0, -0.5,     0.7, 0.1 ,0.6,0.0, 0.0, 0.0, //2

      0.0,  0.0,  0.0,     0.6, 0.1 ,0.7, 0.0, 0.0, 0.0,
      0.0,  0.0, -0.5,     0.6, 0.1 ,0.8, 0.0, 0.0, 0.0,
      -a1,  0.0,  -a1,     0.6, 0.1 ,0.9, 0.0, 0.0, 0.0, //3 

       0.0,  0.0,  0.0,     0.5, 0.1 ,1.0, 0.0, 0.0, 0.0,
       -a1,  0.0,  -a1,     0.5, 0.1 ,0.9, 0.0, 0.0, 0.0,
      -0.5,  0.0,  0.0,     0.5, 0.1 ,0.8, 0.0, 0.0, 0.0,//4

       0.0,  0.0,  0.0,    0.4, 0.1 ,0.7, 0.0, 0.0, 0.0,
      -0.5,  0.0,  0.0,    0.4, 0.1 ,0.6, 0.0, 0.0, 0.0,
       -a1,  0.0,   a1,    0.4, 0.1, 0.5, 0.0, 0.0, 0.0, //5

       0.0,  0.0,  0.0,    0.4, 0.1 ,0.4, 0.0, 0.0, 0.0,
       -a1,  0.0,   a1,    0.4, 0.1, 0.3, 0.0, 0.0, 0.0,
       0.0,  0.0,  0.5,    0.4, 0.1 ,0.2, 0.0, 0.0, 0.0,//6

       0.0,  0.0,  0.0,    0.3, 0.1 ,0.1, 0.0, 0.0, 0.0,
       0.0,  0.0,  0.5,    0.3, 0.1 ,0.2, 0.0, 0.0, 0.0,
       a1,  0.0,   a1,     0.3, 0.1, 0.3, 0.0, 0.0, 0.0, //7

       0.0,  0.0,  0.0,     0.2, 0.1 ,0.4, 0.0, 0.0, 0.0,
       a1,  0.0,   a1,      0.2, 0.1, 0.5, 0.0, 0.0, 0.0,
       0.5,  0.0,  0.0,     0.2, 0.1 ,0.6, 0.0, 0.0, 0.0, //8 //24 

      0.0,  2.0,  0.0,     0.1, 0.2, 0.7,  0.0, 0.0, 0.0,
      0.5,  2.0,  0.0,     0.1, 0.2 ,0.8,  0.0, 0.0, 0.0, 
       a1,  2.0,  -a1,     0.1, 0.2 ,0.9,0.0, 0.0, 0.0, //1

      0.0,  2.0,  0.0,     0.2, 0.5, 0.8,  0.0, 0.0, 0.0,
       a1,  2.0,  -a1,     0.2, 0.5 ,0.7,  0.0, 0.0, 0.0,
      0.0,  2.0, -0.5,     0.2, 0.5 ,0.6, 0.0, 0.0, 0.0,//2

      0.0,  2.0,  0.0,     0.8, 0.6 ,0.5, 0.0, 0.0, 0.0,
      0.0,  2.0, -0.5,     0.8, 0.6 ,0.5, 0.0, 0.0, 0.0,
      -a1,  2.0,  -a1,     0.8, 0.6, 0.5, 0.0, 0.0, 0.0,  //3

       0.0,  2.0,  0.0,    0.8, 0.9, 0.4, 0.0, 0.0, 0.0,
       -a1,  2.0,  -a1,    0.8, 0.9, 0.3, 0.0, 0.0, 0.0, 
      -0.5,  2.0,  0.0,    0.8, 0.9, 0.2, 0.0, 0.0, 0.0,//4

       0.0,  2.0,  0.0,    0.8, 0.1, 0.2, 0.0, 0.0, 0.0,
      -0.5,  2.0,  0.0,    0.8, 0.1, 0.2, 0.0, 0.0, 0.0,
       -a1,  2.0,   a1,    0.8, 0.1, 0.2, 0.0, 0.0, 0.0,//5

       0.0,  2.0,  0.0,     0.2, 0.3 ,0.0, 0.0, 0.0, 0.0,
       -a1,  2.0,   a1,    0.2, 0.3 ,0.0, 0.0, 0.0, 0.0,
       0.0,  2.0,  0.5,     0.2, 0.3, 0.0, 0.0, 0.0, 0.0,//6

       0.0,  2.0,  0.0,     0.8, 0.4, 0.0, 0.0, 0.0, 0.0,
       0.0,  2.0,  0.5,    0.8, 0.4, 0.0, 0.0, 0.0, 0.0,
       a1,   2.0,   a1,     0.8, 0.4, 0.0, 0.0, 0.0, 0.0,//7

       0.0,  2.0,  0.0,    0.8, 0.5, 0.0, 0.0, 0.0, 0.0,
       a1,   2.0,   a1,    0.8, 0.5, 0.0, 0.0, 0.0, 0.0,
       0.5,  2.0,  0.0,    0.8, 0.5 ,0.0, 0.0, 0.0, 0.0, //8 //48 

       0.5,  0.0,  0.0,     0.8, 0.7 ,0.0, 0.0, 0.0, 0.0,
        a1,  0.0,  -a1,     0.8, 0.7, 0.0, 0.0, 0.0, 0.0,
       0.5,  2.0,  0.0,     0.8, 0.7, 0.0, 0.0, 0.0, 0.0, //middle//1

       0.5,  2.0,  0.0,     0.8, 0.8, 0.0, 0.0, 0.0, 0.0,
        a1,  2.0,  -a1,     0.8, 0.8 ,0.0, 0.0, 0.0, 0.0,
        a1,  0.0,  -a1,    0.8, 0.8 ,0.0,  0.0, 0.0, 0.0,//1

        a1,  0.0,  -a1,    0.8, 0.9 ,0.0,  0.0, 0.0, 0.0,
       0.0,  0.0, -0.5,    0.8, 0.9 ,0.0,  0.0, 0.0, 0.0,
        a1,  2.0,  -a1,    0.8, 0.9 ,0.0, 0.0, 0.0, 0.0,

        a1,  2.0,  -a1,     0.7, 0.1 ,0.0, 0.0, 0.0, 0.0, 
       0.0,  2.0, -0.5,     0.7, 0.1, 0.0, 0.0, 0.0, 0.0,
       0.0,  0.0, -0.5,     0.7, 0.1, 0.0, 0.0, 0.0, 0.0, //2

       0.0,  0.0, -0.5,     0.6, 0.1 ,0.0, 0.0, 0.0, 0.0,
       -a1,  0.0,  -a1,     0.6, 0.1 ,0.0, 0.0, 0.0, 0.0,
       0.0,  2.0, -0.5,     0.6, 0.1, 0.0, 0.0, 0.0, 0.0,

       0.0,  2.0, -0.5,    0.5, 0.1, 0.0, 0.0, 0.0, 0.0,
       -a1,  2.0,  -a1,    0.5, 0.1 ,0.0, 0.0, 0.0, 0.0,
       -a1,  0.0,  -a1,    0.5, 0.1, 0.0, 0.0, 0.0, 0.0,//3

       -a1,  2.0,  -a1,    0.4, 0.1, 0.0,  0.0, 0.0, 0.0,
      -0.5,  2.0,  0.0,    0.4, 0.1 ,0.0, 0.0, 0.0, 0.0,
      -0.5,  0.0,  0.0,     0.4, 0.1, 0.0, 0.0, 0.0, 0.0,

       -a1,  0.0,  -a1,    0.8, 0.1, 0.0,  0.0, 0.0, 0.0,
      -0.5,  0.0,  0.0,     0.8, 0.1 ,0.0, 0.0, 0.0, 0.0,
       -a1,  2.0,  -a1,    0.8, 0.1, 0.0,  0.0, 0.0, 0.0,//4

       -0.5,  0.0,  0.0,   0.8, 0.1 ,0.2, 0.0, 0.0, 0.0,
        -a1,  0.0,   a1,   0.8, 0.1, 0.2, 0.0, 0.0, 0.0,
       -0.5,  2.0,  0.0,   0.8, 0.1, 0.2, 0.0, 0.0, 0.0,

       -0.5,  2.0,  0.0,   0.8, 0.1, 0.3, 0.0, 0.0, 0.0,
        -a1,  2.0,   a1,   0.8, 0.1, 0.3, 0.0, 0.0, 0.0,
        -a1,  0.0,   a1,   0.8, 0.1 ,0.3, 0.0, 0.0, 0.0,//5

       -a1,  0.0,   a1,     0.8, 0.1 ,0.4, 0.0, 0.0, 0.0,
       0.0,  0.0,  0.5,     0.8, 0.1, 0.4, 0.0, 0.0, 0.0,
       0.0,  2.0,  0.5,     0.8, 0.1, 0.4, 0.0, 0.0, 0.0,

       -a1,  0.0,   a1,    0.8, 0.1, 0.5, 0.0, 0.0, 0.0,
       -a1,  2.0,   a1,    0.8, 0.1, 0.5, 0.0, 0.0, 0.0,
       0.0,  2.0,  0.5,   0.8, 0.1, 0.5, 0.0, 0.0, 0.0,//6

       0.0,  2.0,  0.5,    0.8, 0.1 ,0.7, 0.0, 0.0, 0.0,
       a1,   2.0,   a1,    0.8, 0.1, 0.7, 0.0, 0.0, 0.0,
       0.0,  0.0,  0.5,    0.8, 0.1, 0.7, 0.0, 0.0, 0.0,

       0.0,  0.0,  0.5,    0.8, 0.1, 0.9, 0.0, 0.0, 0.0,
        a1,  0.0,   a1,    0.8, 0.1 ,0.9, 0.0, 0.0, 0.0,
       a1,   2.0,   a1,    0.8, 0.1 ,0.9, 0.0, 0.0, 0.0,//7

       a1,  0.0,    a1,     0.5, 0.1 ,0.0, 0.0, 0.0, 0.0,
       0.5,  0.0,  0.0,     0.5, 0.1 ,0.0, 0.0, 0.0, 0.0,
       a1,   2.0,   a1,     0.5, 0.1 ,0.0, 0.0, 0.0, 0.0,

       a1,   2.0,   a1,     0.2, 0.1, 0.0, 0.0, 0.0, 0.0,
       0.5,  2.0,  0.0,     0.2, 0.1 ,0.0, 0.0, 0.0, 0.0,
       0.5,  0.0,  0.0,    0.2, 0.1 ,0.0, 0.0, 0.0, 0.0,//8

       //axes(168-2-x-axe)
       0.0,  0.0,  0.0,     1.0,0.0,0.0,0.0, 0.0, 0.0,
       1.0,  0.0,  0.0,     1.0,0.0,0.0, 0.0, 0.0, 0.0,

       //axes(170-2-y-axe)
       0.0,  0.0,  0.0,     0.0,1.0,0.0, 0.0, 0.0, 0.0,
       0.0,  1.0,  0.0,     0.0,1.0,0.0, 0.0, 0.0, 0.0,

       //axes(172-2-z-axe)
       0.0,  0.0,  0.0,     0.0,0.0,1.0, 0.0, 0.0, 0.0,
       0.0,  0.0,  1.0,     0.0,0.0,1.0, 0.0, 0.0, 0.0,

       //cube for light(174-36)
       0,1,1,   1,0,0,  0,1,0,
       1,1,1,   1,0,0,  0,1,0,
       0,1,0,   1,0,0,  0,1,0, 

       1,1,1,   1,0,0,  0,1,0,
       0,1,0,   1,0,0,  0,1,0,
       1,1,0,   1,0,0,  0,1,0,// FRONT

       1,1,0,   1,0,0,  1,0,0,
       1,1,1,   1,0,0,  1,0,0,
       1,0,0,   1,0,0,  1,0,0,

       1,1,1,   1,0,0,  1,0,0,
       1,0,0,   1,0,0,  1,0,0,
       1,0,1,   1,0,0,  1,0,0,//Right

       1,1,0,   1,0,0,  0,0,-1,
       0,1,0,   1,0,0,  0,0,-1,
       1,0,0,   1,0,0,  0,0,-1,

       0,1,0,   1,0,0,  0,0,-1,
       1,0,0,   1,0,0,  0,0,-1,
       0,0,0,   1,0,0,  0,0,-1,//Dawn

       0,1,0,   1,0,0,  -1,0,0,
       0,1,1,   1,0,0,  -1,0,0,
       0,0,0,   1,0,0,  -1,0,0,

       0,1,1,   1,0,0,  -1,0,0,
       0,0,0,   1,0,0,  -1,0,0,
       0,0,1,   1,0,0,  -1,0,0,//left

       0,1,1,   1,0,0,   0,0,1,
       1,1,1,   1,0,0,   0,0,1,
       1,0,1,   1,0,0,   0,0,1,

       0,1,1,   1,0,0,   0,0,1,
       1,0,1,   1,0,0,   0,0,1,
       0,0,1,   1,0,0,   0,0,1,//top

       0,0,1,  1,0,0,   0,-1,0,
       1,0,1,  1,0,0,   0,-1,0,
       0,0,0,   1,0,0,   0,-1,0,

       0,0,0,   1,0,0,   0,-1,0,
       1,0,1,   1,0,0,   0,-1,0,
       1,0,0,  1,0,0,   0,-1,0,//back

  ]);
  
  makeGroundGrid();

  mySiz = forestVerts.length + gndVerts.length;

  var nn = mySiz / floatsPerVertex;
  console.log('nn is', nn, 'mySiz is', mySiz, 'floatsPerVertex is', floatsPerVertex);
  var verticesColors = new Float32Array(mySiz);

  forestStart = 0;              // we store the forest first.
  for(i=0,j=0; j< forestVerts.length; i++,j++) {
    verticesColors[i] = forestVerts[j];
    } 
  gndStart = i;           // next we'll store the ground-plane;
  for(j=0; j< gndVerts.length; i++, j++) {
    verticesColors[i] = gndVerts[j];
    }

  var vertexColorbuffer = gl.createBuffer();  
  if (!vertexColorbuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorbuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  var FSIZE = verticesColors.BYTES_PER_ELEMENT;

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if(a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 9, 0);
  gl.enableVertexAttribArray(a_Position);

  var a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if(a_Normal < 0) {
    console.log('Failed to get the storage location of a_Normal');
    return -1;
  }
  gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, FSIZE * 9, FSIZE * 6);
  gl.enableVertexAttribArray(a_Normal);

  return mySiz/floatsPerVertex; // return # of vertices
}

function myKeyDown(ev, gl) {
var dx = g_EyeX-g_LookAtX;
var dy = g_EyeY-g_LookAtY;
var dz = g_EyeZ-g_LookAtZ;
var ax = Math.sqrt(dx*dx+dy*dy);

if(ev.keyCode == 39) { // right arrow
      g_EyeX = g_EyeX-0.05*dy/ax;
      g_EyeY = g_EyeY+0.05*dx/ax;
      g_LookAtX -= 0.05*dy/ax;
      g_LookAtY += 0.05*dx/ax;
      console.log('eyeX=',g_EyeX, 'eyeY=', g_EyeY, 'eyeZ=', g_EyeZ);} 
  else if (ev.keyCode == 37) { // left arrow 
      g_EyeX = g_EyeX+0.05*dy/ax;
      g_LookAtX += 0.05*dy/ax;
      g_LookAtY -= 0.05*dx/ax;
      g_EyeY = g_EyeY-0.05*dx/ax;
      console.log('eyeX=',g_EyeX, 'eyeY=', g_EyeY, 'eyeZ=', g_EyeZ);} 
  else if (ev.keyCode == 38) { // up arrow 
      g_LookAtX = g_LookAtX-0.05*(dx/ax);
      g_LookAtY = g_LookAtY-0.05*(dy/ax);
      g_LookAtZ = g_LookAtZ-0.05*(dz/ax);
      g_EyeX = g_EyeX-0.05*(dx/ax);
      g_EyeY = g_EyeY-0.05*(dy/ax);
      g_EyeZ = g_EyeZ-0.05*(dz/ax);
      console.log('eyeX=',g_EyeX, 'eyeY=', g_EyeY, 'eyeZ=', g_EyeZ);} 
    else if (ev.keyCode == 40) { // down arrow
      g_EyeX = g_EyeX+0.05*(dx/ax);
      g_EyeY = g_EyeY+0.05*(dy/ax);
      g_EyeZ = g_EyeZ+0.1*(dz/ax);
      g_LookAtX = g_LookAtX+0.05*(dx/ax);
      g_LookAtY = g_LookAtY+0.05*(dy/ax);
      g_LookAtZ = g_LookAtZ+0.05*(dz/ax); 
      console.log('eyeX=',g_EyeX, 'eyeY=', g_EyeY, 'eyeZ=', g_EyeZ);} 
    else if (ev.keyCode == 65){ // a 
        if(LAST_UPDATE==-1) {LAST_UPDATE2 = -Math.acos(dx/ax)+LOOK_STEP;}
        else {LAST_UPDATE2+= LOOK_STEP;}
        g_LookAtX = g_EyeX+ax*Math.cos(LAST_UPDATE2);
        g_LookAtY = g_EyeY+ax*Math.sin(LAST_UPDATE2);
        LAST_UPDATE = 1;
        console.log('eyeX=',g_EyeX, 'eyeY=', g_EyeY, 'eyeZ=', g_EyeZ);}
    else if(ev.keyCode==68){//d
        if(LAST_UPDATE==-1)
        {LAST_UPDATE2 = -Math.acos(dx/ax)+LOOK_STEP;}
        else{LAST_UPDATE2-= LOOK_STEP;}
        g_LookAtX = g_EyeX+ax*Math.cos(LAST_UPDATE2);
        g_LookAtY = g_EyeY+ax*Math.sin(LAST_UPDATE2);
        LAST_UPDATE = 1;
        console.log('eyeX=',g_EyeX, 'eyeY=', g_EyeY, 'eyeZ=', g_EyeZ);}
    else if(ev.keyCode==87){ //w - look up
        g_LookAtZ = g_LookAtZ+LOOK_STEP;
        console.log('eyeX=',g_EyeX, 'eyeY=', g_EyeY, 'eyeZ=', g_EyeZ);}
    else
      if(ev.keyCode==83){ //s-look down
        g_LookAtZ = g_LookAtZ-LOOK_STEP;
        console.log('eyeX=',g_EyeX, 'eyeY=', g_EyeY, 'eyeZ=', g_EyeZ);}
     else 
       if(ev.keyCode==90)//Z
         {r1 = r1+0.5;}
    else 
      if(ev.keyCode==88)//X
        {g1 = g1+0.5;}
    else 
      if(ev.keyCode==67)//C
        {b1 = b1+0.5;}
    else 
      if(ev.keyCode==86)//V
        {r2 = r2+0.5;}
     else 
      if(ev.keyCode==66)//B
        {g2 = g2+0.5;}
     else 
      if(ev.keyCode==78)//N
        {b2 = b2+0.5;}
     else 
      if(ev.keyCode==74)//J
        {r3 = r3+0.5;}
     else 
      if(ev.keyCode==75)//k
        {g3 = g3+0.5;}
     else 
      if(ev.keyCode==76)//l
        {b3 = b3+0.5;}
    else 
      if(ev.keyCode==32)
        {if(mode == 1) mode = 0; else mode = 1;}
    else 
      if(ev.keyCode==81)
        {if(lightswitch  == 1) lightswitch  = 0; else lightswitch  = 1;}
    else 
      if(ev.keyCode==69)
        {if(lightonoff == 1) lightonoff = 0; else lightonoff= 1;}
    else
      if(ev.keyCode==80)
        {if(shaderFlg==0) shaderFlg=1; else shaderFlg=0;}

    else { return; }

  }

var g_EyeX = 0, g_EyeY = 9, g_EyeZ = 2; 

var g_LookAtX= 0.0, g_LookAtY=0.0,  g_LookAtZ=0.0;
function draw(gl, currentAngle, canvas) {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.uniform3fv(lamp0.u_pos,  lamp0.I_pos.elements.slice(0,3));
  gl.uniform3fv(lamp0.u_ambi, lamp0.I_ambi.elements);   // ambient
  gl.uniform3fv(lamp0.u_diff, lamp0.I_diff.elements);   // diffuse
  gl.uniform3fv(lamp0.u_spec, lamp0.I_spec.elements);   // Specular

  gl.uniform3fv(lamp1.u_pos,  lamp1.I_pos.elements.slice(0,3));
  gl.uniform3fv(lamp1.u_ambi, lamp1.I_ambi.elements);   // ambient
  gl.uniform3fv(lamp1.u_diff, lamp1.I_diff.elements);   // diffuse
  gl.uniform3fv(lamp1.u_spec, lamp1.I_spec.elements);   // Specular


  projMatrix.setPerspective(40, innerWidth/innerHeight, 1, 100);

  gl.viewport(0, 0, canvas.width,canvas.height);
  projMatrix.setPerspective(40, canvas.width/canvas.height, 1, 100);

  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);            
  myViewMatrix.setLookAt(g_EyeX, g_EyeY, g_EyeZ,g_LookAtX, g_LookAtY, g_LookAtZ, 0, 0, 1);                
  gl.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements);

  gl.uniform1i(u_mode, mode);
  gl.uniform1i(u_lightswitch, lightswitch);
  gl.uniform1i(u_lightonoff, lightonoff);
  gl.uniform1i(u_shaderFlg,shaderFlg);

  drawMyScene(gl, currentAngle);
}

function drawMyScene(myGL, currentAngle) { 
  matlSel = 19;
  matl0 = new Material(matlSel);  
  myGL.uniform3fv(vloc_Ke, matl0.K_emit.slice(0,3));        // Ke emissive
  myGL.uniform3fv(vloc_Ka, matl0.K_ambi.slice(0,3));        // Ka ambient
  myGL.uniform3fv(vloc_Kd, matl0.K_diff.slice(0,3));        // Kd diffuse
  myGL.uniform3fv(vloc_Ks, matl0.K_spec.slice(0,3));        // Ks specular
  myGL.uniform1i(vloc_Kshiny, parseInt(matl0.K_shiny, 10));     // Kshiny 
  
  myViewMatrix.translate(0.0, 0.0, -0.8); 
  myViewMatrix.rotate(180,0,0,1); 
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  myViewMatrix.scale(0.4, 0.4,0.4); 
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements);
  myGL.drawArrays(myGL.TRIANGLE_STRIP, gndStart/floatsPerVertex, gndVerts.length/floatsPerVertex);   

  pushMatrix(myViewMatrix);
  pushMatrix(myViewMatrix);
  pushMatrix(myViewMatrix);
  pushMatrix(myViewMatrix);
  pushMatrix(myViewMatrix);
  pushMatrix(myViewMatrix);
  pushMatrix(myViewMatrix);
  pushMatrix(myViewMatrix);
  pushMatrix(myViewMatrix);
  pushMatrix(myViewMatrix);
  pushMatrix(myViewMatrix);
  pushMatrix(myViewMatrix);
  pushMatrix(myViewMatrix);

  matlSel = 6;
  matl0 = new Material(matlSel);  
  myGL.uniform3fv(vloc_Ke, matl0.K_emit.slice(0,3));        // Ke emissive
  myGL.uniform3fv(vloc_Ka, matl0.K_ambi.slice(0,3));        // Ka ambient
  myGL.uniform3fv(vloc_Kd, matl0.K_diff.slice(0,3));        // Kd diffuse
  myGL.uniform3fv(vloc_Ks, matl0.K_spec.slice(0,3));        // Ks specular
  myGL.uniform1i(vloc_Kshiny, parseInt(matl0.K_shiny, 10));     // Kshiny 

  matlSel = 15;
  matl0 = new Material(matlSel);  
  myGL.uniform3fv(vloc_Ke, matl0.K_emit.slice(0,3));        // Ke emissive
  myGL.uniform3fv(vloc_Ka, matl0.K_ambi.slice(0,3));        // Ka ambient
  myGL.uniform3fv(vloc_Kd, matl0.K_diff.slice(0,3));        // Kd diffuse
  myGL.uniform3fv(vloc_Ks, matl0.K_spec.slice(0,3));        // Ks specular
  myGL.uniform1i(vloc_Kshiny, parseInt(matl0.K_shiny, 10));     // Kshiny 
  //lunzi1
  myViewMatrix = popMatrix();
  myViewMatrix.translate(0.5+currentAngle/180,-1.8,0.0);
  myViewMatrix.scale(0.3, 0.05, 0.3);
  myViewMatrix.rotate(90+currentAngle, 0, 1, 0);
  myViewMatrix.rotate(currentAngle, 0, 1, 0);  
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 72, 96);
  //lunzi2
  myViewMatrix = popMatrix();
  myViewMatrix.translate(0.5+currentAngle/180,-1.4,0.0);
  myViewMatrix.scale(0.3, 0.05, 0.3);
  myViewMatrix.rotate(90+currentAngle, 0, 1, 0);
  myViewMatrix.rotate(currentAngle, 0, 1, 0);  
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 72, 96);
  //lunzi3
  myViewMatrix = popMatrix();
  myViewMatrix.translate(-0.5+currentAngle/180,-1.4,0.0);
  myViewMatrix.scale(0.3, 0.05, 0.3);
  myViewMatrix.rotate(90+currentAngle, 0, 1, 0);
  myViewMatrix.rotate(currentAngle, 0, 1, 0);  
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 72, 96);
  //lunzi4
  myViewMatrix = popMatrix();
  myViewMatrix.translate(-0.5+currentAngle/180,-1.8,0.0);
  myViewMatrix.scale(0.3, 0.05, 0.3);
  myViewMatrix.rotate(90, 0, 1, 0);
  myViewMatrix.rotate(currentAngle, 0, 1, 0);  
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 72, 96);

  //cheban
  myViewMatrix = popMatrix();
  myViewMatrix.scale(0.8, 1, 0.1);
  myViewMatrix.translate(0.1+currentAngle/180,-1.8,2.2);
  myViewMatrix.rotate(90, 0, 1, 0);
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 0, 36);

  //chetou
  myViewMatrix = popMatrix();
  myViewMatrix.translate(-0.5+currentAngle/180,-1.9,0.25)
  myViewMatrix.scale(0.4, 0.5, 0.4);
  myViewMatrix.rotate(90, 1, 0, 0);
  myViewMatrix.rotate(180, 0, 1, 0);
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 36, 36);

  matlSel = 13;
  matl0 = new Material(matlSel);  
  myGL.uniform3fv(vloc_Ke, matl0.K_emit.slice(0,3));        // Ke emissive
  myGL.uniform3fv(vloc_Ka, matl0.K_ambi.slice(0,3));        // Ka ambient
  myGL.uniform3fv(vloc_Kd, matl0.K_diff.slice(0,3));        // Kd diffuse
  myGL.uniform3fv(vloc_Ks, matl0.K_spec.slice(0,3));        // Ks specular
  myGL.uniform1i(vloc_Kshiny, parseInt(matl0.K_shiny, 10));     // Kshiny 

  //background like
  myViewMatrix = popMatrix();
  myViewMatrix.translate(-2.0,9,0)
  myViewMatrix.rotate(90, 1, 0, 0);
  myViewMatrix.rotate(40, 0, 1, 0);
  //myViewMatrix.rotate(currentAngle, 0, 1, 0); 
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 36, 36);

  matlSel = 3;
  matl0 = new Material(matlSel);  
  myGL.uniform3fv(vloc_Ke, matl0.K_emit.slice(0,3));        // Ke emissive
  myGL.uniform3fv(vloc_Ka, matl0.K_ambi.slice(0,3));        // Ka ambient
  myGL.uniform3fv(vloc_Kd, matl0.K_diff.slice(0,3));        // Kd diffuse
  myGL.uniform3fv(vloc_Ks, matl0.K_spec.slice(0,3));        // Ks specular
  myGL.uniform1i(vloc_Kshiny, parseInt(matl0.K_shiny, 10));     // Kshiny 
  //background
  myViewMatrix = popMatrix();
  myViewMatrix.translate(-8,2.8,0.0);
  myViewMatrix.scale(0.8, 0.8, 0.8);
  myViewMatrix.rotate(180,0,0,1);
  myViewMatrix.rotate(currentAngle*0.5, 0, 0, 1); 
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 0, 36);
 
 //zuobiandeshoubi
  myViewMatrix.translate(1.0,0.3,0.5);
  myViewMatrix.rotate(90,0,1,0);
  myViewMatrix.rotate(currentAngle*0.5, 0, 0, 1); 
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 0, 36);

  myViewMatrix.translate(1.0,0.3,0.5);
  myViewMatrix.rotate(90,0,1,0);
  myViewMatrix.rotate(currentAngle*0.5, 0, 0, 1); 
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 0, 36);

  myViewMatrix.translate(1.0,0.3,0.5);
  myViewMatrix.rotate(90,0,1,0);
  myViewMatrix.rotate(currentAngle*0.5, 0, 0, 1); 
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 0, 36);

  myViewMatrix.translate(1.0,0.3,0.5);
  myViewMatrix.rotate(90,0,1,0);
  myViewMatrix.rotate(currentAngle*0.5, 0, 0, 1); 
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 0, 36);

  myViewMatrix.translate(1.0,0.3,0.5);
  myViewMatrix.rotate(90,0,1,0);
  myViewMatrix.rotate(currentAngle*0.5, 0, 0, 1); 
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 0, 36);

  myViewMatrix.translate(1.0,0.3,0.5);
  myViewMatrix.rotate(90,0,1,0);
  myViewMatrix.rotate(currentAngle*0.5, 0, 0, 1); 
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 0, 36);

  myViewMatrix.translate(1.0,0.3,0.5);
  myViewMatrix.rotate(90,0,1,0);
  myViewMatrix.rotate(currentAngle*0.5, 0, 0, 1); 
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 0, 36);

  matlSel = 11;
  matl0 = new Material(matlSel);  
  myGL.uniform3fv(vloc_Ke, matl0.K_emit.slice(0,3));        // Ke emissive
  myGL.uniform3fv(vloc_Ka, matl0.K_ambi.slice(0,3));        // Ka ambient
  myGL.uniform3fv(vloc_Kd, matl0.K_diff.slice(0,3));        // Kd diffuse
  myGL.uniform3fv(vloc_Ks, matl0.K_spec.slice(0,3));        // Ks specular
  myGL.uniform1i(vloc_Kshiny, parseInt(matl0.K_shiny, 10));     // Kshiny 
  //jiqiren
  myViewMatrix = popMatrix();
  myViewMatrix.rotate(currentAngle/30, 0, 0, 1); 
  myViewMatrix.translate(currentAngle/90,0,0); 
  myViewMatrix.translate(-4,-3,0.47);
  myViewMatrix.scale(0.5, 0.5, 0.6);
  myViewMatrix.rotate(90, 1, 0, 0);  
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 72, 96);

  myViewMatrix.rotate(currentAngle, 0, 1, 0); 
  myViewMatrix.translate(0,2,0);
  myViewMatrix.scale(1.5, 2, 0.6); 
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 0, 36);
  pushMatrix(myViewMatrix);

  myViewMatrix = popMatrix();
  //TUI
  pushMatrix(myViewMatrix);
  pushMatrix(myViewMatrix);
  pushMatrix(myViewMatrix);
  myViewMatrix.translate(-0.2,-1.5,0);
  myViewMatrix.rotate(180,0,0,1);
  myViewMatrix.translate(0,-0.5,0);
  myViewMatrix.rotate(-currentAngle*2, 0, 0, 1);
  myViewMatrix.scale(0.1, 2.0, 0.1); 
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 0, 36);
  //TUI
  myViewMatrix = popMatrix();
  myViewMatrix.translate(0.2,-1.5,0);
  myViewMatrix.rotate(180,0,0,1);
  myViewMatrix.translate(0,-0.5,0);
  myViewMatrix.rotate(currentAngle*2, 0, 0, 1);
  myViewMatrix.scale(0.1, 2.0, 0.1); 
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 0, 36);
  //SHOUBI
  myViewMatrix = popMatrix();
  myViewMatrix.translate(0.3,-0.7,0);
  myViewMatrix.rotate(180,0,0,1);
  myViewMatrix.translate(0,-0.5,0);
  myViewMatrix.rotate(currentAngle*0.2, 0, 0, 1);
  myViewMatrix.scale(0.1, 1.0, 0.1); 
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 0, 36);
  myViewMatrix.translate(0.2,0.5,0);
  myViewMatrix.rotate(currentAngle*0.01, 1, 1, 0);
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 0, 36);
  myViewMatrix.translate(0.2,0.5,0);
  myViewMatrix.rotate(-currentAngle*0.01, 1, 1, 0);
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 0, 36);
  myViewMatrix.translate(0.2,0.5,0);
  myViewMatrix.rotate(currentAngle*0.01, 1, 1, 0);
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 0, 36);
  //SHOUBI
  myViewMatrix = popMatrix();
  myViewMatrix.translate(-0.3,-0.7,0);
  myViewMatrix.rotate(180,0,0,1);
  myViewMatrix.translate(0,-0.5,0);
  myViewMatrix.rotate(-currentAngle*0.2, 0, 0, 1);
  myViewMatrix.scale(0.1, 1.0, 0.1); 
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 0, 36);
  myViewMatrix.translate(0.2,0.5,0);
  myViewMatrix.rotate(currentAngle*0.01, 1, 1, 0);
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 0, 36);
  myViewMatrix.translate(0.2,0.5,0);
  myViewMatrix.rotate(-currentAngle*0.01, 1, 1, 0);
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 0, 36);
  myViewMatrix.translate(0.2,0.5,0);
  myViewMatrix.rotate(currentAngle*0.01, 0, 0, 1);
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 0, 36);

  matlSel = 19;
  matl0 = new Material(matlSel);  
  myGL.uniform3fv(vloc_Ke, matl0.K_emit.slice(0,3));        // Ke emissive
  myGL.uniform3fv(vloc_Ka, matl0.K_ambi.slice(0,3));        // Ka ambient
  myGL.uniform3fv(vloc_Kd, matl0.K_diff.slice(0,3));        // Kd diffuse
  myGL.uniform3fv(vloc_Ks, matl0.K_spec.slice(0,3));        // Ks specular
  myGL.uniform1i(vloc_Kshiny, parseInt(matl0.K_shiny, 10));     // Kshiny 

  myViewMatrix = popMatrix();
  myViewMatrix.translate(4.5,1.0,2.0);
  myViewMatrix.rotate(90, 1, 1, 0);
  myViewMatrix.rotate(40, 0, 1, 0);
  myViewMatrix.rotate(currentAngle, 0, 1, 0); 
  myViewMatrix.scale(0.4, 0.4, 0.4); 
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 36, 36);

  myViewMatrix.rotate(90, 0, 0, 1);
  myViewMatrix.rotate(currentAngle*0.4, 0, 1, 0); 
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 36, 36);

  myViewMatrix.rotate(90, 0, 0, 1);
  myViewMatrix.rotate(currentAngle*0.4, 0, 1, 0); 
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 36, 36);

  myViewMatrix.rotate(90, 0, 0, 1);
  myViewMatrix.rotate(currentAngle*0.4, 0, 1, 0); 
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 36, 36);

  matlSel = 18;
  matl0 = new Material(matlSel);  
  myGL.uniform3fv(vloc_Ke, matl0.K_emit.slice(0,3));        // Ke emissive
  myGL.uniform3fv(vloc_Ka, matl0.K_ambi.slice(0,3));        // Ka ambient
  myGL.uniform3fv(vloc_Kd, matl0.K_diff.slice(0,3));        // Kd diffuse
  myGL.uniform3fv(vloc_Ks, matl0.K_spec.slice(0,3));        // Ks specular
  myGL.uniform1i(vloc_Kshiny, parseInt(matl0.K_shiny, 10));     // Kshiny 

  myViewMatrix = popMatrix();
  myViewMatrix.translate(6.0,1.0,2.0);
  myViewMatrix.rotate(90, 1, 1, 0);
  myViewMatrix.rotate(40, 0, 1, 0);
  myViewMatrix.rotate(currentAngle, 0, 1, 0); 
  myViewMatrix.scale(0.4, 0.4, 0.4); 
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 36, 36);

  myViewMatrix.rotate(90, 0, 0, 1);
  myViewMatrix.rotate(currentAngle*0.4, 0, 1, 0); 
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 36, 36);

  myViewMatrix.rotate(90, 0, 0, 1);
  myViewMatrix.rotate(currentAngle*0.4, 0, 1, 0); 
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 36, 36);

  myViewMatrix.rotate(90, 0, 0, 1);
  myViewMatrix.rotate(currentAngle*0.4, 0, 1, 0); 
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 36, 36);

  matlSel = 20;
  matl0 = new Material(matlSel);  
  myGL.uniform3fv(vloc_Ke, matl0.K_emit.slice(0,3));        // Ke emissive
  myGL.uniform3fv(vloc_Ka, matl0.K_ambi.slice(0,3));        // Ka ambient
  myGL.uniform3fv(vloc_Kd, matl0.K_diff.slice(0,3));        // Kd diffuse
  myGL.uniform3fv(vloc_Ks, matl0.K_spec.slice(0,3));        // Ks specular
  myGL.uniform1i(vloc_Kshiny, parseInt(matl0.K_shiny, 10));     // Kshiny 

  myViewMatrix = popMatrix();
  myViewMatrix.translate(7.5,1.0,2.0);
  myViewMatrix.rotate(90, 1, 1, 0);
  myViewMatrix.rotate(40, 0, 1, 0);
  myViewMatrix.rotate(currentAngle, 0, 1, 0); 
  myViewMatrix.scale(0.4, 0.4, 0.4); 
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 36, 36);

  myViewMatrix.rotate(90, 0, 0, 1);
  myViewMatrix.rotate(currentAngle*0.4, 0, 1, 0); 
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 36, 36);

  myViewMatrix.rotate(90, 0, 0, 1);
  myViewMatrix.rotate(currentAngle*0.4, 0, 1, 0); 
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 36, 36);

  myViewMatrix.rotate(90, 0, 0, 1);
  myViewMatrix.rotate(currentAngle*0.4, 0, 1, 0); 
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 36, 36);


  matlSel = 2;
  matl0 = new Material(matlSel);  
  myGL.uniform3fv(vloc_Ke, matl0.K_emit.slice(0,3));        // Ke emissive
  myGL.uniform3fv(vloc_Ka, matl0.K_ambi.slice(0,3));        // Ka ambient
  myGL.uniform3fv(vloc_Kd, matl0.K_diff.slice(0,3));        // Kd diffuse
  myGL.uniform3fv(vloc_Ks, matl0.K_spec.slice(0,3));        // Ks specular
  myGL.uniform1i(vloc_Kshiny, parseInt(matl0.K_shiny, 10));     // Kshiny 

  myViewMatrix = popMatrix();
  myViewMatrix.translate(3,-8,0);
  myViewMatrix.scale(0.5, 0.5, 0.5); 
  myViewMatrix.rotate(currentAngle*1, 0, 0, 1);
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 174, 36);

  myViewMatrix.translate(0,-1.0,0);
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myViewMatrix.rotate(currentAngle*0.1, 0, 0, 1);
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 174, 36);

  myViewMatrix.translate(0,-1.0,0);
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myViewMatrix.rotate(currentAngle*0.1, 0, 0, 1);
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 174, 36);

  myViewMatrix.translate(0,-1.0,0);
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myViewMatrix.rotate(currentAngle*0.1, 0, 0, 1);
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 174, 36);

  myViewMatrix.translate(0,-1.0,0);
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myViewMatrix.rotate(currentAngle*0.1, 0, 0, 1);
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 174, 36);

  myViewMatrix.translate(0,-1.0,0);
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myViewMatrix.rotate(currentAngle*0.1, 0, 0, 1);
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 174, 36);

  myViewMatrix.translate(0,-1.0,0);
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myViewMatrix.rotate(currentAngle*0.1, 0, 0, 1);
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 174, 36);

  myViewMatrix.translate(0,-1.0,0);
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myViewMatrix.rotate(currentAngle*0.1, 0, 0, 1);
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 174, 36);

  myViewMatrix.translate(0,-1.0,0);
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myViewMatrix.rotate(currentAngle*0.1, 0, 0, 1);
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 174, 36);

  myViewMatrix.translate(0,-1.0,0);
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myViewMatrix.rotate(currentAngle*0.1, 0, 0, 1);
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 174, 36);

  myViewMatrix.translate(0,-1.0,0);
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myViewMatrix.rotate(currentAngle*0.1, 0, 0, 1);
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 174, 36);
}

var g_last = Date.now();
function animate(angle) {
  var now = Date.now();
  var elapsed = now - g_last;
  g_last = now;
  if(angle >   320 && ANGLE_STEP > 0) ANGLE_STEP = -ANGLE_STEP;
  if(angle <  0.0 && ANGLE_STEP < 0) ANGLE_STEP = -ANGLE_STEP;
  var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
  return newAngle%360;
}

function myKeyUp(ev) {
  console.log('myKeyUp()--keyCode='+ev.keyCode+' released.');
}

function myKeyPress(ev) {
  console.log('myKeyPress():keyCode='+ev.keyCode  +', charCode=' +ev.charCode+
                        ', shift='    +ev.shiftKey + ', ctrl='    +ev.ctrlKey +
                        ', altKey='   +ev.altKey   +
                        ', metaKey(Command key or Windows key)='+ev.metaKey);
}

