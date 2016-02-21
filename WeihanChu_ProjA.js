//weihanchu(wcm350)
//project1

// Vertex shader program----------------------------------
var VSHADER_SOURCE = 
  'uniform mat4 u_ModelMatrix;\n' +
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_Position = u_ModelMatrix * a_Position;\n' +
  '  gl_PointSize = 10.0;\n' +
  '  v_Color = a_Color;\n' +
  '}\n';

// Fragment shader program----------------------------------
var FSHADER_SOURCE = 
//  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
//  '#endif GL_ES\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n';

var ANGLE_STEP = 45.0;

var isDrag=false;   
var xMclik=0.0;     
var yMclik=0.0;   
var xMdragTot=0.0;  
var yMdragTot=0.0;
var mousexchange=0.0;
var mouseychange=0.0;
var colorchagemousechange=0.0;

var currentAngle = 0.0;

function main() {
//==============================================================================
  var canvas = document.getElementById('webgl');

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
    console.log('Failed to set the positions of the vertices');
    return;
  }

  canvas.onmousedown  = function(ev){myMouseDown( ev, gl, canvas) }; 
  
  canvas.onmousemove =  function(ev){myMouseMove( ev, gl, canvas) };
       
  canvas.onmouseup =    function(ev){myMouseUp(   ev, gl, canvas)};
            
  window.addEventListener("keydown", myKeyDown, false);
  window.addEventListener("keyup", myKeyUp, false);
  window.addEventListener("keypress", myKeyPress, false);

  gl.clearColor(0, 0, 0, 1);

  gl.enable(gl.DEPTH_TEST); 

  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) { 
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  var modelMatrix = new Matrix4();

  var tick = function() {
    currentAngle = animate(currentAngle);  
    draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix);   
    initVertexBuffers(gl,currentAngle);
    requestAnimationFrame(tick, canvas);   
  };
  tick();
}

function initVertexBuffers(gl) {
//==============================================================================
  var a = Math.sqrt(0.5);
  var a1=a/2;
  var colorchange = currentAngle/360;
  var prettydog = new Float32Array ([
    //node for cylinder
      0.0,  0.0,  0.0, 1.0,    0.2, 0.1+colorchange, 0.0,  
      0.5,  0.0,  0.0, 1.0,    0.3, 0.1+colorchange, 0.0,  
       a1,  0.0,  -a1, 1.0,    0.4, 0.1+colorchange, 0.0,//1

      0.0,  0.0,  0.0, 1.0,    0.5, 0.1+colorchange, 0.1,  
       a1,  0.0,  -a1, 1.0,    0.6, 0.1+colorchange, 0.1,  
      0.0,  0.0, -0.5, 1.0,    0.7, 0.1+colorchange, 0.1,//2

      0.0,  0.0,  0.0, 1.0,    0.8, 0.1+colorchange, 0.1,
      0.0,  0.0, -0.5, 1.0,    0.9, 0.1+colorchange, 0.1,
      -a1,  0.0,  -a1, 1.0,    1.0, 0.1+colorchange, 0.1, //3 

       0.0,  0.0,  0.0, 1.0,    0.9, 0.1+colorchange, 0.1,
       -a1,  0.0,  -a1, 1.0,    0.8, 0.1+colorchange, 0.1, 
      -0.5,  0.0,  0.0, 1.0,    0.7, 0.1+colorchange, 0.1,//4

       0.0,  0.0,  0.0, 1.0,    0.6, 0.1+colorchange, 0.1,
      -0.5,  0.0,  0.0, 1.0,    0.5, 0.1+colorchange, 0.1,
       -a1,  0.0,   a1, 1.0,    0.4, 0.1+colorchange, 0.1,//5

       0.0,  0.0,  0.0, 1.0,    0.3, 0.1+colorchange, 0.1,
       -a1,  0.0,   a1, 1.0,    0.2, 0.1+colorchange, 0.1,
       0.0,  0.0,  0.5, 1.0,    0.1, 0.1+colorchange, 0.1,//6

       0.0,  0.0,  0.0, 1.0,    0.0, 0.1+colorchange, 0.1,
       0.0,  0.0,  0.5, 1.0,    0.1, 0.1+colorchange, 0.1,
       a1,  0.0,   a1, 1.0,     0.2, 0.1+colorchange, 0.1,//7

       0.0,  0.0,  0.0, 1.0,    0.3, 0.1+colorchange, 0.1,
       a1,  0.0,   a1, 1.0,     0.4, 0.1+colorchange, 0.1,
       0.5,  0.0,  0.0, 1.0,    0.5, 0.1+colorchange, 0.0, //8 //24 

      0.0,  2.0,  0.0, 1.0,    1.0, 0.1+colorchange, 0.0,  
      0.5,  2.0,  0.0, 1.0,    0.9, 0.1+colorchange, 0.0,  
       a1,  2.0,  -a1, 1.0,    0.8, 0.1+colorchange, 0.0,//1

      0.0,  2.0,  0.0, 1.0,    0.7, 0.1+colorchange, 0.1,  
       a1,  2.0,  -a1, 1.0,    0.6, 0.1+colorchange, 0.1,  
      0.0,  2.0, -0.5, 1.0,    0.5, 0.1+colorchange, 0.1,//2

      0.0,  2.0,  0.0, 1.0,    0.4, 0.1+colorchange, 0.1,
      0.0,  2.0, -0.5, 1.0,    0.3, 0.1+colorchange, 0.1,
      -a1,  2.0,  -a1, 1.0,    0.2, 0.1+colorchange, 0.1,  //3

       0.0,  2.0,  0.0, 1.0,   0.1, 0.1+colorchange, 0.1,
       -a1,  2.0,  -a1, 1.0,   0.0, 0.1+colorchange, 0.1, 
      -0.5,  2.0,  0.0, 1.0,   0.1, 0.1+colorchange, 0.1,//4

       0.0,  2.0,  0.0, 1.0,   0.2, 0.1+colorchange, 0.1,
      -0.5,  2.0,  0.0, 1.0,   0.3, 0.1+colorchange, 0.1,
       -a1,  2.0,   a1, 1.0,    0.4, 0.1+colorchange, 0.1,//5

       0.0,  2.0,  0.0, 1.0,    0.5, 0.1+colorchange, 0.1,
       -a1,  2.0,   a1, 1.0,    0.6, 0.1+colorchange, 0.1,
       0.0,  2.0,  0.5, 1.0,    0.7, 0.1+colorchange, 0.1,//6

       0.0,  2.0,  0.0, 1.0,    0.8, 0.1+colorchange, 0.1,
       0.0,  2.0,  0.5, 1.0,    0.9, 0.1+colorchange, 0.1,
       a1,   2.0,   a1, 1.0,    1.0, 0.1+colorchange, 0.1,//7

       0.0,  2.0,  0.0, 1.0,    0.9, 0.1+colorchange, 0.1,
       a1,   2.0,   a1, 1.0,    0.8, 0.1+colorchange, 0.1,
       0.5,  2.0,  0.0, 1.0,    0.7, 0.1+colorchange, 0.0, //8 //48 

       0.5,  0.0,  0.0, 1.0,    0.6, 0.1+colorchange, 1.0,  
        a1,  0.0,  -a1, 1.0,    0.5, 0.1+colorchange, 1.0,
       0.5,  2.0,  0.0, 1.0,    0.4, 0.1+colorchange, 1.0, //middle//1

       0.5,  2.0,  0.0, 1.0,    0.3, 0.1+colorchange, 1.0,  
        a1,  2.0,  -a1, 1.0,    0.3, 0.1+colorchange, 1.0,
        a1,  0.0,  -a1, 1.0,    0.2, 0.1+colorchange, 1.0,//1

        a1,  0.0,  -a1, 1.0,    0.1, 0.1+colorchange, 1.0,  
       0.0,  0.0, -0.5, 1.0,    0.2, 0.1+colorchange, 1.0,
        a1,  2.0,  -a1, 1.0,    0.3, 0.1+colorchange, 1.0, 

        a1,  2.0,  -a1, 1.0,    0.4, 0.1+colorchange, 1.0,  
       0.0,  2.0, -0.5, 1.0,    0.5, 0.1+colorchange, 1.0,
       0.0,  0.0, -0.5, 1.0,    0.6, 0.1+colorchange, 1.0,//2

       0.0,  0.0, -0.5, 1.0,    0.7, 0.1+colorchange, 1.0,
       -a1,  0.0,  -a1, 1.0,    0.8, 0.1+colorchange, 1.0,
       0.0,  2.0, -0.5, 1.0,    0.9, 0.1+colorchange, 1.0,

       0.0,  2.0, -0.5, 1.0,    1.0, 0.1+colorchange, 1.0,
       -a1,  2.0,  -a1, 1.0,    0.9, 0.1+colorchange, 1.0, 
       -a1,  0.0,  -a1, 1.0,    0.8, 0.1+colorchange, 1.0,//3

       -a1,  2.0,  -a1, 1.0,    0.7, 0.1+colorchange, 1.0, 
      -0.5,  2.0,  0.0, 1.0,    0.6, 0.1+colorchange, 1.0,
      -0.5,  0.0,  0.0, 1.0,    0.5, 0.1+colorchange, 1.0,

       -a1,  0.0,  -a1, 1.0,    0.4, 0.1+colorchange, 1.0, 
      -0.5,  0.0,  0.0, 1.0,    0.3, 0.1+colorchange, 1.0,
       -a1,  2.0,  -a1, 1.0,    0.2, 0.1+colorchange, 1.0, //4

       -0.5,  0.0,  0.0, 1.0,   0.1, 0.1+colorchange, 1.0,
        -a1,  0.0,   a1, 1.0,   0.0, 0.1+colorchange, 1.0,
       -0.5,  2.0,  0.0, 1.0,   0.1, 0.1+colorchange, 1.0,

       -0.5,  2.0,  0.0, 1.0,   0.2, 0.1+colorchange, 1.0,
        -a1,  2.0,   a1, 1.0,   0.3, 0.1+colorchange, 1.0,
        -a1,  0.0,   a1, 1.0,   0.4, 0.1+colorchange, 1.0,//5

       -a1,  0.0,   a1, 1.0,    0.5, 0.1+colorchange, 1.0,
       0.0,  0.0,  0.5, 1.0,    0.6, 0.1+colorchange, 1.0,
       0.0,  2.0,  0.5, 1.0,    0.7, 0.1+colorchange, 1.0,

       -a1,  0.0,   a1, 1.0,    0.8, 0.1+colorchange, 1.0,
       -a1,  2.0,   a1, 1.0,    0.9, 0.1+colorchange, 1.0,
       0.0,  2.0,  0.5, 1.0,    1.0, 0.1+colorchange, 1.0,//6

       0.0,  2.0,  0.5, 1.0,    0.9, 0.1+colorchange, 0.0,
       a1,   2.0,   a1, 1.0,    0.8, 0.1+colorchange, 0.0,
       0.0,  0.0,  0.5, 1.0,   0.7, 0.1+colorchange, 0.0,

       0.0,  0.0,  0.5, 1.0,    0.6, 0.1+colorchange, 0.0,
        a1,  0.0,   a1, 1.0,     0.5, 0.1+colorchange, 0.0,
       a1,   2.0,   a1, 1.0,    0.4, 0.1+colorchange, 0.0,//7

       a1,  0.0,    a1, 1.0,     0.3, 0.1+colorchange, 1.0,
       0.5,  0.0,  0.0, 1.0,    0.2, 0.1+colorchange, 1.0,
       a1,   2.0,   a1, 1.0,    0.1, 0.1+colorchange, 1.0,

       a1,   2.0,   a1, 1.0,    0.0, 0.1+colorchange, 1.0,
       0.5,  2.0,  0.0, 1.0,    0.1, 0.1+colorchange, 1.0, 
       0.5,  0.0,  0.0, 1.0,    0.2, 0.1+colorchange, 1.0,//8

       //nodes for cube:
       -0.4,  0.0,  -1.0, 1.0,   colorchange, 0.2, 0.1,
       -0.4,  0.0,  1.0, 1.0,    colorchange, 1.0, 0.2,
        0.4,  0.0,  1.0, 1.0,    colorchange, 0.7, 0.3,//bottom

       -0.4,  0.0,  -1.0, 1.0,    colorchange, 0.2, 0.4,
        0.4,  0.0,  1.0, 1.0,    colorchange,  1.0, 0.5,
        0.4,  0.0,  -1.0, 1.0,    colorchange, 0.2, 0.7,//bottom

       -0.4,  0.0,  1.0, 1.0,    colorchange, 0.0, 0.6,
       0.4,  0.0,  1.0, 1.0,    colorchange, 0.0, 0.8,
       0.4,  0.5,  1.0, 1.0,    colorchange, 0.0, 0.9,

       0.4,  0.5,  1.0, 1.0,    colorchange, 0.7, 1.0,
       -0.4,  0.0,  1.0, 1.0,    colorchange, 0.0, 0.9,
       -0.4,  0.5,  1.0, 1.0,    colorchange, 0.5, 0.8,//front

       0.4,  0.0,  1.0, 1.0,    colorchange, 0.5, 0.7,
       0.4,  0.0,  -1.0, 1.0,    colorchange, 0.5, 0.6,
       0.4,  0.5,  1.0, 1.0,    colorchange, 0.5, 0.5,

       0.4,  0.0,  -1.0, 1.0,    colorchange, 0.5, 0.4,
       0.4,  0.5,  1.0, 1.0,    colorchange, 0.5, 0.3,
       0.4,  0.5,  -1.0, 1.0,    colorchange, 0.5, 0.2,//right

       0.4,  0.5,  -1.0, 1.0,    colorchange, 1.0, 0.1,
       0.4,  0.0,  -1.0, 1.0,    colorchange, 1.0, 0.2,
      -0.4,  0.0,  -1.0, 1.0,    colorchange, 1.0, 0.3,

      -0.4,  0.0,  -1.0, 1.0,    colorchange, 1.0, 0.4,
       0.4,  0.5,  -1.0, 1.0,    colorchange, 1.0, 0.5,
      -0.4,  0.5,  -1.0, 1.0,    colorchange, 1.0, 0.6,//back

      -0.4,  0.5,  -1.0, 1.0,    colorchange, 1.0, 0.7,
       0.4,  0.5,  -1.0, 1.0,    colorchange, 1.0, 0.8,
       0.4,  0.5,  1.0, 1.0,     colorchange, 1.0, 1.0,

      -0.4,  0.5,  -1.0, 1.0,   colorchange, 1.0, 1.0,
       0.4,  0.5,  1.0, 1.0,    colorchange, 1.0, 0.9,
      -0.4,  0.5,  1.0, 1.0,    colorchange, 1.0, 0.8,//top


       -0.4,  0.5,  -1.0, 1.0,    colorchange, 0.6, 0.7,
       -0.4,  0.5,  1.0, 1.0,     colorchange, 0.6, 0.6,
       -0.4,  0.0,  -1.0, 1.0,    colorchange, 0.6, 0.5,

       -0.4,  0.5,  1.0, 1.0,     colorchange, 0.6, 0.4,
       -0.4,  0.0,  -1.0, 1.0,    colorchange, 0.6, 0.3,
       -0.4,  0.0,  1.0, 1.0,     colorchange, 0.6, 0.2,//left

      //code for head
        0.0, 0.0, 0.0, 1.0,    1,0.1,colorchange,
        0.0, 0.0, 1.0, 1.0,    1,0.1,colorchange,
        2.0, 0.0, 1.0, 1.0,    1,0.1,colorchange,

        0.0, 0.0, 0.0, 1.0,    colorchange,0.7,colorchange,
        2.0, 0.0, 1.0, 1.0,    colorchange,0.6,colorchange,
        2.0, 0.0, 0.0, 1.0,    colorchange,0.5,colorchange,//bottom

        2.0, 0.0, 1.0, 1.0,    colorchange,0.4,colorchange,
        2.0, 0.0, 0.0, 1.0,    colorchange,0.3,colorchange,
        1.0, 1.0, 1.0, 1.0,    colorchange,0.2,colorchange,

        2.0, 0.0, 0.0, 1.0,    colorchange,0.1,colorchange,
        1.0, 1.0, 1.0, 1.0,    colorchange,0.1,colorchange,
        1.0, 1.0, 0.0, 1.0,    colorchange,1.0,colorchange,//right

        1.0, 1.0, 1.0, 1.0,    colorchange,0.9,colorchange,
        1.0, 1.0, 0.0, 1.0,    colorchange,0.8,colorchange,
        0.0, 1.0, 1.0, 1.0,    colorchange,0.7,colorchange,

        1.0, 1.0, 0.0, 1.0,    colorchange,0.6,colorchange,
        0.0, 1.0, 1.0, 1.0,    colorchange,0.5,colorchange,
        0.0, 1.0, 0.0, 1.0,    colorchange,0.4,colorchange,//top

        0.0, 1.0, 1.0, 1.0,    colorchange,0.5,colorchange,
        0.0, 1.0, 0.0, 1.0,    colorchange,0.4,colorchange,
        0.0, 0.0, 0.0, 1.0,    colorchange,0.3,colorchange,

        0.0, 1.0, 1.0, 1.0,    colorchange,0.5,colorchange,
        0.0, 0.0, 0.0, 1.0,    colorchange,0.3,colorchange,
        0.0, 0.0, 1.0, 1.0,    colorchange,0.4,colorchange,//left

        0.0, 1.0, 1.0, 1.0,    colorchange,0.1,1,
        0.0, 0.0, 1.0, 1.0,    colorchange,0.1,1,
        2.0, 0.0, 1.0, 1.0,    colorchange,0.1,1,

        2.0, 0.0, 1.0, 1.0,    colorchange,0.1,1,
        0.0, 1.0, 1.0, 1.0,    colorchange,0.1,1,
        1.0, 1.0, 1.0, 1.0,    colorchange,0.1,1,//front

        2.0, 0.0, 0.0, 1.0,    1,0.1,colorchange,
        1.0, 1.0, 0.0, 1.0,    1,0.1,colorchange,
        0.0, 1.0, 0.0, 1.0,    1,0.1,colorchange,

        2.0, 0.0, 0.0, 1.0,    1,0.1,colorchange,
        0.0, 1.0, 0.0, 1.0,    1,0.1,colorchange,
        0.0, 0.0, 0.0, 1.0,    1,0.1,colorchange,//back

        //ufo
        1.0, 0.0, 1.0, 1,0,    1.0,0,0.0+colorchagemousechange,
        1.0, 0.0,-1.0, 1.0,    0.9,0,0.1+colorchagemousechange,
       -1.0, 0.0,-1.0, 1.0,    0.8,0,0.2+colorchagemousechange,

        1.0, 0.0, 1.0, 1,0,    0.7,0,0.3+colorchagemousechange,
       -1.0, 0.0,-1.0, 1.0,    0.6,0,0.4+colorchagemousechange,
        1.0, 0.0, 1.0, 1.0,    0.5,0,0.5+colorchagemousechange,

        //backgroud(174+12=186)
        1,1,0,1,   1.0,colorchange,1.0,
        0,0,0,1,   0.9,colorchange,0.9,
        1,-1,0,1,  0.8,colorchange,0.8,

        1,1,0,1,  0.7,colorchange,0.7,
        0,0,0,1,   0.6,colorchange,0.6,
        -1,1,0,1,  0.5,colorchange,0.5,

        0,0,0,1,   0.4,colorchange,0.4,
        -1,1,0,1,   0.3,colorchange,0.3,
        -1,-1,0,1,  0.2,colorchange,0.2,

        0,0,0,1,     0.1,colorchange,0.1,
        -1,-1,0,1,    0.2,colorchange,0.2,
        1,-1,0,1 ,   0.3,colorchange,0.3,

        //diamand(186+24)
        0.1,0,0.1,0.1,   colorchange-0.1,0.1,1.0,
        0,0.1,0,0.1,   colorchange-0.2,0.2,1.0,
        0.1,0,-0.1,0.1,  colorchange-0.3,0.3,1.0,

        0,0.1,0,0.1,   colorchange-0.4,0.4,1.0,
        0.1,0,-0.1,0.1,  colorchange-0.5,0.5,1.0,
        -0.1,0,-0.1,0.1, colorchange-0.6,0.6,1.0,

        0,0.1,0,0.1,   colorchange-0.7,0.7,1.0,
        -0.1,0,-0.1,0.1, colorchange-0.8,0.8,1.0,
        -0.1,0,0.1,0.1,  colorchange-0.9,0.9,1.0,

        -0.1,0,0.1,0.1,  colorchange-1.0,1.0,1.0,
        0,0.1,0,0.1,   1.0,1.0,colorchange-1.0,
        0.1,0,0.1,0.1,   1.0,0.9,colorchange-0.9,

        0.1,0,0.1,0.1,  1.0,0.8,colorchange-0.8,
        0,-0.1,0,0.1,  1.0,0.7,colorchange-0.7,
        0.1,0,-0.1,0.1,  1.0,0.6,colorchange-0.6,

        0,-0.1,0,0.1,  1.0,0.5,colorchange-0.5,
        0.1,0,-0.1,0.1,  1.0,0.4,colorchange-0.4,
        -0.1,0,-0.1,0.1,  1.0,0.3,colorchange-0.3,

        0,-0.1,0,0.1,   1.0,0.2,colorchange-0.2,
        -0.1,0,-0.1,0.1,  1.0,0.1,colorchange-0.1,
        -0.1,0,0.1,0.1,   1.0,0.2,colorchange+0.2,

        -0.1,0,0.1,0.1,   1.0,0.3,colorchange+0.3,
        0,-0.1,0,0.1,  1.0,0.4,colorchange+0.4,
        0.1,0,0.1,0.1,   1.0,0.5,colorchange+0.5,


  ]);
  var n = 300;   

   var shapeBufferHandle = gl.createBuffer();  
  if (!shapeBufferHandle) {
    console.log('Failed to create the shape buffer object');
    return false;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, shapeBufferHandle);

  gl.bufferData(gl.ARRAY_BUFFER, prettydog, gl.STATIC_DRAW);

  var FSIZE = prettydog.BYTES_PER_ELEMENT; 

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if(a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }

  gl.vertexAttribPointer(a_Position, 4, gl.FLOAT, false, FSIZE * 7, 0);
	
  gl.enableVertexAttribArray(a_Position);

  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if(a_Color < 0) {
    console.log('Failed to get the storage location of a_Color');
    return -1;
  }

  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 7, FSIZE * 4);
  
  gl.enableVertexAttribArray(a_Color);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  return n;
}

function draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix) {
//==============================================================================
  gl.clear(gl.COLOR_BUFFER_BIT| gl.DEPTH_BUFFER_BIT);
  var dist = Math.sqrt(xMdragTot*xMdragTot + yMdragTot*yMdragTot);


  // modelMatrix.setTranslate(-0.4+mousexchange,-0.4+mouseychange, 0.0);
  // modelMatrix.scale(0.2, 0.2, 0.2);
  // modelMatrix.rotate(90, 1, 0, 0);
  // modelMatrix.rotate(currentAngle, 0, 1, 0);  
  // gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  // gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder

  modelMatrix.setTranslate(-0.4+mousexchange,-0.4+mouseychange, 0.0);
  modelMatrix.translate(0.6,0,0.0);
  modelMatrix.scale(0.2, 0.2, 0.2);
  modelMatrix.rotate(90, 1, 0, 0);
  modelMatrix.rotate(currentAngle, 0, -1, 0); 
  //modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder

  modelMatrix.setTranslate(-0.4+mousexchange,-0.4+mouseychange, 0.0);
  modelMatrix.translate(-0.08,0.42,0.0);
  modelMatrix.scale(0.2, 0.1, 0.2);
  modelMatrix.rotate(90, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 0, -1, 0); 
  //modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder

  modelMatrix.setTranslate(-0.1+mousexchange,-0.3+mouseychange,0.0);
  modelMatrix.scale(0.5, 0.35, 0.5);
  modelMatrix.rotate(90, 0, 1, 0);
  //modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES, 96, 36);//rectanguler

  modelMatrix.setTranslate(-0.47+mousexchange,-0.13+mouseychange,1);
  modelMatrix.scale(0.12, 0.3, 0.5);
  modelMatrix.rotate(90, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 0, -1, 0);
  //modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES, 96, 36);//rectanguler

  modelMatrix.setTranslate(-0.6+mousexchange,-0.3+mouseychange, 0.0);
  modelMatrix.scale(0.2, 0.35, 0.2);
  modelMatrix.rotate(180, 0, 1, 0);
  //modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head


  modelMatrix.setTranslate(0.0, 0.0, -0.5);
  modelMatrix.scale(0.5, 0.35, 0.5);
  modelMatrix.rotate(90, 0, 1, 0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 168, 6);//ufo

  modelMatrix.translate(1.2,-0.5, 0.0);
  modelMatrix.scale(0.5, 0.7, 0.5);
  modelMatrix.rotate(90, 0, 1, 0);
  modelMatrix.rotate(currentAngle*0.005, 0, 1, 0); 
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0); 
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//diaolan

  modelMatrix.translate(0.1, 0.7, 0);
  modelMatrix.scale(1,1,1);
  modelMatrix.rotate(currentAngle*0.3, 0,0,1);
  modelMatrix.translate(-0.1, 0, 0);  
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//diaolan

  modelMatrix.translate(-0.1, 1.9, 0);
  modelMatrix.scale(1,1,1);
  modelMatrix.rotate(currentAngle*0.15, 0,0,1);
  modelMatrix.translate(-0.1, 0, 0);  
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//diaolan

  modelMatrix.translate(-0.1, 1.9, 0);
  modelMatrix.scale(1,1,1);
  modelMatrix.rotate(currentAngle*0.05, 0,0,1);
  modelMatrix.translate(-0.1, 0, 0); 
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0); 
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//diaolan

  modelMatrix.setTranslate(-0.4+mousexchange, -0.7+mouseychange,0.0);
  modelMatrix.scale(0.1, 0.1, 0.1);
  modelMatrix.rotate(90, 1, 0, 0);
  modelMatrix.rotate(currentAngle, 1, 0, 0);  
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 0, 0);
  modelMatrix.rotate(currentAngle, 0, 1, 0); 
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0); 
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 0, 0);
  modelMatrix.rotate(currentAngle, 0, 1, 0); 
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0); 
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 0, 0);
  modelMatrix.rotate(currentAngle, 0, 1, 0);  
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 0, 0);
  modelMatrix.rotate(currentAngle, 0, 1, 0); 
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0); 
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things

  modelMatrix.setTranslate(-0.3+mousexchange, -0.7+mouseychange,0.0);
  modelMatrix.scale(0.1, 0.1, 0.1);
  modelMatrix.rotate(90, 1, 0, 0);
  modelMatrix.rotate(currentAngle, 1, 0, 0);  
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things2

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 0, 0);
  modelMatrix.rotate(currentAngle, 0, 1, 0); 
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0); 
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things2

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 0, 0);
  modelMatrix.rotate(currentAngle, 0, 1, 0); 
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0); 
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things2

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 0, 0);
  modelMatrix.rotate(currentAngle, 0, 1, 0);  
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things2

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 0, 0);
  modelMatrix.rotate(currentAngle, 0, 1, 0); 
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0); 
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things2

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 0, 1);
  modelMatrix.rotate(currentAngle, 1, 0, 0);  
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things2

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 0, 1, 1);
  modelMatrix.rotate(currentAngle, 1, 0, 0);  
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things2

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 0, 0);
  modelMatrix.rotate(currentAngle, 1, 0, 0); 
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0); 
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things2

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 1, 0);
  modelMatrix.rotate(currentAngle, 0, 0, 1);  
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things2

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 1, 0);
  modelMatrix.rotate(currentAngle, 0, 1, 0);
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);  
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things2

  modelMatrix.setTranslate(-0.2+mousexchange, -0.7+mouseychange,0.0);
  modelMatrix.scale(0.1, 0.1, 0.1);
  modelMatrix.rotate(90, 1, 0, 0);
  modelMatrix.rotate(currentAngle, 1, 0, 0);  
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things3

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 0, 0);
  modelMatrix.rotate(currentAngle, 0, 1, 0); 
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0); 
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things3

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 0, 0);
  modelMatrix.rotate(currentAngle, 0, 1, 0); 
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0); 
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things3

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 0, 0);
  modelMatrix.rotate(currentAngle, 0, 1, 0);  
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things3

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 0, 0);
  modelMatrix.rotate(currentAngle, 0, 1, 0); 
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0); 
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things3

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 0, 1);
  modelMatrix.rotate(currentAngle, 1, 0, 0);  
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things3

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 0, 1, 1);
  modelMatrix.rotate(currentAngle, 1, 0, 0);  
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things3

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 0, 0);
  modelMatrix.rotate(currentAngle, 1, 0, 0); 
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0); 
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things3

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 1, 0);
  modelMatrix.rotate(currentAngle, 0, 0, 1);  
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things3

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 1, 0);
  modelMatrix.rotate(currentAngle, 0, 1, 0);
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);  
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things3

  modelMatrix.setTranslate(-0.1+mousexchange, -0.7+mouseychange,0.0);
  modelMatrix.scale(0.1, 0.1, 0.1);
  modelMatrix.rotate(90, 1, 0, 0);
  modelMatrix.rotate(currentAngle, 1, 0, 0);  
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things4

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 0, 0);
  modelMatrix.rotate(currentAngle, 0, 1, 0); 
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0); 
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things4

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 0, 0);
  modelMatrix.rotate(currentAngle, 0, 1, 0); 
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0); 
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things4

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 0, 0);
  modelMatrix.rotate(currentAngle, 0, 1, 0);  
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things4

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 0, 0);
  modelMatrix.rotate(currentAngle, 0, 1, 0); 
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0); 
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things4

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 0, 1);
  modelMatrix.rotate(currentAngle, 1, 0, 0);  
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things4

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 0, 1, 1);
  modelMatrix.rotate(currentAngle, 1, 0, 0);  
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things4

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 0, 0);
  modelMatrix.rotate(currentAngle, 1, 0, 0); 
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0); 
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things4

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 1, 0);
  modelMatrix.rotate(currentAngle, 0, 0, 1);  
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things4

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 1, 0);
  modelMatrix.rotate(currentAngle, 0, 1, 0);
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);  
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things4

  modelMatrix.setTranslate(mousexchange, -0.7+mouseychange,0.0);
  modelMatrix.scale(0.1, 0.1, 0.1);
  modelMatrix.rotate(90, 1, 0, 0);
  modelMatrix.rotate(currentAngle, 1, 0, 0);  
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things5

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 0, 0);
  modelMatrix.rotate(currentAngle, 0, 1, 0); 
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0); 
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things5

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 0, 0);
  modelMatrix.rotate(currentAngle, 0, 1, 0); 
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0); 
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things5

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 0, 0);
  modelMatrix.rotate(currentAngle, 0, 1, 0);  
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things5

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 0, 0);
  modelMatrix.rotate(currentAngle, 0, 1, 0); 
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0); 
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things5

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 0, 1);
  modelMatrix.rotate(currentAngle, 1, 0, 0);  
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things5

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 0, 1, 1);
  modelMatrix.rotate(currentAngle, 1, 0, 0);  
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things5

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 0, 0);
  modelMatrix.rotate(currentAngle, 1, 0, 0); 
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0); 
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things5

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 1, 0);
  modelMatrix.rotate(currentAngle, 0, 0, 1);  
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things5

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 1, 0);
  modelMatrix.rotate(currentAngle, 0, 1, 0);
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);  
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things5

  modelMatrix.setTranslate(0.1+mousexchange, -0.7+mouseychange,0.0);
  modelMatrix.scale(0.1, 0.1, 0.1);
  modelMatrix.rotate(90, 1, 0, 0);
  modelMatrix.rotate(currentAngle, 1, 0, 0);  
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things6

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 0, 0);
  modelMatrix.rotate(currentAngle, 0, 1, 0); 
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0); 
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things6

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 0, 0);
  modelMatrix.rotate(currentAngle, 0, 1, 0); 
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0); 
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things6

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 0, 0);
  modelMatrix.rotate(currentAngle, 0, 1, 0);  
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things6

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 0, 0);
  modelMatrix.rotate(currentAngle, 0, 1, 0); 
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0); 
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things6

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 0, 1);
  modelMatrix.rotate(currentAngle, 1, 0, 0);  
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things6

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 0, 1, 1);
  modelMatrix.rotate(currentAngle, 1, 0, 0);  
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things6

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 0, 0);
  modelMatrix.rotate(currentAngle, 1, 0, 0); 
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0); 
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things6

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 1, 0);
  modelMatrix.rotate(currentAngle, 0, 0, 1);  
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things6

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 1, 0);
  modelMatrix.rotate(currentAngle, 0, 1, 0);
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);  
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things6

  modelMatrix.setTranslate(0.2+mousexchange, -0.7+mouseychange,0.0);
  modelMatrix.scale(0.1, 0.1, 0.1);
  modelMatrix.rotate(90, 1, 0, 0);
  modelMatrix.rotate(currentAngle, 1, 0, 0);  
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things7

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 0, 0);
  modelMatrix.rotate(currentAngle, 0, 1, 0); 
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0); 
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things7

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 0, 0);
  modelMatrix.rotate(currentAngle, 0, 1, 0); 
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0); 
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things7

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 0, 0);
  modelMatrix.rotate(currentAngle, 0, 1, 0);  
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things7

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 0, 0);
  modelMatrix.rotate(currentAngle, 0, 1, 0); 
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0); 
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things7

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 0, 1);
  modelMatrix.rotate(currentAngle, 1, 0, 0);  
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things7

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 0, 1, 1);
  modelMatrix.rotate(currentAngle, 1, 0, 0);  
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things7

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 0, 0);
  modelMatrix.rotate(currentAngle, 1, 0, 0); 
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0); 
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things7

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 1, 0);
  modelMatrix.rotate(currentAngle, 0, 0, 1);  
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things7

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(90, 1, 1, 0);
  modelMatrix.rotate(currentAngle, 0, 1, 0);
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);  
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder//things7

  modelMatrix.setTranslate(-0.8+mousexchange,0.8+mouseychange, 0.0);
  modelMatrix.scale(0.1, 0.1, 0.1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0); 
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head1

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0); 
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head1

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0); 
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head1

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0);
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0); 
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head1

  modelMatrix.setTranslate(-0.5+mousexchange,0.8+mouseychange, 0.0);
  modelMatrix.scale(0.1, 0.1, 0.1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0); 
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head2

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0); 
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head2

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0); 
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head2

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0);
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0); 
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head2

  modelMatrix.setTranslate(mousexchange-0.2,0.8+mouseychange, 0.0);
  modelMatrix.scale(0.1, 0.1, 0.1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0); 
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head3

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0); 
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head3

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0); 
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head3

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0);
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0); 
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head3

  modelMatrix.setTranslate(mousexchange+0.1,0.8+mouseychange, 0.0);
  modelMatrix.scale(0.1, 0.1, 0.1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0); 
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head4

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0); 
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head4

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0); 
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head4

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0);
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0); 
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head4

  modelMatrix.setTranslate(mousexchange+0.4,0.8+mouseychange, 0.0);
  modelMatrix.scale(0.1, 0.1, 0.1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0); 
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head5

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0); 
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head5

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0); 
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head5

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0);
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0); 
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head5

  modelMatrix.setTranslate(mousexchange+0.7,0.8+mouseychange, 0.0);
  modelMatrix.scale(0.1, 0.1, 0.1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0); 
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head6

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0); 
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head6

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0); 
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head6

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0);
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0); 
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head6

  modelMatrix.setTranslate(mousexchange+0.7,0.5+mouseychange, 0.0);
  modelMatrix.scale(0.1, 0.1, 0.1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0); 
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head7

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0); 
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head7

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0); 
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head7

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0);
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0); 
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head7

  modelMatrix.setTranslate(mousexchange+0.4,0.5+mouseychange, 0.0);
  modelMatrix.scale(0.1, 0.1, 0.1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0); 
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head8

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0); 
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head8

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0); 
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head8

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0);
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0); 
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head8

  modelMatrix.setTranslate(mousexchange+0.1,0.5+mouseychange, 0.0);
  modelMatrix.scale(0.1, 0.1, 0.1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0); 
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head9

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0); 
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head9

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0); 
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head9

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0);
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0); 
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head9

  modelMatrix.setTranslate(mousexchange-0.2,0.5+mouseychange, 0.0);
  modelMatrix.scale(0.1, 0.1, 0.1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0); 
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head10

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0); 
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head10

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0); 
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head10

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0);
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0); 
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head10

  modelMatrix.setTranslate(mousexchange-0.5,0.5+mouseychange, 0.0);
  modelMatrix.scale(0.1, 0.1, 0.1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0); 
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head11

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0); 
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head11

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0); 
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head11

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0);
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0); 
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head11

  modelMatrix.setTranslate(mousexchange-0.8,0.5+mouseychange, 0.0);
  modelMatrix.scale(0.1, 0.1, 0.1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0); 
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head12

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0); 
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head12

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0); 
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head12

  modelMatrix.scale(1, 1, 1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(currentAngle, 1, 1, 0);
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0); 
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 132, 36);//head12


  modelMatrix.setTranslate(-0.7+mousexchange,0.08+mouseychange,0.0);
  modelMatrix.scale(0.05, 0.05, 0.05);
  modelMatrix.rotate(90, 0, 0, 1);
  modelMatrix.rotate(currentAngle, 1, 0, 0); 
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES, 96, 36);//chedingdeng

  modelMatrix.translate(-0.1, 0.5, 0);
  modelMatrix.scale(1,1,1);
  modelMatrix.rotate(currentAngle, 1,0,0);
  modelMatrix.translate(-0.1, 0, 0);  
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 96, 36);///chedingdeng

  modelMatrix.setTranslate(-0.7+mousexchange,-0.32+mouseychange,0.0);
  modelMatrix.scale(0.05, 0.05, 0.05);
  modelMatrix.rotate(90, 0, 0, 1);
  modelMatrix.rotate(-currentAngle, 1, 0, 0); 
  modelMatrix.rotate(-dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES, 96, 36);//chedideng

  pushMatrix(modelMatrix);

  modelMatrix.scale(1,1,1);
  modelMatrix.rotate(-currentAngle, 1,0,0);
  modelMatrix.translate(-0.1, 0, 0);  
  modelMatrix.rotate(-dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 96, 36);///chedideng

  modelMatrix = popMatrix();

  modelMatrix.scale(1,1,1);
  modelMatrix.rotate(-currentAngle, 1,0,0);
  modelMatrix.translate(-0.1, -0.4, 0);  
  modelMatrix.rotate(-dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 96, 36);///chedideng


  modelMatrix.setTranslate(-0.68+mousexchange,-0.05+mouseychange,-1.0);
  modelMatrix.scale(0.2, 0.03, 0.1);
  modelMatrix.rotate(90, 0, 0, 1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES, 96, 36);//windows

  modelMatrix.setTranslate(-0.68+mousexchange,-0.15+mouseychange,-1.0);
  modelMatrix.scale(0.2, 0.03, 0.1);
  modelMatrix.rotate(90, 0, 0, 1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES, 96, 36);//windows

  modelMatrix.setTranslate(-0.695+mousexchange,-0.15+mouseychange,-1);
  modelMatrix.scale(0.012, 0.2, 0.5);
  modelMatrix.rotate(90, 0, 1, 0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES, 96, 36);//windows

  modelMatrix.setTranslate(-0.765+mousexchange,-0.15+mouseychange,-1);
  modelMatrix.scale(0.012, 0.2, 0.5);
  modelMatrix.rotate(90, 0, 1, 0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES, 96, 36);//windows

  modelMatrix.setTranslate(-0.1+mousexchange,-0.41+mouseychange,+1.0);
  modelMatrix.scale(0.3, 0.03, 0.1);
  modelMatrix.rotate(90, 0, 0, 1);
  modelMatrix.rotate(180, 0, 1, 0);
  modelMatrix.rotate(90, 1, 0, 0);
  modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES, 96, 36);//lunjian

  modelMatrix.setTranslate(0.8+mousexchange,-1.3+mouseychange, 0.0);
  modelMatrix.translate(-0.08,0.42,0.0);
  modelMatrix.scale(currentAngle/600, 0.05, 0.1);
  modelMatrix.rotate(90, 1, 0, 0);
  modelMatrix.rotate(currentAngle, 1, 0, 0); 
   modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES, 0, 96);//cylinder changeshape

}

var g_last = Date.now();

function animate(angle) {
//==============================================================================
  var now = Date.now();
  var elapsed = now - g_last;
  g_last = now;
  
  if(angle >   320.0 && ANGLE_STEP > 0) ANGLE_STEP = -ANGLE_STEP;
  if(angle <  0.0 && ANGLE_STEP < 0) ANGLE_STEP = -ANGLE_STEP;
  
  var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
  return newAngle %= 360;
}

function moreCCW() {
  ANGLE_STEP += 20;
   
}

function lessCCW() {
  ANGLE_STEP -= 20; 
}

function stop()
{
   if(ANGLE_STEP*ANGLE_STEP > 1) {
    myTmp = ANGLE_STEP;
    ANGLE_STEP = 0;
  }
  else {
    ANGLE_STEP = myTmp;
  }
}

function angleSubmit() {
  var UsrTxt=document.getElementById('usrAngle').value; 
  document.getElementById('Result').innerHTML ='You Typed: '+UsrTxt;
};

function clearDrag() {
// Called when user presses 'Clear' button in our webpage
  xMdragTot = 0.0;
  yMdragTot = 0.0;
}


function myMouseDown(ev, gl, canvas) {
//============================================================================== 
  var rect = ev.target.getBoundingClientRect(); 
  var xp = ev.clientX - rect.left;                  
  var yp = canvas.height - (ev.clientY - rect.top); 

  var x = (xp - canvas.width/2)  /    
               (canvas.width/2);     
  var y = (yp - canvas.height/2) /    
               (canvas.height/2);

  
  isDrag = true;                      
  xMdragTot += (x - xMclik);          
  yMdragTot += (y - yMclik);
  xMclik = x;                         
  yMclik = y;
};


function myMouseMove(ev, gl, canvas) {
//==============================================================================  

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
  xMdragTot += (x - xMclik);
  yMdragTot += (y - yMclik);
  console.log('myMouseUp: xMdragTot,yMdragTot =',xMdragTot,',\t',yMdragTot);
};

function myKeyDown(ev) {
//===============================================================================
  switch(ev.keyCode) {     
    case 37:    // left-arrow key
      console.log(' left-arrow.');
      mousexchange+=-0.1;
      document.getElementById('Result').innerHTML =
        ' Left Arrow:keyCode='+ev.keyCode;
      break;
    case 38:    // up-arrow key
      console.log('   up-arrow.');
      mouseychange+=0.1;
      document.getElementById('Result').innerHTML =
        '   Up Arrow:keyCode='+ev.keyCode;
      break;
    case 39:    // right-arrow key
      console.log('right-arrow.');
      mousexchange+=0.1;
      document.getElementById('Result').innerHTML =
        'Right Arrow:keyCode='+ev.keyCode;
      break;
    case 40:    // down-arrow key
      console.log(' down-arrow.');
       mouseychange+=-0.1;
       document.getElementById('Result').innerHTML =
        ' Down Arrow:keyCode='+ev.keyCode;
      break;
    default:
      colorchagemousechange+=0.5;
      console.log('myKeyDown()--keycode=', ev.keyCode, ', charCode=', ev.charCode);
      document.getElementById('Result').innerHTML =
        'myKeyDown()--keyCode='+ev.keyCode;
      break;
  }
}

function myKeyUp(ev) {
//===============================================================================

  console.log('myKeyDown()--keycode='+ev.keyCode+' released.');
}

function myKeyPress(ev) {
//===============================================================================
// Best for capturing alphanumeric keys and key-combinations such as 
// CTRL-C, alt-F, SHIFT-4, etc.
  console.log('myKeyPress():keyCode='+ev.keyCode  +', charCode=' +ev.charCode+
                        ', shift='    +ev.shiftKey + ', ctrl='    +ev.ctrlKey +
                        ', altKey='   +ev.altKey   +
                        ', metaKey(Command key or Windows key)='+ev.metaKey);
}
