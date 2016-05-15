# EECS351_Computer Graphics
_February 2016_ <br/>
_Course: Introduction to Computer Graphics, Northwestern University, Evanston, IL_

## Project A: Generate 3D Objects
**[View It Here](http://htmlpreview.github.io/?https://github.com/weihanchu/EECS351_Computer-Graphics/blob/master/WeihanChu_ProjA.html)** <br/>
  Your mission in Project A is to use WebGL and HTML-5 to: <br/>
  a) Draw several moving, turning, jointed colored shapes with openGL’s basic drawing primitives(various forms of points, lines and triangles, etc.) using vertex buffer objects full of 3D vertex attributes. <br/>
  b) Use a modelMatrix-like matrix stack to transform those shapes them interactively (see ‘stretched robot’ code) <br/>
  c) Ensure that interesting parts of your on-screen image move continuously without user input (animation) and d) Make some parts of at least one jointed object move smoothly in response to keyboard and mouse inputs <br/>

## Project B: Explore 3D Space
**[View It Here](http://htmlpreview.github.io/?https://github.com/weihanchu/3DSpace_EECS351/blob/master/Weihanchu_ProjB.html)** <br/>
  Your mission in Project B is to fill the Canonical View Volume (CVV) of WebGL with the view seen by a 3D camera that users fly like an airplane, free to turn, dive, climb and go anywhere to explore a gigantic 3D ‘virtual world’. Your program will automatically re-size its 3D graphics to fill the full width of your browser window, to show two re-sized camera views side-by-side, with an orthographic view on the right, and perspective view on the left. The 3D world you explore will have patterned, grid-like ‘floor’ plane that stretches out to the horizon in the x,y directions. Arranged on this vast floor, you will place several animated, jointed solid objects (not wireframe) that you can explore by ‘flying’ around, between and behind them. Each vertex of each object must include its own individually-specified surface normal attributes, and these enable your shaders to compute a very basic overhead-lighting effect for diffuse/Lambertian materials.<br/>

## Project C: Lighting & Materials
**[View It Here](http://htmlpreview.github.io/?https://github.com/weihanchu/3DSpace_EECS351/blob/master/Weihanchu_ProjC.html)** <br/>
  Your mission in Project C is to create realistic interactive lighting and materials in WebGL in a ‘virtual world.’ As before, users ‘fly’ to explore 3D animated solid objects placed on a patterned ‘floor’ plane that stretches to the horizon in the x, y directions. Unlike Project B, the objects in this ‘virtual world’ are made from different materials, each with individually-specified emissive, ambient, diffuse, specular parameters. The world also contains several smoothly-movable user-adjustable light sources, each with individually specified position, ambient, diffuse, and specular parameters. 
