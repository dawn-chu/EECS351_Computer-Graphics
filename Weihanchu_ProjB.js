var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'attribute vec4 a_Color;\n' +
  'attribute vec4 a_Normal;\n' +
  'uniform vec3 u_LightColor;\n' +
  'uniform vec3 u_LightDirection;\n' +
  'uniform mat4 u_NormalMatrix;\n' +
  'uniform vec3 u_AmbientLight;\n' + 
  'uniform mat4 u_ProjMatrix;\n' + 
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  vec3 normal = normalize(vec3(u_NormalMatrix*a_Normal));\n' +
  '  gl_Position = u_ProjMatrix * u_ViewMatrix * a_Position;\n' +
  '  float nDotL = max(dot(u_LightDirection, normal), 0.0);\n' +
  '  vec3 diffuse = u_LightColor * vec3(a_Color) * nDotL;\n' + 
  '  vec3 ambient = u_AmbientLight * a_Color.rgb;\n' +
  '  v_Color = vec4(diffuse + ambient, a_Color.a);\n' +
  '}\n';
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n'; 
var floatsPerVertex = 10;	
var MOVE_STEP = 0.15;
var LOOK_STEP = 0.02;
var PHI_NOW = 0;
var THETA_NOW = 0;
var LAST_UPDATE = -1;
var LAST_UPDATE2= 0;
var currentAngle=0.0;
var ANGLE_STEP = 45.0;
var canvas;
var viewMatrix = new Matrix4();
var projMatrix = new Matrix4();
var isDrag=false;   
var xMclik=0.0;     
var yMclik=0.0;   
var xMdragTot=0.0;  
var yMdragTot=0.0; 
var qNew = new Quaternion(0,0,0,1); 
var qTot = new Quaternion(0,0,0,1); 
var quatMatrix = new Matrix4();       

function main() {
//==============================================================================
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight-100;
  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }
	gl.enable(gl.DEPTH_TEST); 
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to specify the vertex information');
    return;
  }
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  var u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
  var u_LightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection');
  var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  var u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
  var u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
  var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');

  gl.uniform3f(u_LightColor, 1, 1, 1);
  gl.uniform3f(u_AmbientLight, 0.5, 0.6, 0.6);
  var lightDirection = new Vector3([0.5, 0.2, 0.0]);
  lightDirection.normalize(); 
  gl.uniform3fv(u_LightDirection,lightDirection.elements);
  if (!u_ViewMatrix || !u_ProjMatrix) { 
    console.log('Failed to get u_ViewMatrix or u_ProjMatrix');
    return;
  }
  canvas.onmousedown  = function(ev){myMouseDown( ev, gl, canvas) }; 
  canvas.onmousemove =  function(ev){myMouseMove( ev, gl, canvas) };       
  canvas.onmouseup =    function(ev){myMouseUp(   ev, gl, canvas)};
  var viewMatrix = new Matrix4();
  document.onkeydown= function(ev){
  keydown(ev, gl, u_ViewMatrix,u_ProjMatrix,u_NormalMatrix,viewMatrix, normalMatrix); };
  var projMatrix = new Matrix4();
  var modelMatrix = new Matrix4();
  var normalMatrix = new Matrix4();
  projMatrix.setPerspective(40, canvas.width/canvas.height, 1, 100);
  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
  var currentAngle = 0;
  var tick = function() {
    currentAngle = animate(currentAngle);
    canvas.width = innerWidth*0.75;    
    canvas.height = innerHeight*0.75;
    initVertexBuffers(gl);
    draw(gl, currentAngle, u_ViewMatrix,u_ProjMatrix, viewMatrix, u_NormalMatrix, normalMatrix);   // Draw the triangles
    requestAnimationFrame(tick, canvas);   
  };
  tick();     
}

function makeGroundGrid() {
	var xcount = 100;			// # of lines to draw in x,y to make the grid.
	var ycount = 100;		
	var xymax	= 50.0;			// grid size; extends to cover +/-xymax in x and y.
 	var xColr = new Float32Array([1.0, 1.0, 0.3]);	// bright yellow
 	var yColr = new Float32Array([0.5, 1.0, 0.5]);	// bright green.
	gndVerts = new Float32Array(floatsPerVertex*2*(xcount+ycount));						
	var xgap = xymax/(xcount-1);		// HALF-spacing between lines in x,y;
	var ygap = xymax/(ycount-1);		// (why half? because v==(0line number/2))	
	// First, step thru x values as we make vertical lines of constant-x:
	for(v=0, j=0; v<2*xcount; v++, j+= floatsPerVertex) {
		if(v%2==0) {	// put even-numbered vertices at (xnow, -xymax, 0)
			gndVerts[j  ] = -xymax + (v  )*xgap;	// x
			gndVerts[j+1] = -xymax;								// y
			gndVerts[j+2] = 0.0;									// z
		}
		else {				// put odd-numbered vertices at (xnow, +xymax, 0).
			gndVerts[j  ] = -xymax + (v-1)*xgap;	// x
			gndVerts[j+1] = xymax;								// y
			gndVerts[j+2] = 0.0;									// z
		}
		gndVerts[j+3] = xColr[0];			// red
		gndVerts[j+4] = xColr[1];			// grn
		gndVerts[j+5] = xColr[2];			// blu
	}
	for(v=0; v<2*ycount; v++, j+= floatsPerVertex) {
		if(v%2==0) {		// put even-numbered vertices at (-xymax, ynow, 0)
			gndVerts[j  ] = -xymax;								// x
			gndVerts[j+1] = -xymax + (v  )*ygap;	// y
			gndVerts[j+2] = 0.0;									// z
		}
		else {					// put odd-numbered vertices at (+xymax, ynow, 0).
			gndVerts[j  ] = xymax;								// x
			gndVerts[j+1] = -xymax + (v-1)*ygap;	// y
			gndVerts[j+2] = 0.0;									// z
		}
		gndVerts[j+3] = yColr[0];			// red
		gndVerts[j+4] = yColr[1];			// grn
		gndVerts[j+5] = yColr[2];			// blu
	}
}

function initVertexBuffers(gl) {
  var colorchange = currentAngle/20;
  var a = Math.sqrt(0.5);
  var a1=a/2;
  forestVerts = new Float32Array([
    //(cube 36)
       -0.4,  0.0, -1.0,  1,    1.0, 0.2, 0.1,   0.0, 0.0, 0.0,
       -0.4,  0.0,  1.0,  1,    1.0, 1.0, 0.2,   0.0, 0.0, 0.0,
        0.4,  0.0,  1.0,  1,    1.0, 0.7, 0.3,   0.0, 0.0, 0.0,

       -0.4,  0.0, -1.0,  1,    1.0, 0.2, 0.4,   0.0, 0.0, 0.0,
        0.4,  0.0,  1.0,  1,    1.0, 1.0, 0.5,   0.0, 0.0, 0.0,
        0.4,  0.0, -1.0,  1,    1.0, 0.2, 0.7,   0.0, 0.0, 0.0,//bottom

       -0.4,  0.0,  1.0,  1,    1.0, 0.0, 0.6,  0.0, 0.0, 0.0,
        0.4,  0.0,  1.0,  1,    1.0, 0.0, 0.8,  0.0, 0.0, 0.0,
        0.4,  0.5,  1.0,  1,    1.0, 0.0, 0.9,  0.0, 0.0, 0.0,

        0.4,  0.5,  1.0,  1,    1.0, 0.7, 1.0,  0.0, 0.0, 0.0,
       -0.4,  0.0,  1.0,  1,    1.0, 0.0, 0.9,  0.0, 0.0, 0.0,
       -0.4,  0.5,  1.0,  1,    1.0, 0.5, 0.8,  0.0, 0.0, 0.0,//front

        0.4,  0.0,  1.0,  1,    1.0, 0.5, 0.7,  0.0, 0.0, 0.0,
        0.4,  0.0, -1.0,  1,    1.0, 0.5, 0.6,  0.0, 0.0, 0.0,
        0.4,  0.5,  1.0,  1,    1.0, 0.5, 0.5,  0.0, 0.0, 0.0,

        0.4,  0.0, -1.0,  1,    1.0, 0.5, 0.4,  0.0, 0.0, 0.0,
        0.4,  0.5,  1.0,  1,    1.0, 0.5, 0.3,  0.0, 0.0, 0.0,
        0.4,  0.5, -1.0,  1,    1.0, 0.5, 0.2,  0.0, 0.0, 0.0,//right

       0.4,  0.5,  -1.0,  1,    1.0, 1.0, 0.1,0.0, 0.0, 0.0,
       0.4,  0.0,  -1.0,  1,    1.0, 1.0, 0.2,0.0, 0.0, 0.0,
      -0.4,  0.0,  -1.0,  1,    1.0, 1.0, 0.3,0.0, 0.0, 0.0,

      -0.4,  0.0,  -1.0,  1,    1.0, 1.0, 0.4,0.0, 0.0, 0.0,
       0.4,  0.5,  -1.0,  1,    1.0, 1.0, 0.5,0.0, 0.0, 0.0,
      -0.4,  0.5,  -1.0,  1,    1.0, 1.0, 0.6,0.0, 0.0, 0.0,//back

      -0.4,  0.5,  -1.0,  1,    1.0, 1.0, 0.7,0.0, 0.0, 0.0,
       0.4,  0.5,  -1.0,  1,    1.0, 1.0, 0.8,0.0, 0.0, 0.0,
       0.4,  0.5,   1.0,  1,    1.0, 1.0, 1.0,0.0, 0.0, 0.0,

      -0.4,  0.5,  -1.0,  1,    1.0, 1.0, 1.0,0.0, 0.0, 0.0,
       0.4,  0.5,  1.0,   1,    1.0, 1.0, 0.9,0.0, 0.0, 0.0,
      -0.4,  0.5,  1.0,   1,    1.0, 1.0, 0.8,0.0, 0.0, 0.0,//top

      -0.4,  0.5,  -1.0,  1,    1.0, 0.6, 0.7,0.0, 0.0, 0.0,
      -0.4,  0.5,   1.0,  1,    1.0, 0.6, 0.6,0.0, 0.0, 0.0,
      -0.4,  0.0,  -1.0,  1,    1.0, 0.6, 0.5,0.0, 0.0, 0.0,

      -0.4,  0.5,  1.0,   1,    1.0, 0.6, 0.4,0.0, 0.0, 0.0,
      -0.4,  0.0, -1.0,   1,    1.0, 0.6, 0.3,0.0, 0.0, 0.0,
      -0.4,  0.0,  1.0,   1,    1.0, 0.6, 0.2,0.0, 0.0, 0.0,//left
       //fengche(36+36)
        0.0, 0.0, 0.0,   1,  0.4,0.1,0.9,0.0, 0.0, 0.0,
        0.0, 0.0, 1.0,   1,  0.4,0.1,0.8,0.0, 0.0, 0.0,
        2.0, 0.0, 1.0,   1,  0.4,0.1,0.7,0.0, 0.0, 0.0,

        0.0, 0.0, 0.0,  1,   0.4,0.2,0.9,0.0, 0.0, 0.0,
        2.0, 0.0, 1.0,  1,   0.4,0.2,0.8,0.0, 0.0, 0.0,
        2.0, 0.0, 0.0,  1,   0.4,0.2,0.7,0.0, 0.0, 0.0,//bottom

        2.0, 0.0, 1.0,  1,   0.5,0.1,0.8,0.0, 0.0, 0.0,
        2.0, 0.0, 0.0,  1,   0.5,0.1,0.7,0.0, 0.0, 0.0,
        1.0, 1.0, 1.0,  1,   0.5,0.1,0.6,0.0, 0.0, 0.0,

        2.0, 0.0, 0.0,  1,   0.5,0.2,0.8,0.0, 0.0, 0.0,
        1.0, 1.0, 1.0,  1,   0.5,0.2,0.7,0.0, 0.0, 0.0,
        1.0, 1.0, 0.0,  1,   0.5,0.2,0.6,0.0, 0.0, 0.0,//right

        1.0, 1.0, 1.0,  1,  0.9,1,0.9,0.0, 0.0, 0.0,
        1.0, 1.0, 0.0,  1,  0.9,1,0.8,0.0, 0.0, 0.0,
        0.0, 1.0, 1.0,  1,  0.9,1,0.7,0.0, 0.0, 0.0,

        1.0, 1.0, 0.0,  1,   0.9,0.9,0.9,0.0, 0.0, 0.0,
        0.0, 1.0, 1.0,  1,  0.9,0.9,0.8,0.0, 0.0, 0.0,
        0.0, 1.0, 0.0,  1,   0.9,0.9,0.7,0.0, 0.0, 0.0,//top

        0.0, 1.0, 1.0,  1,   0.4,0.1,0.9,0.0, 0.0, 0.0,
        0.0, 1.0, 0.0,  1,   0.4,0.1,0.8,0.0, 0.0, 0.0,
        0.0, 0.0, 0.0,  1,   0.4,0.1,0.7,0.0, 0.0, 0.0,

        0.0, 1.0, 1.0,  1,   0.4,0.2,0.9,0.0, 0.0, 0.0,
        0.0, 0.0, 0.0,  1,   0.4,0.2,0.8,0.0, 0.0, 0.0,
        0.0, 0.0, 1.0,  1,   0.4,0.2,0.7,0.0, 0.0, 0.0,//left

        0.0, 1.0, 1.0,  1,   0.5,0.1,0.1,0.0, 0.0, 0.0,
        0.0, 0.0, 1.0,  1,   0.5,0.1,0.2,0.0, 0.0, 0.0,
        2.0, 0.0, 1.0,  1,   0.5,0.1,0.3,0.0, 0.0, 0.0,

        2.0, 0.0, 1.0,  1,   0.5,0.2,0.1,0.0, 0.0, 0.0,
        0.0, 1.0, 1.0,  1,   0.5,0.2,0.2,0.0, 0.0, 0.0,
        1.0, 1.0, 1.0,  1,   0.5,0.2,0.3,0.0, 0.0, 0.0,//front

        2.0, 0.0, 0.0,  1,  0.9,0.9,0.1,0.0, 0.0, 0.0,
        1.0, 1.0, 0.0,  1,  0.9,0.9,0.2,0.0, 0.0, 0.0,
        0.0, 1.0, 0.0,  1,  0.9,0.9,0.3,0.0, 0.0, 0.0,

        2.0, 0.0, 0.0,  1,  0.9,1,0.1,0.0, 0.0, 0.0,
        0.0, 1.0, 0.0,  1,  0.9,1,0.2,0.0, 0.0, 0.0,
        0.0, 0.0, 0.0,  1,  0.9,1,0.3,0.0, 0.0, 0.0,//back

        //node for cylinder(72+96)
      0.0,  0.0,  0.0,  1,   0.8, 0.1, 0.1, 0.0, 0.0, 0.0,  
      0.5,  0.0,  0.0,  1,   0.8, 0.1 ,0.2, 0.0, 0.0, 0.0, 
       a1,  0.0,  -a1,  1,  0.8, 0.1 ,0.3, 0.0, 0.0, 0.0,//1

      0.0,  0.0,  0.0,  1,  0.7, 0.1 ,0.4, 0.0, 0.0, 0.0,  
       a1,  0.0,  -a1,  1,   0.7, 0.1 ,0.5, 0.0, 0.0, 0.0, 
      0.0,  0.0, -0.5,  1,   0.7, 0.1 ,0.6,0.0, 0.0, 0.0, //2

      0.0,  0.0,  0.0,  1,   0.6, 0.1 ,0.7, 0.0, 0.0, 0.0,
      0.0,  0.0, -0.5,  1,   0.6, 0.1 ,0.8, 0.0, 0.0, 0.0,
      -a1,  0.0,  -a1,  1,   0.6, 0.1 ,0.9, 0.0, 0.0, 0.0, //3 

       0.0,  0.0,  0.0,  1,   0.5, 0.1 ,1.0, 0.0, 0.0, 0.0,
       -a1,  0.0,  -a1,  1,   0.5, 0.1 ,0.9, 0.0, 0.0, 0.0,
      -0.5,  0.0,  0.0,  1,   0.5, 0.1 ,0.8, 0.0, 0.0, 0.0,//4

       0.0,  0.0,  0.0,  1,  0.4, 0.1 ,0.7, 0.0, 0.0, 0.0,
      -0.5,  0.0,  0.0,  1,  0.4, 0.1 ,0.6, 0.0, 0.0, 0.0,
       -a1,  0.0,   a1,  1,  0.4, 0.1, 0.5, 0.0, 0.0, 0.0, //5

       0.0,  0.0,  0.0,  1,  0.4, 0.1 ,0.4, 0.0, 0.0, 0.0,
       -a1,  0.0,   a1,  1,  0.4, 0.1, 0.3, 0.0, 0.0, 0.0,
       0.0,  0.0,  0.5,  1,  0.4, 0.1 ,0.2, 0.0, 0.0, 0.0,//6

       0.0,  0.0,  0.0,  1,  0.3, 0.1 ,0.1, 0.0, 0.0, 0.0,
       0.0,  0.0,  0.5,  1,  0.3, 0.1 ,0.2, 0.0, 0.0, 0.0,
       a1,  0.0,   a1,   1,  0.3, 0.1, 0.3, 0.0, 0.0, 0.0, //7

       0.0,  0.0,  0.0,  1,   0.2, 0.1 ,0.4, 0.0, 0.0, 0.0,
       a1,  0.0,   a1,   1,   0.2, 0.1, 0.5, 0.0, 0.0, 0.0,
       0.5,  0.0,  0.0,  1,   0.2, 0.1 ,0.6, 0.0, 0.0, 0.0, //8 //24 

      0.0,  2.0,  0.0,   1,  0.1, 0.2, 0.7,  0.0, 0.0, 0.0,
      0.5,  2.0,  0.0,   1,  0.1, 0.2 ,0.8,  0.0, 0.0, 0.0, 
       a1,  2.0,  -a1,   1,  0.1, 0.2 ,0.9,0.0, 0.0, 0.0, //1

      0.0,  2.0,  0.0,   1,  0.2, 0.5, 0.8,  0.0, 0.0, 0.0,
       a1,  2.0,  -a1,   1,  0.2, 0.5 ,0.7,  0.0, 0.0, 0.0,
      0.0,  2.0, -0.5,   1,  0.2, 0.5 ,0.6, 0.0, 0.0, 0.0,//2

      0.0,  2.0,  0.0,   1,  0.8, 0.6 ,0.5, 0.0, 0.0, 0.0,
      0.0,  2.0, -0.5,   1,  0.8, 0.6 ,0.5, 0.0, 0.0, 0.0,
      -a1,  2.0,  -a1,   1,  0.8, 0.6, 0.5, 0.0, 0.0, 0.0,  //3

       0.0,  2.0,  0.0,  1,  0.8, 0.9, 0.4, 0.0, 0.0, 0.0,
       -a1,  2.0,  -a1,  1,  0.8, 0.9, 0.3, 0.0, 0.0, 0.0, 
      -0.5,  2.0,  0.0,  1,  0.8, 0.9, 0.2, 0.0, 0.0, 0.0,//4

       0.0,  2.0,  0.0,  1,  0.8, 0.1, 0.2, 0.0, 0.0, 0.0,
      -0.5,  2.0,  0.0,  1,  0.8, 0.1, 0.2, 0.0, 0.0, 0.0,
       -a1,  2.0,   a1,  1,  0.8, 0.1, 0.2, 0.0, 0.0, 0.0,//5

       0.0,  2.0,  0.0,  1,   0.2, 0.3 ,0.0, 0.0, 0.0, 0.0,
       -a1,  2.0,   a1,  1,   0.2, 0.3 ,0.0, 0.0, 0.0, 0.0,
       0.0,  2.0,  0.5,  1,   0.2, 0.3, 0.0, 0.0, 0.0, 0.0,//6

       0.0,  2.0,  0.0,  1,   0.8, 0.4, 0.0, 0.0, 0.0, 0.0,
       0.0,  2.0,  0.5,  1,   0.8, 0.4, 0.0, 0.0, 0.0, 0.0,
       a1,   2.0,   a1,  1,   0.8, 0.4, 0.0, 0.0, 0.0, 0.0,//7

       0.0,  2.0,  0.0,  1,   0.8, 0.5, 0.0, 0.0, 0.0, 0.0,
       a1,   2.0,   a1,  1,   0.8, 0.5, 0.0, 0.0, 0.0, 0.0,
       0.5,  2.0,  0.0,   1,  0.8, 0.5 ,0.0, 0.0, 0.0, 0.0, //8 //48 

       0.5,  0.0,  0.0,  1,   0.8, 0.7 ,0.0, 0.0, 0.0, 0.0,
        a1,  0.0,  -a1,  1,   0.8, 0.7, 0.0, 0.0, 0.0, 0.0,
       0.5,  2.0,  0.0,  1,   0.8, 0.7, 0.0, 0.0, 0.0, 0.0, //middle//1

       0.5,  2.0,  0.0,  1,   0.8, 0.8, 0.0, 0.0, 0.0, 0.0,
        a1,  2.0,  -a1,  1,   0.8, 0.8 ,0.0, 0.0, 0.0, 0.0,
        a1,  0.0,  -a1,  1,  0.8, 0.8 ,0.0,  0.0, 0.0, 0.0,//1

        a1,  0.0,  -a1,  1,  0.8, 0.9 ,0.0,  0.0, 0.0, 0.0,
       0.0,  0.0, -0.5,  1,  0.8, 0.9 ,0.0,  0.0, 0.0, 0.0,
        a1,  2.0,  -a1,  1,  0.8, 0.9 ,0.0, 0.0, 0.0, 0.0,

        a1,  2.0,  -a1,  1,   0.7, 0.1 ,0.0, 0.0, 0.0, 0.0, 
       0.0,  2.0, -0.5,  1,   0.7, 0.1, 0.0, 0.0, 0.0, 0.0,
       0.0,  0.0, -0.5,  1,   0.7, 0.1, 0.0, 0.0, 0.0, 0.0, //2

       0.0,  0.0, -0.5,  1,   0.6, 0.1 ,0.0, 0.0, 0.0, 0.0,
       -a1,  0.0,  -a1,  1,  0.6, 0.1 ,0.0, 0.0, 0.0, 0.0,
       0.0,  2.0, -0.5,  1,   0.6, 0.1, 0.0, 0.0, 0.0, 0.0,

       0.0,  2.0, -0.5,  1,  0.5, 0.1, 0.0, 0.0, 0.0, 0.0,
       -a1,  2.0,  -a1,  1,  0.5, 0.1 ,0.0, 0.0, 0.0, 0.0,
       -a1,  0.0,  -a1,  1,  0.5, 0.1, 0.0, 0.0, 0.0, 0.0,//3

       -a1,  2.0,  -a1,  1,  0.4, 0.1, 0.0,  0.0, 0.0, 0.0,
      -0.5,  2.0,  0.0,  1,  0.4, 0.1 ,0.0, 0.0, 0.0, 0.0,
      -0.5,  0.0,  0.0,  1,   0.4, 0.1, 0.0, 0.0, 0.0, 0.0,

       -a1,  0.0,  -a1,  1,  0.8, 0.1, 0.0,  0.0, 0.0, 0.0,
      -0.5,  0.0,  0.0,  1,   0.8, 0.1 ,0.0, 0.0, 0.0, 0.0,
       -a1,  2.0,  -a1,  1,  0.8, 0.1, 0.0,  0.0, 0.0, 0.0,//4

       -0.5,  0.0,  0.0, 1,  0.8, 0.1 ,0.2, 0.0, 0.0, 0.0,
        -a1,  0.0,   a1, 1,  0.8, 0.1, 0.2, 0.0, 0.0, 0.0,
       -0.5,  2.0,  0.0, 1,  0.8, 0.1, 0.2, 0.0, 0.0, 0.0,

       -0.5,  2.0,  0.0, 1,  0.8, 0.1, 0.3, 0.0, 0.0, 0.0,
        -a1,  2.0,   a1, 1,  0.8, 0.1, 0.3, 0.0, 0.0, 0.0,
        -a1,  0.0,   a1, 1,  0.8, 0.1 ,0.3, 0.0, 0.0, 0.0,//5

       -a1,  0.0,   a1,  1,   0.8, 0.1 ,0.4, 0.0, 0.0, 0.0,
       0.0,  0.0,  0.5,  1,   0.8, 0.1, 0.4, 0.0, 0.0, 0.0,
       0.0,  2.0,  0.5,  1,   0.8, 0.1, 0.4, 0.0, 0.0, 0.0,

       -a1,  0.0,   a1,  1,  0.8, 0.1, 0.5, 0.0, 0.0, 0.0,
       -a1,  2.0,   a1,  1,  0.8, 0.1, 0.5, 0.0, 0.0, 0.0,
       0.0,  2.0,  0.5,  1,  0.8, 0.1, 0.5, 0.0, 0.0, 0.0,//6

       0.0,  2.0,  0.5,  1,  0.8, 0.1 ,0.7, 0.0, 0.0, 0.0,
       a1,   2.0,   a1,  1,  0.8, 0.1, 0.7, 0.0, 0.0, 0.0,
       0.0,  0.0,  0.5,  1,  0.8, 0.1, 0.7, 0.0, 0.0, 0.0,

       0.0,  0.0,  0.5,  1,  0.8, 0.1, 0.9, 0.0, 0.0, 0.0,
        a1,  0.0,   a1,  1,   0.8, 0.1 ,0.9, 0.0, 0.0, 0.0,
       a1,   2.0,   a1,  1,   0.8, 0.1 ,0.9, 0.0, 0.0, 0.0,//7

       a1,  0.0,    a1,  1,   0.5, 0.1 ,0.0, 0.0, 0.0, 0.0,
       0.5,  0.0,  0.0,  1,   0.5, 0.1 ,0.0, 0.0, 0.0, 0.0,
       a1,   2.0,   a1,  1,   0.5, 0.1 ,0.0, 0.0, 0.0, 0.0,

       a1,   2.0,   a1,  1,   0.2, 0.1, 0.0, 0.0, 0.0, 0.0,
       0.5,  2.0,  0.0,  1,   0.2, 0.1 ,0.0, 0.0, 0.0, 0.0,
       0.5,  0.0,  0.0,  1,   0.2, 0.1 ,0.0, 0.0, 0.0, 0.0,//8

       //axes(168-2-x-axe)
       0.0,  0.0,  0.0,   1,  1.0,0.0,0.0,0.0, 0.0, 0.0,
       1.0,  0.0,  0.0,   1,  1.0,0.0,0.0, 0.0, 0.0, 0.0,

       //axes(170-2-y-axe)
       0.0,  0.0,  0.0,   1,  0.0,1.0,0.0, 0.0, 0.0, 0.0,
       0.0,  1.0,  0.0,   1,  0.0,1.0,0.0, 0.0, 0.0, 0.0,

       //axes(172-2-z-axe)
       0.0,  0.0,  0.0,   1,  0.0,0.0,1.0, 0.0, 0.0, 0.0,
       0.0,  0.0,  1.0,   1,  0.0,0.0,1.0, 0.0, 0.0, 0.0,

       //cube for light(174-36)
       0,1,1, 1,  1,0,0,  0,1,0,
       1,1,1, 1,  1,0,0,  0,1,0,
       0,1,0, 1,  1,0,0,  0,1,0, 

       1,1,1, 1,  1,0,0,  0,1,0,
       0,1,0, 1,  1,0,0,  0,1,0,
       1,1,0, 1,  1,0,0,  0,1,0,// FRONT

       1,1,0, 1,  1,0,0,  1,0,0,
       1,1,1, 1,  1,0,0,  1,0,0,
       1,0,0, 1,  1,0,0,  1,0,0,

       1,1,1, 1,  1,0,0,  1,0,0,
       1,0,0, 1,  1,0,0,  1,0,0,
       1,0,1, 1,  1,0,0,  1,0,0,//Right

       1,1,0, 1,  1,0,0,  0,0,-1,
       0,1,0, 1,  1,0,0,  0,0,-1,
       1,0,0, 1,  1,0,0,  0,0,-1,

       0,1,0, 1,  1,0,0,  0,0,-1,
       1,0,0, 1,  1,0,0,  0,0,-1,
       0,0,0, 1,  1,0,0,  0,0,-1,//Dawn

       0,1,0, 1,  1,0,0,  -1,0,0,
       0,1,1, 1,  1,0,0,  -1,0,0,
       0,0,0, 1,  1,0,0,  -1,0,0,

       0,1,1, 1,  1,0,0,  -1,0,0,
       0,0,0, 1,  1,0,0,  -1,0,0,
       0,0,1, 1,  1,0,0,  -1,0,0,//left

       0,1,1, 1,  1,0,0,   0,0,1,
       1,1,1, 1,  1,0,0,   0,0,1,
       1,0,1, 1,  1,0,0,   0,0,1,

       0,1,1, 1,  1,0,0,   0,0,1,
       1,0,1, 1,  1,0,0,   0,0,1,
       0,0,1, 1,  1,0,0,   0,0,1,//top

       0,0,1, 1,  1,0,0,   0,-1,0,
       1,0,1, 1,  1,0,0,   0,-1,0,
       0,0,0, 1,  1,0,0,   0,-1,0,

       0,0,0, 1,  1,0,0,   0,-1,0,
       1,0,1, 1,  1,0,0,   0,-1,0,
       1,0,0, 1,  1,0,0,   0,-1,0,//back
  ]);
  makeGroundGrid();
	mySiz = forestVerts.length + gndVerts.length;
	var nn = mySiz / floatsPerVertex;
	console.log('nn is', nn, 'mySiz is', mySiz, 'floatsPerVertex is', floatsPerVertex);
	// Copy all shapes into one big Float32 array:
  var verticesColors = new Float32Array(mySiz);
	// Copy them:  remember where to start for each shape:
	forestStart = 0;							// we store the forest first.
  for(i=0,j=0; j< forestVerts.length; i++,j++) {
  	verticesColors[i] = forestVerts[j];
		} 
	gndStart = i;						// next we'll store the ground-plane;
	for(j=0; j< gndVerts.length; i++, j++) {
		verticesColors[i] = gndVerts[j];
		}
  // Create a vertex buffer object (VBO)
  var vertexColorbuffer = gl.createBuffer();  
  if (!vertexColorbuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  // Write vertex information to buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorbuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  var FSIZE = verticesColors.BYTES_PER_ELEMENT;
  // Assign the buffer object to a_Position and enable the assignment
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if(a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 4, gl.FLOAT, false, FSIZE * 10, 0);
  gl.enableVertexAttribArray(a_Position);
  // Assign the buffer object to a_Color and enable the assignment
  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if(a_Color < 0) {
    console.log('Failed to get the storage location of a_Color');
    return -1;
  }
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 10, FSIZE * 4);
  gl.enableVertexAttribArray(a_Color);

  var a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if(a_Normal < 0) {
    console.log('Failed to get the storage location of a_Color');
    return -1;
  }
  gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, FSIZE * 10, FSIZE * 7);
  gl.enableVertexAttribArray(a_Normal);
  return mySiz/floatsPerVertex;	// return # of vertices
}


function keydown(ev, gl, u_ViewMatrix,u_ProjMatrix,u_NormalMatrix,viewMatrix, normalMatrix) {
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
    else { return; } // Prevent the unnecessary drawing
    draw(gl, currentAngle, u_ViewMatrix,u_ProjMatrix, viewMatrix, u_NormalMatrix, normalMatrix);   
}

var g_EyeX = 0.20, g_EyeY =8, g_EyeZ = 0.25; 
var g_LookAtX = 0.0, g_LookAtY = 0.0, g_LookAtZ = 0.0;

function draw(gl, currentAngle, u_ViewMatrix,u_ProjMatrix, viewMatrix, u_NormalMatrix, normalMatrix) {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.viewport(0, 0,	canvas.width/2,canvas.height);
  projMatrix.setPerspective(30, 1, 1, 100);
  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements); 						
  viewMatrix.setLookAt(g_EyeX, g_EyeY, g_EyeZ,g_LookAtX, g_LookAtY, g_LookAtZ, 0, 0, 1);								
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
  drawMyScene(gl, currentAngle,u_ViewMatrix,u_ProjMatrix,viewMatrix, u_NormalMatrix, normalMatrix);
  gl.viewport(canvas.width/2, 0, canvas.width/2,canvas.height);
  projMatrix.setOrtho(-4, 4,-4, 4, 1, 50);   
  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
  viewMatrix.setLookAt(g_EyeX, g_EyeY, g_EyeZ, g_LookAtX, g_LookAtY, g_LookAtZ,  0, 0, 1);               // up vector (+y)
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
  drawMyScene(gl, currentAngle,u_ViewMatrix,u_ProjMatrix,viewMatrix, u_NormalMatrix, normalMatrix);}

function drawMyScene(myGL, currentAngle,myu_ViewMatrix,u_ProjMatrix, myViewMatrix, u_NormalMatrix, normalMatrix) {
	myViewMatrix.translate(0.0, 0.0, -0.8);	
  myViewMatrix.rotate(180,0,0,1); 
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
	myViewMatrix.scale(0.4, 0.4,0.4);	
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements);
  myGL.drawArrays(myGL.LINES,	gndStart/floatsPerVertex,	gndVerts.length/floatsPerVertex);		
  var dist = Math.sqrt(xMdragTot*xMdragTot + yMdragTot*yMdragTot);
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
  //AXES-X
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements);
  myGL.drawArrays(myGL.LINES,168,2); 
  //AXES-Y
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements);
  myGL.drawArrays(myGL.LINES,170,2); 
  //AXES-Z
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements);
  myGL.drawArrays(myGL.LINES,172,2); 
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
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 0, 36);

  //chetou
  myViewMatrix = popMatrix();
  myViewMatrix.translate(-0.5+currentAngle/180,-1.9,0.25)
  myViewMatrix.scale(0.4, 0.5, 0.4);
  myViewMatrix.rotate(90, 1, 0, 0);
  myViewMatrix.rotate(180, 0, 1, 0);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 36, 36);

  //something like a boat
  myViewMatrix = popMatrix();
  myViewMatrix.translate(+3,2,0.3);
  myViewMatrix.scale(1, 1, 0.8);
  myViewMatrix.rotate(130,0, 0, 1);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 72, 72);
  //background like
  myViewMatrix = popMatrix();
  myViewMatrix.translate(-2.0,4,0)
  myViewMatrix.rotate(90, 1, 0, 0);
  myViewMatrix.rotate(40, 0, 1, 0);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 36, 36);
  //background
  myViewMatrix = popMatrix();
  myViewMatrix.translate(1,3.8,0.0);
  myViewMatrix.scale(0.8, 0.8, 0.8);
  myViewMatrix.rotate(20, 0, 1, 1); 
  myViewMatrix.rotate(currentAngle, 0, 1, 0); 
  quatMatrix.setFromQuat(qTot.x, qTot.y, qTot.z, qTot.w); // Quaternion-->Matrix
  myViewMatrix.concat(quatMatrix);                         // apply that matrix. 
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 72, 96);
  //background
  myViewMatrix = popMatrix();
  myViewMatrix.translate(3,-4,0.0);
  myViewMatrix.scale(0.5, 0.5, 0.5);
  myViewMatrix.rotate(90, 0, 1, 0);
  myViewMatrix.rotate(30, -1, 0, 0);
  quatMatrix.setFromQuat(qTot.x, qTot.y, qTot.z, qTot.w); // Quaternion-->Matrix
  myViewMatrix.concat(quatMatrix);                         // apply that matrix.
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 0, 36);

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
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 0, 36);
  pushMatrix(myViewMatrix);

  //AXES-X
  myViewMatrix.translate(0,0.25,0);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements);
  myGL.drawArrays(myGL.LINES,168,2); 
  //AXES-Y
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements);
  myGL.drawArrays(myGL.LINES,170,2); 
  myViewMatrix.scale(3, 3, 3);
  //AXES-Z
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements);
  myGL.drawArrays(myGL.LINES,172,2); 

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
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 0, 36);
  //TUI
  myViewMatrix = popMatrix();
  myViewMatrix.translate(0.2,-1.5,0);
  myViewMatrix.rotate(180,0,0,1);
  myViewMatrix.translate(0,-0.5,0);
  myViewMatrix.rotate(currentAngle*2, 0, 0, 1);
  myViewMatrix.scale(0.1, 2.0, 0.1); 
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 0, 36);
  //SHOUBI
  myViewMatrix = popMatrix();
  myViewMatrix.translate(0.3,-0.7,0);
  myViewMatrix.rotate(180,0,0,1);
  myViewMatrix.translate(0,-0.5,0);
  myViewMatrix.rotate(currentAngle*0.2, 0, 0, 1);
  myViewMatrix.scale(0.1, 1.0, 0.1); 
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 0, 36);
  myViewMatrix.translate(0.2,0.5,0);
  myViewMatrix.rotate(currentAngle*0.01, 1, 1, 0);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 0, 36);
  myViewMatrix.translate(0.2,0.5,0);
  myViewMatrix.rotate(-currentAngle*0.01, 1, 1, 0);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 0, 36);
  myViewMatrix.translate(0.2,0.5,0);
  myViewMatrix.rotate(currentAngle*0.01, 1, 1, 0);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 0, 36);
  //SHOUBI
  myViewMatrix = popMatrix();
  myViewMatrix.translate(-0.3,-0.7,0);
  myViewMatrix.rotate(180,0,0,1);
  myViewMatrix.translate(0,-0.5,0);
  myViewMatrix.rotate(-currentAngle*0.2, 0, 0, 1);
  myViewMatrix.scale(0.1, 1.0, 0.1); 
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 0, 36);
  myViewMatrix.translate(0.2,0.5,0);
  myViewMatrix.rotate(currentAngle*0.01, 1, 1, 0);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 0, 36);
  myViewMatrix.translate(0.2,0.5,0);
  myViewMatrix.rotate(-currentAngle*0.01, 1, 1, 0);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 0, 36);
  myViewMatrix.translate(0.2,0.5,0);
  myViewMatrix.rotate(currentAngle*0.01, 0, 0, 1);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 0, 36);

  //yuanzhu weile lianjie
  myViewMatrix = popMatrix();
  myViewMatrix.translate(1.0,-6.0,0);
  myViewMatrix.rotate(180,0,0,1);
  myViewMatrix.translate(0,-0.5,0);
  myViewMatrix.rotate(currentAngle*0.5, 0, 0, 1);
  myViewMatrix.scale(0.4, 0.4, 0.4); 
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 72, 96);
   //AXES-X
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements);
  myGL.drawArrays(myGL.LINES,168,2); 
  //AXES-Y
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements);
  myGL.drawArrays(myGL.LINES,170,2); 
  //AXES-Z
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements);
  myGL.drawArrays(myGL.LINES,172,2); 
//yuanzhu weile lianjie
  myViewMatrix.translate(0,2.0,0);
  myViewMatrix.rotate(90,0,1,0);
  myViewMatrix.rotate(currentAngle*0.5, 0, 0, 1);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 72, 96);
   //AXES-X
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements);
  myGL.drawArrays(myGL.LINES,168,2); 
  //AXES-Y
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements);
  myGL.drawArrays(myGL.LINES,170,2); 
  //AXES-Z
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements);
  myGL.drawArrays(myGL.LINES,172,2); 
//yuanzhu weile lianjie
  myViewMatrix.translate(0,2.0,0);
  myViewMatrix.rotate(90,0,1,0);
  myViewMatrix.rotate(currentAngle*0.5, 0, 0, 1);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 72, 96);
   //AXES-X
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements);
  myGL.drawArrays(myGL.LINES,168,2); 
  //AXES-Y
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements);
  myGL.drawArrays(myGL.LINES,170,2); 
  //AXES-Z
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements);
  myGL.drawArrays(myGL.LINES,172,2); 
//yuanzhu weile lianjie
  myViewMatrix.translate(0,2.0,0);
  myViewMatrix.rotate(90,0,1,0);
  myViewMatrix.rotate(currentAngle*0.5, 0, 0, 1);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 72, 96);
   //AXES-X
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements);
  myGL.drawArrays(myGL.LINES,168,2); 
  //AXES-Y
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements);
  myGL.drawArrays(myGL.LINES,170,2); 
  //AXES-Z
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements);
  myGL.drawArrays(myGL.LINES,172,2); 
//yuanzhu weile lianjie
  myViewMatrix.translate(0,2.0,0);
  myViewMatrix.rotate(90,0,1,0);
  myViewMatrix.rotate(currentAngle*0.5, 0, 0, 1);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 72, 96);
   //AXES-X
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements);
  myGL.drawArrays(myGL.LINES,168,2); 
  //AXES-Y
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements);
  myGL.drawArrays(myGL.LINES,170,2); 
  //AXES-Z
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements);
  myGL.drawArrays(myGL.LINES,172,2); 
//yuanzhu weile lianjie
  myViewMatrix.translate(0,2.0,0);
  myViewMatrix.rotate(90,0,1,0);
  myViewMatrix.rotate(currentAngle*0.5, 0, 0, 1);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 72, 96);
  //AXES-X
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements);
  myGL.drawArrays(myGL.LINES,168,2); 
  //AXES-Y
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements);
  myGL.drawArrays(myGL.LINES,170,2); 
  //AXES-Z
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements);
  myGL.drawArrays(myGL.LINES,172,2); 
//yuanzhu weile lianjie
  myViewMatrix.translate(0,2.0,0);
  myViewMatrix.rotate(90,0,1,0);
  myViewMatrix.rotate(currentAngle*0.5, 0, 0, 1);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 72, 96);
  //AXES-X
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements);
  myGL.drawArrays(myGL.LINES,168,2); 
  //AXES-Y
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements);
  myGL.drawArrays(myGL.LINES,170,2); 
  //AXES-Z
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements);
  myGL.drawArrays(myGL.LINES,172,2); 

  myViewMatrix = popMatrix();
  myViewMatrix.translate(0,-10.0,0);
  myViewMatrix.scale(0.5, 0.5, 0.5); 
  myViewMatrix.rotate(currentAngle*3, 0, 0, 1);
  normalMatrix.setInverseOf(myViewMatrix);
  normalMatrix.transpose();
  myGL.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  myGL.uniformMatrix4fv(myu_ViewMatrix, false, myViewMatrix.elements)
  myGL.drawArrays(myGL.TRIANGLES, 174, 36);
}
var g_last = Date.now();

function animate(angle) {
  var now = Date.now();
  var elapsed = now - g_last;
  g_last = now;
  if(angle >   320.0 && ANGLE_STEP > 0) ANGLE_STEP = -ANGLE_STEP;
  if(angle <  0.0 && ANGLE_STEP < 0) ANGLE_STEP = -ANGLE_STEP;
  var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
  return newAngle %= 360;
}


function resetQuat() {
// Called when user presses 'Reset' button on our webpage, just below the 
// 'Current Quaternion' display.
  var res=5;
  qTot.clear();
  document.getElementById('QuatValue').innerHTML= 
                             '\t X=' +qTot.x.toFixed(res)+
                            'i\t Y=' +qTot.y.toFixed(res)+
                            'j\t Z=' +qTot.z.toFixed(res)+
                            'k\t W=' +qTot.w.toFixed(res)+
                            '<br>length='+qTot.length().toFixed(res);
}

function myMouseDown(ev, gl, canvas) {
  var rect = ev.target.getBoundingClientRect(); // get canvas corners in pixels
  var xp = ev.clientX - rect.left;                  // x==0 at canvas left edge
  var yp = canvas.height - (ev.clientY - rect.top); // y==0 at canvas bottom edge
  var x = (xp - canvas.width/2)  /    // move origin to center of canvas and
               (canvas.width/2);      // normalize canvas to -1 <= x < +1,
  var y = (yp - canvas.height/2) /    //                     -1 <= y < +1.
               (canvas.height/2);
  isDrag = true;                      // set our mouse-dragging flag
  xMclik = x;                         // record where mouse-dragging began
  yMclik = y;
};


function myMouseMove(ev, gl, canvas) {
  if(isDrag==false) return;       // IGNORE all mouse-moves except 'dragging'
  var rect = ev.target.getBoundingClientRect(); // get canvas corners in pixels
  var xp = ev.clientX - rect.left;                  // x==0 at canvas left edge
  var yp = canvas.height - (ev.clientY - rect.top); // y==0 at canvas bottom edge
  var x = (xp - canvas.width/2)  /    // move origin to center of canvas and
               (canvas.width/2);      // normalize canvas to -1 <= x < +1,
  var y = (yp - canvas.height/2) /    //                     -1 <= y < +1.
               (canvas.height/2);
  xMdragTot += (x - xMclik);          // Accumulate change-in-mouse-position,&
  yMdragTot += (y - yMclik);
  dragQuat(x - xMclik, y - yMclik);
  xMclik = x;                         // Make next drag-measurement from here.
  yMclik = y;
};

function myMouseUp(ev, gl, canvas) {
  var rect = ev.target.getBoundingClientRect(); // get canvas corners in pixels
  var xp = ev.clientX - rect.left;                  // x==0 at canvas left edge
  var yp = canvas.height - (ev.clientY - rect.top); // y==0 at canvas bottom edge
  var x = (xp - canvas.width/2)  /    // move origin to center of canvas and
               (canvas.width/2);      // normalize canvas to -1 <= x < +1,
  var y = (yp - canvas.height/2) /    //                     -1 <= y < +1.
               (canvas.height/2);
  console.log('myMouseUp  (CVV coords  ):  x, y=\t',x,',\t',y);
  
  isDrag = false;                     // CLEAR our mouse-dragging flag, and
  // accumulate any final bit of mouse-dragging we did:
  xMdragTot += (x - xMclik);
  yMdragTot += (y - yMclik);
 dragQuat(x - xMclik, y - yMclik);
};

function dragQuat(xdrag, ydrag) {
  var res = 5;
  var qTmp = new Quaternion(0,0,0,1);
  
  var dist = Math.sqrt(xdrag*xdrag + ydrag*ydrag);
  // console.log('xdrag,ydrag=',xdrag.toFixed(5),ydrag.toFixed(5),'dist=',dist.toFixed(5));
  qNew.setFromAxisAngle(-ydrag + 0.0001, xdrag + 0.0001, 0.0, dist*150.0);
  qTmp.multiply(qNew,qTot);     // apply new rotation to current rotation. 
  qTot.copy(qTmp);
  
};

