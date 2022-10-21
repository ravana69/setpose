const MANNEQUIN_VERSION=4.41;const MANNEQUIN_POSTURE_VERSION=6;const AXIS={x:new THREE.Vector3(1,0,0),y:new THREE.Vector3(0,1,0),z:new THREE.Vector3(0,0,1)};class MannequinPostureVersionError extends Error{constructor(version){super('Posture data version '+version+' is incompatible with the currently supported version '+MANNEQUIN_POSTURE_VERSION+'.');this.name="IncompatibleMannequinError";}}
var fingercount;var modelcolor='white';var drawingguidecolor='rgb(61, 61, 61)';function createScene(){renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setPixelRatio(window.devicePixelRatio);renderer.setSize(window.innerWidth,window.innerHeight);renderer.domElement.style='width:100%; height:100%;';renderer.shadowMap.enabled=true;renderer.setAnimationLoop(drawFrame);$(".canvascontainer").append(renderer.domElement);scene=new THREE.Scene();scene.background=new THREE.Color('#F7F7F7');camera=new THREE.PerspectiveCamera(30,window.innerWidth/window.innerHeight,0.1,2000);camera.position.set(0,0,150);light=new THREE.PointLight('white',0.25);light.position.set(0,100,50);light.shadow.mapSize.width=Math.min(2*1024,renderer.capabilities.maxTextureSize/2);light.shadow.mapSize.height=light.shadow.mapSize.width;light.shadow.radius=8;light.castShadow=true;light2=new THREE.PointLight('white',0.25);light2.position.set(0,100,-150);light2.shadow.mapSize.width=Math.min(2*1024,renderer.capabilities.maxTextureSize/2);light2.shadow.mapSize.height=light2.shadow.mapSize.width;light2.shadow.radius=8;light2.castShadow=false;scene.add(light,light2,new THREE.AmbientLight('white',0.5));function onWindowResize(event){camera.aspect=window.innerWidth/window.innerHeight;camera.updateProjectionMatrix();renderer.setSize(window.innerWidth,window.innerHeight,true);}
window.addEventListener('resize',onWindowResize,false);onWindowResize();clock=new THREE.Clock();}
function drawFrame(){animate(100*clock.getElapsedTime());renderer.render(scene,camera);}
function animate(){}
function rad(x){return x*Math.PI/180;}
function grad(x){return Number((x*180/Math.PI).toFixed(1));}
function sin(x){return Math.sin(rad(x));}
function cos(x){return Math.cos(rad(x));}
class ParametricShape extends THREE.Group{constructor(tex,col,func,nU=3,nV=3){super();var obj=new THREE.Mesh(new THREE.ParametricBufferGeometry(func,nU,nV),new THREE.MeshPhongMaterial({color:col,shininess:1,map:tex,precision:'mediump'}));if(transparantmodel){obj.material.transparent=true;obj.material.opacity=0.6;}
obj.receiveShadow=true;obj.castShadow=true;this.add(obj);}
addSphere(r,y,x=0,z=0){var s=Mannequin.sphereTemplate.clone();if(drawingguide){s.material=new THREE.MeshPhongMaterial({color:drawingguidecolor,shininess:1,precision:'mediump'});}else{s.material=new THREE.MeshPhongMaterial({color:modelcolor,shininess:1,precision:'mediump'});}
if(transparantmodel&&!drawingguide){s.material.transparent=true;s.material.opacity=0.6;}
s.scale.set(r,r,r);s.position.set(x,y,z);this.add(s);return s;}}
class CustomHeadShape extends THREE.Group{constructor(feminine,params){super();const loader=new THREE.OBJLoader();var headobj=this;if(animemodel2){var loadurl='../props/animeheadm.obj';}
else if(animemodel){var loadurl='../props/animehead.obj';}
else if(detailedmodel){if(detailedmodel2){var loadurl='../props/realistic-head2.obj';}else{var loadurl='../props/realistic-head.obj';}}
loader.load(loadurl,function(object){var headmodel=object.children[0];headmodel.material=new THREE.MeshPhongMaterial({color:modelcolor,shininess:1,precision:'mediump'});if(transparantmodel){headmodel.material.transparent=true;headmodel.material.opacity=0.6;}
headmodel.receiveShadow=true;headmodel.castShadow=true;headobj.add(headmodel);headmodel.rotation.set(-Math.PI/2,0,Math.PI/2);headmodel.name='head';renderer.render(scene,camera);});}}
class HeadShape extends ParametricShape{constructor(feminine,params){super(Mannequin.texHead,modelcolor,function(u,v,target){var r=Mannequin.cossers(u,v,[[0.4,0.9,0,1,-3],]);u=360*u;v=180*v-90;var k=(1+(feminine?1:2)*sin(u)*cos(v))/10;target.set(r*params[0]*cos(u)*cos(v),r*params[1]*sin(u)*cos(v),(r+k)*params[2]*sin(v));},32,32);}}
var cyl1,footgroup;class ShoeShape extends THREE.Group{constructor(feminine,params,leftOrRight){if(detailedmodel){super();const loader=new THREE.OBJLoader();var footobj=this;var footmodel;loader.load('../props/foot-heel.obj',function(object){footmodel=object.children[0];footmodel.material=new THREE.MeshPhongMaterial({color:modelcolor,shininess:1,precision:'mediump'});if(transparantmodel){footmodel.material.transparent=true;footmodel.material.opacity=0.6;}
footmodel.receiveShadow=true;footmodel.castShadow=true;footmodel.position.set(2,1.65,-0.1);footmodel.scale.set(0.4,0.4,0.4);footmodel.rotation.set(0,Math.PI/-2,0);footmodel.name='';footobj.add(footmodel);renderer.render(scene,camera);});}else if(animemodel||animemodel2||bodybuilder){super();const loader=new THREE.OBJLoader();var footobj=this;var footmodel;loader.load('../props/animefoot.obj',function(object){footmodel=object.children[0];footmodel.material=new THREE.MeshPhongMaterial({color:modelcolor,shininess:1,precision:'mediump'});if(transparantmodel){footmodel.material.transparent=true;footmodel.material.opacity=0.6;}
footmodel.receiveShadow=true;footmodel.castShadow=true;footmodel.position.set(2,1.65,-0.1);footmodel.scale.set(0.4,0.4,0.4);footmodel.rotation.set(0,Math.PI/-2,0);footmodel.name='';footobj.add(footmodel);renderer.render(scene,camera);});}else{super();this.add(new ParametricShape(Mannequin.texLimb,modelcolor,function(u,v,target){var r=Mannequin.cossers(u,v,[[0.6,1.1,0.05,0.95,1],[0.6,0.68,0.35,0.65,feminine?1.2:1000]]);u=360*u;v=180*v-90;target.set((3*r-2)*params[0]*(cos(u)*cos(v)+(feminine?(Math.pow(sin(u+180),2)*cos(v)-1):0))-(feminine?0:2),params[1]*sin(u)*cos(v)+2,params[2]*sin(v));},24,12));if(feminine){this.add(new ParametricShape(Mannequin.texLimb,modelcolor,function(u,v,target){var r=Mannequin.cossers(u,v,[[0.6,1.1,0.05,0.95,1/2]]);u=360*u;v=180*v-90;target.set(0.3*(3*r-2)*params[0]*(cos(u)*cos(v)),0.8*params[1]*sin(u)*cos(v)+2,0.6*params[2]*sin(v));},12,12));this.children[0].rotation.set(0,0,0.4);this.children[1].rotation.set(0,0,0.4);}
this.rotation.z=-Math.PI/2;}}}
class PelvisShape extends ParametricShape{constructor(feminine,params){super(Mannequin.texLimb,modelcolor,function(u,v,target){var r=Mannequin.cossers(u,v,[[0.6,0.95,0,1,4],[0.7,1.0,0.475,0.525,-13],[-0.2,0.3,0,0.3,-4],[-0.2,0.3,-0.3,0,-4]]);u=360*u-90;v=180*v-90;target.set(-1.5+r*params[0]*cos(u)*Math.pow(cos(v),0.6),r*params[1]*sin(u)*Math.pow(cos(v),0.6),r*params[2]*sin(v));},32,32);}}
class LimbShape extends ParametricShape{constructor(feminine,params,nU=24,nV=32){var x=params[0],y=params[1],z=params[2],alpha=params[3],dAlpha=params[4],offset=params[5],scale=params[6],rad=params[7];super(Mannequin.texLimb,modelcolor,function(u,v,target){v=360*v;var r=offset+scale*cos(alpha+dAlpha*u);target.set(x*r*cos(v)/2,y*u,z*r*sin(v)/2);var w=new THREE.Vector3(x*cos(v)*cos(170*u-85)/2,y*(1/2+sin(180*u-90)/2),z*sin(v)*cos(180*u-90)/2);target=target.lerp(w,Math.pow(Math.abs(2*u-1),16));},nU,nV);this.children[0].position.set(0,-y/2,0);if(rad)this.addSphere(rad?rad:z/2,-y/2);}}
class CustomTorsoShape extends THREE.Group{constructor(params){super();const loader=new THREE.OBJLoader();var torsoobj=this;var loadurl='../props/animetorso.obj';if(animemodel2){loadurl='../props/animetorsom.obj';}else if(bodybuilder){loadurl='../props/bodybuildertorsom.obj';}else if(detailedmodel){if(detailedmodel2){loadurl='../props/animetorso.obj';}else{loadurl='../props/animetorsom.obj';}}
loader.load(loadurl,function(object){var torsomodel=object.children[0];torsomodel.material=new THREE.MeshPhongMaterial({color:modelcolor,shininess:1,precision:'mediump'});if(transparantmodel){torsomodel.material.transparent=true;torsomodel.material.opacity=0.6;}
torsomodel.receiveShadow=true;torsomodel.castShadow=true;torsomodel.position.set(0,8.7,0);torsomodel.scale.set(0.6,0.6,0.6);if(bodybuilder){torsomodel.position.set(0,8,0);torsomodel.scale.set(0.67,0.67,0.67);}
torsomodel.rotation.set(0,0,0);torsomodel.name='torso';torsoobj.add(torsomodel);var s=Mannequin.sphereTemplate.clone();if(drawingguide){s.material=new THREE.MeshPhongMaterial({color:drawingguidecolor,shininess:1,precision:'mediump'});}else{s.material=new THREE.MeshPhongMaterial({color:modelcolor,shininess:1,precision:'mediump'});}
s.scale.set(2,2,2);s.position.set(0,0,0);torsoobj.add(s);renderer.render(scene,camera);});}}
class TorsoShape extends ParametricShape{constructor(feminine,params){var x=params[0],y=params[1],z=params[2],alpha=params[3],dAlpha=params[4],offset=params[5],scale=params[6];super(Mannequin.texLimb,modelcolor,function(u,v,target){var r=offset+scale*cos(alpha+dAlpha*u);if(feminine)r+=Mannequin.cossers(u,v,[[0.35,0.85,0.7,0.95,2],[0.35,0.85,0.55,0.8,2]])-1;v=360*v+90;var x1=x*(0.3+r)*cos(v)/2,y1=y*u,z1=z*r*sin(v)/2;var x2=x*cos(v)*cos(180*u-90)/2,y2=y*(1/2+sin(180*u-90)/2),z2=z*sin(v)*cos(180*u-90)/2;var k=Math.pow(Math.abs(2*u-1),16),kx=Math.pow(Math.abs(2*u-1),2);if(x2<0)kx=k;target.set(x1*(1-kx)+kx*x2,y1*(1-k)+k*y2,z1*(1-k)+k*z2);},32,32);this.children[0].position.set(0,-y/2,0);this.addSphere(2,-y/2);}}
class Joint extends THREE.Group{constructor(parentJoint,pos,params,shape){super();var yVal=params[1];this.image=new shape(parentJoint?parentJoint.feminine:false,params);this.image.castShadow=true;if(shape!=PelvisShape&&shape!=ShoeShape)this.image.position.set(0,yVal/2,0);this.imageWrapper=new THREE.Group();this.imageWrapper.add(this.image);this.imageWrapper.castShadow=true;this.add(this.imageWrapper);this.castShadow=true;this.yVal=yVal;this.parentJoint=parentJoint;if(parentJoint){this.position.set(0,parentJoint.yVal,0);parentJoint.imageWrapper.add(this);this.feminine=parentJoint.feminine;}
if(pos){this.position.set(pos[0],pos[1],pos[2]);}
this.minRot=new THREE.Vector3();this.maxRot=new THREE.Vector3();}
get z(){this.rotation.reorder('YXZ');return this.rotation.z*180/Math.PI;}
set z(angle){this.rotation.reorder('YXZ');this.rotation.z=angle*Math.PI/180;}
get x(){this.rotation.reorder('YZX');return this.rotation.x*180/Math.PI;}
set x(angle){this.rotation.reorder('YZX');this.rotation.x=angle*Math.PI/180;}
get y(){this.rotation.reorder('ZXY');return this.rotation.y*180/Math.PI;}
set y(angle){this.rotation.reorder('ZXY');this.rotation.y=angle*Math.PI/180;}
reset(){this.rotation.set(0,0,0);}
get posture(){this.rotation.reorder('XYZ');return[grad(this.rotation.x),grad(this.rotation.y),grad(this.rotation.z)];}
set posture(pos){this.rotation.set(rad(pos[0]),rad(pos[1]),rad(pos[2]),'XYZ');}
getBumper(x,y,z){var bumper=new THREE.Vector3(x,y,z);this.image.localToWorld(bumper);this.parentJoint.image.worldToLocal(bumper);return bumper;}
hide(){this.image.visible=false;}
attach(image){this.imageWrapper.add(image);}
point(x,y,z){return scene.worldToLocal(this.localToWorld(new THREE.Vector3(x,y,z)));}
recolor(color,secondaryColor=color){var joint=this.image;if(typeof color==='string')
color=new THREE.Color(color);if(typeof secondaryColor==='string')
secondaryColor=new THREE.Color(secondaryColor);joint.children[0].material.color=color;if(joint.children.length>1)
{joint.children[1].material.color=secondaryColor;}}
select(state){this.traverse(function(o)
{if(o.material&&o.material.emissive)o.material.emissive.setRGB(state?0:0,state?-0.35:0,state?-0.35:0);});}}
class Pelvis extends Joint{constructor(parentJoint){if(animemodel||animemodel2){super(parentJoint,null,[3,4,parentJoint.feminine?5.5:5],PelvisShape);}else{super(parentJoint,null,[3,4,parentJoint.feminine?5.5:5],PelvisShape);}
if(drawingguide){var dgline=new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.25,10,8,1,false,0,6.28),new THREE.MeshPhongMaterial({color:drawingguidecolor,shininess:1,precision:'mediump'}));dgline.position.set(-1,-3,0);dgline.rotation.set(Math.PI/2,0,0);this.add(dgline);var dgline2=new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.25,6,8,1,false,0,6.28),new THREE.MeshPhongMaterial({color:drawingguidecolor,shininess:1,precision:'mediump'}));dgline2.position.set(-1.5,0,2.15);dgline2.rotation.set(2.6,0,-0.15);this.add(dgline2);var dgline3=new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.25,6,8,1,false,0,6.28),new THREE.MeshPhongMaterial({color:drawingguidecolor,shininess:1,precision:'mediump'}));dgline3.position.set(-1.5,0,-2.15);dgline3.rotation.set(-2.6,0,-0.15);this.add(dgline3);}
this.minRot=new THREE.Vector3(Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY);this.maxRot=new THREE.Vector3(Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY);}}
class Body extends Joint{constructor(feminine){super(null,null,[1,1,1],THREE.Group);this.feminine=feminine;this.minRot=new THREE.Vector3(Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY);this.maxRot=new THREE.Vector3(Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY);}
get bend(){return-this.z;}
set bend(angle){this.z=-angle;}
get tilt(){return-this.x;}
set tilt(angle){this.x=-angle;}
get turn(){return this.y;}
set turn(angle){this.y=angle;}}
class Torso extends Joint{constructor(parentJoint){if(animemodel||animemodel2||detailedmodel||bodybuilder){super(parentJoint,[-2,4,0],[0,0,0],CustomTorsoShape);}else{super(parentJoint,[-2,4,0],[5,17,10,parentJoint.feminine?10:80,parentJoint.feminine?520:380,parentJoint.feminine?0.8:0.9,parentJoint.feminine?0.25:0.2],TorsoShape);}
if(drawingguide){var dgline=new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.25,10,8,1,false,0,6.28),new THREE.MeshPhongMaterial({color:drawingguidecolor,shininess:1,precision:'mediump'}));dgline.position.set(0,14,0);dgline.rotation.set(Math.PI/2,0,0);this.add(dgline);var dgline2=new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.25,16,8,1,false,0,6.28),new THREE.MeshPhongMaterial({color:drawingguidecolor,shininess:1,precision:'mediump'}));dgline2.position.set(0,6,2.4);dgline2.rotation.set(0.38,0,0);this.add(dgline2);var dgline3=new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.25,16,8,1,false,0,6.28),new THREE.MeshPhongMaterial({color:drawingguidecolor,shininess:1,precision:'mediump'}));dgline3.position.set(0,6,-2.4);dgline3.rotation.set(-0.38,0,0);this.add(dgline3);}
this.minRot=new THREE.Vector3(-25,-50,-60);this.maxRot=new THREE.Vector3(25,50,25);}
get bend(){return-this.z;}
set bend(angle){this.z=-angle;}
get tilt(){return-this.x;}
set tilt(angle){this.x=-angle;}
get turn(){return this.y;}
set turn(angle){this.y=angle;}}
class Neck extends Joint{constructor(parentJoint){if(animemodel||animemodel2||detailedmodel){super(parentJoint,[0,15,0],[2.7,parentJoint.feminine?5:4,2.7,45,60,1,0.2,0],LimbShape);}else if(bodybuilder){super(parentJoint,[0,15,0],[2.7,7.5,2.7,45,60,1,0.2,0],LimbShape);}else{super(parentJoint,[0,15,0],[2,parentJoint.feminine?5:4,2,45,60,1,0.2,0],LimbShape);}
this.minRot=new THREE.Vector3(-45/2,-90/2,-60);this.maxRot=new THREE.Vector3(45/2,90/2,50/2);}}
class Head extends Joint{constructor(parentJoint){if(animemodel||animemodel2||detailedmodel){super(parentJoint,[0,4,0],[1,5,2],CustomHeadShape);}else{super(parentJoint,[1,3,0],[3,4,2.5],HeadShape);}
this.minRot=new THREE.Vector3(-45/2,-90/2,-60/2);this.maxRot=new THREE.Vector3(45/2,90/2,50/2);}
get nod(){return-2*this.z;}
set nod(angle){this.z=-angle/2;this.parentJoint.z=-angle/2;}
get tilt(){return-2*this.x;}
set tilt(angle){this.x=-angle/2;this.parentJoint.x=-angle/2;}
get turn(){return 2*this.y;}
set turn(angle){this.y=angle/2;this.parentJoint.y=angle/2;}
get posture(){this.rotation.reorder('XYZ');return[grad(this.rotation.x),grad(this.rotation.y),grad(this.rotation.z)];}
set posture(pos){this.rotation.set(rad(pos[0]),rad(pos[1]),rad(pos[2]),'XYZ');this.parentJoint.rotation.set(rad(pos[0]),rad(pos[1]),rad(pos[2]),'XYZ');}}
class Leg extends Joint{constructor(parentJoint,leftOrRight){if(detailedmodel){super(parentJoint,[-1,-3,3.5*leftOrRight],[4,15,4,-70,220,1,0.4,2],LimbShape);}else if(animemodel||animemodel2){super(parentJoint,[-1,-3,3.5*leftOrRight],[4,15,4,-70,220,1,0.4,2],LimbShape);}else if(bodybuilder){super(parentJoint,[-1,-3,3*leftOrRight],[4.7,15,4.7,-70,220,1,0.4,2],LimbShape);}else{super(parentJoint,[-1,-3,3.5*leftOrRight],[4,15,4,-70,220,1,0.4,2],LimbShape);}
this.leftOrRight=leftOrRight;this.imageWrapper.rotation.set(Math.PI,0,0);if(drawingguide){var dgline=new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.25,13,8,1,false,0,6.28),new THREE.MeshPhongMaterial({color:drawingguidecolor,shininess:1,precision:'mediump'}));dgline.position.set(0,8,0);this.children[0].add(dgline);}}
biologicallyImpossibleLevel(){var result=0;this.image.updateWorldMatrix(true);var p=this.getBumper(5,0,0);if(p.x<0)result+=-p.x;this.rotation.reorder('ZXY');var y=this.y;if(y>+60)result+=y-60;if(y<-60)result+=-60-y;return result;}
get raise(){return this.z;}
set raise(angle){this.z=angle;}
get straddle(){return-this.leftOrRight*this.x;}
set straddle(angle){this.x=-this.leftOrRight*angle;}
get turn(){return-this.leftOrRight*this.y;}
set turn(angle){this.y=-this.leftOrRight*angle;}}
class Knee extends Joint{constructor(parentJoint){if(detailedmodel){super(parentJoint,null,[4,14,4,-40,290,0.65,0.25,1.5],LimbShape);if(!drawingguide){var shin=new THREE.Mesh(new THREE.CylinderGeometry(0.5,0.9,10,8,1,false,0,6.28),new THREE.MeshPhongMaterial({color:modelcolor,shininess:1,precision:'mediump'}));shin.position.set(0.65,8.2,-this.parentJoint.leftOrRight*-0);shin.rotation.set(-this.parentJoint.leftOrRight*0.008,0,0.045);shin.scale.set(1,1,1);if(transparantmodel){shin.material.transparent=true;shin.material.opacity=0.6;}
this.children[0].add(shin);var kneepoints=[new THREE.Vector3(0.58,0.04,0),new THREE.Vector3(0.54,-0.06,0),new THREE.Vector3(0.40,-0.16,0),new THREE.Vector3(0,-0.17,0),]
var knee=new THREE.Mesh(new THREE.LatheGeometry(kneepoints,16,0,6.283185307179586),new THREE.MeshPhongMaterial({color:modelcolor,shininess:1,side:2,precision:'mediump'}));knee.position.set(1,0,0);knee.rotation.set(0,0,Math.PI/2);knee.scale.set(2.3,4,1.8);if(transparantmodel){knee.material.transparent=true;knee.material.opacity=0.6;}
this.children[0].add(knee);}}else if(bodybuilder){super(parentJoint,null,[4.3,14,4.3,-80,290,0.65,0.25,1.5],LimbShape);}else{super(parentJoint,null,[4,14,4,-40,290,0.65,0.25,1.5],LimbShape);}
if(drawingguide){var dgline=new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.25,13,8,1,false,0,6.28),new THREE.MeshPhongMaterial({color:drawingguidecolor,shininess:1,precision:'mediump'}));dgline.position.set(0,7.5,-this.parentJoint.leftOrRight*-0);this.children[0].add(dgline);}
this.minRot=new THREE.Vector3(0,0,0);this.maxRot=new THREE.Vector3(0,0,150);}
get bend(){return this.z;}
set bend(angle){this.z=angle;}
get posture(){this.rotation.reorder('XYZ');return[grad(this.rotation.z)];}
set posture(pos){this.rotation.set(0,0,rad(pos[0]),'XYZ');}}
class Ankle extends Joint{constructor(parentJoint,leftOrRight){super(parentJoint,null,[1,4,2],ShoeShape);this.leftOrRight=parentJoint.parentJoint.leftOrRight;if(animemodel||animemodel2||detailedmodel||bodybuilder){if(this.leftOrRight==-1){const scale=new THREE.Vector3(1,1,1);scale.z*=-1;this.scale.multiply(scale);this.position.set(this.position.x,this.position.y,this.position.z*-1);}}
if(drawingguide){var s=Mannequin.sphereTemplate.clone();s.material=new THREE.MeshPhongMaterial({color:drawingguidecolor,shininess:1,precision:'mediump'});s.scale.set(1,1,1);s.position.set(0,0.5,0);this.add(s);}
this.minRot=new THREE.Vector3(-25,-30,-70);this.maxRot=new THREE.Vector3(25,30,80);}
get bend(){return-this.z;}
set bend(angle){this.z=-angle;}
get tilt(){return this.leftOrRight*this.x;}
set tilt(angle){this.x=this.leftOrRight*angle;}
get turn(){return this.leftOrRight*this.y;}
set turn(angle){this.y=this.leftOrRight*angle;}}
class Arm extends Joint{constructor(parentJoint,leftOrRight){if(bodybuilder){super(parentJoint,[0,14,leftOrRight*7.5],[4,11,3.2,-140,360,0.9,0.25,1.7],LimbShape);}else{super(parentJoint,[0,14,leftOrRight*(parentJoint.feminine?5:6)],[3.5,11,2.5,-90,360,0.9,0.2,1.5],LimbShape);}
this.leftOrRight=leftOrRight;this.imageWrapper.rotation.set(Math.PI,Math.PI,0);if(drawingguide){var dgline=new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.25,10,8,1,false,0,6.28),new THREE.MeshPhongMaterial({color:drawingguidecolor,shininess:1,precision:'mediump'}));dgline.position.set(0,-5,0);this.add(dgline);}}
biologicallyImpossibleLevel(){var result=0;this.image.updateWorldMatrix(true);var p=this.getBumper(0,15,-0*5*this.leftOrRight);if(p.z*this.leftOrRight<-3)result+=-3-p.z*this.leftOrRight;if(p.x<-7&&p.y>0)result=p.y;this.rotation.reorder('ZXY');var r=this.rotation.y*180/Math.PI;var min=-90;var max=90;if(r>max)result+=r-max;if(r<min)result+=min-r;return result;}
get raise(){return this.z;}
set raise(angle){this.z=angle;}
get straddle(){return-this.leftOrRight*this.x;}
set straddle(angle){this.x=-this.leftOrRight*angle;}
get turn(){return-this.leftOrRight*this.y;}
set turn(angle){this.y=-this.leftOrRight*angle;}}
class Elbow extends Joint{constructor(parentJoint){if(bodybuilder){super(parentJoint,null,[3,11,3,-45,160,0.5,0.45,1.1],LimbShape);}else{super(parentJoint,null,[2.5,11,2,-40,150,0.5,0.45,1.1],LimbShape);}
this.minRot=new THREE.Vector3(0,0,0);this.maxRot=new THREE.Vector3(0,0,150);if(drawingguide){var dgline=new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.25,10.5,8,1,false,0,6.28),new THREE.MeshPhongMaterial({color:drawingguidecolor,shininess:1,precision:'mediump'}));dgline.position.set(0,5.5,-this.parentJoint.leftOrRight*-0);this.children[0].add(dgline);}}
get bend(){return this.z;}
set bend(angle){this.z=angle;}
get posture(){this.rotation.reorder('XYZ');return[grad(this.rotation.z)];}
set posture(pos){this.rotation.set(0,0,rad(pos[0]),'XYZ');}}
class Wrist extends Joint{constructor(parentJoint){if(detailedmodel){super(parentJoint,null,[1.2,2.1,3.5,-90,45,0.5,0.3,1/2],LimbShape);}else{super(parentJoint,null,[1.2,2,3.5,-90,45,0.5,0.3,1/2],LimbShape);}
this.leftOrRight=parentJoint.parentJoint.leftOrRight;this.imageWrapper.rotation.set(0,-this.leftOrRight*Math.PI/2,0);if(this.leftOrRight==-1)
{this.minRot=new THREE.Vector3(-20,-90,-90);this.maxRot=new THREE.Vector3(35,90,90);}
else
{this.minRot=new THREE.Vector3(-35,-90,-90);this.maxRot=new THREE.Vector3(20,90,90);}}
biologicallyImpossibleLevel(){var result=0;var wristX=new THREE.Vector3(),wristY=new THREE.Vector3(),wristZ=new THREE.Vector3();this.matrixWorld.extractBasis(wristX,wristY,wristZ);var elbowX=new THREE.Vector3(),elbowY=new THREE.Vector3(),elbowZ=new THREE.Vector3();this.parentJoint.matrixWorld.extractBasis(elbowX,elbowY,elbowZ);var dot1=wristY.dot(elbowY);if(dot1<0)result+=-dot1;var dot2=wristZ.dot(elbowZ);if(dot2<0)result+=-dot2;return result;}
get bend(){return-this.leftOrRight*this.x;}
set bend(angle){this.x=-this.leftOrRight*angle;}
get tilt(){return this.leftOrRight*this.z;}
set tilt(angle){this.z=this.leftOrRight*angle;}
get turn(){return this.leftOrRight*this.y;}
set turn(angle){this.y=this.leftOrRight*angle;}}
class Phalange extends Joint{constructor(parentJoint,params){super(parentJoint,null,params,LimbShape);this.minRot=new THREE.Vector3(0,0,-10);this.maxRot=new THREE.Vector3(0,0,100);}
get bend(){return this.z;}
set bend(angle){this.z=angle;}}
class ToePhalange extends Joint{constructor(parentJoint,params){super(parentJoint,null,params,LimbShape);const loader=new THREE.OBJLoader();var footobj=this;var footmodel;loader.load('../props/foot-toes.obj',function(object){footmodel=object.children[0];footmodel.material=new THREE.MeshPhongMaterial({color:modelcolor,shininess:1,precision:'mediump'});if(transparantmodel){footmodel.material.transparent=true;footmodel.material.opacity=0.6;}
footmodel.receiveShadow=true;footmodel.castShadow=true;footmodel.position.set(0,0.7,0);footmodel.scale.set(0.4,0.4,0.4);footmodel.rotation.set(Math.PI/2,0,Math.PI/2);if(parentJoint.leftOrRight==1){footmodel.name='r_toes';}else{footmodel.name='l_toes';}
footobj.add(footmodel);renderer.render(scene,camera);});this.minRot=new THREE.Vector3(0,0,-70);this.maxRot=new THREE.Vector3(0,0,100);}
get bend(){return this.z;}
set bend(angle){this.z=angle;}}
class Fingers extends Phalange{constructor(parentJoint){if(detailedmodel){fingercount++;var fingerwidth=0.8;var fingertiplength=1.2;var fingerbottomlength=1.3;switch(fingercount){case 1:fingertiplength=1.3;fingerbottomlength=1.45;break;case 2:break;case 3:break;case 4:fingerwidth=0.64;fingertiplength=0.9;fingerbottomlength=0.9;break;case 5:fingertiplength=0.8;fingerbottomlength=0.8;break;default:}
super(parentJoint,[fingerwidth,fingerbottomlength,fingerwidth,0,45,0.3,0.4,0.2]);this.tips=new Phalange(this,[fingerwidth,fingertiplength,fingerwidth,45,45,0.3,0.4,0.2]);this.minRot=new THREE.Vector3(-180,180,-180);this.maxRot=new THREE.Vector3(180,180,180);}else{super(parentJoint,[1.2,1.5,3.5,0,45,0.3,0.4,0.2]);this.tips=new Phalange(this,[1.2,1,3.5,45,45,0.3,0.4,0.2]);this.minRot=new THREE.Vector3(0,0,-10);this.maxRot=new THREE.Vector3(0,0,120);}}
get bend(){return this.z;}
set bend(angle){this.z=this.tips.z=angle;}
get turn(){return 2*this.y;}
set turn(angle){this.y=angle/2;this.tips.y=angle/2;}
get posture(){this.rotation.reorder('XYZ');this.tips.rotation.reorder('XYZ');return[grad(this.rotation.z),grad(this.tips.rotation.z)];}
set posture(pos){this.rotation.set(0,0,rad(pos[0]),'XYZ');this.tips.rotation.set(0,0,rad(pos[1]),'XYZ');}}
class Toes extends ToePhalange{constructor(parentJoint){if(detailedmodel){super(parentJoint,[0,0,0,45,20,0.3,0.4,0]);this.position.set(4.2,2.2,0);this.rotation.z=-1.5;this.minRot=new THREE.Vector3(0,0,-180);this.maxRot=new THREE.Vector3(0,0,40);}}
get bend(){return this.z;}
set bend(angle){this.z=angle;}}
class Mannequin extends THREE.Group{constructor(feminine,height=1){super();const LEFT=-1;const RIGHT=1;this.scale.set(height,height,height);this.feminine=feminine;this.body=new Body(feminine);this.pelvis=new Pelvis(this.body);this.torso=new Torso(this.pelvis);this.neck=new Neck(this.torso);this.head=new Head(this.neck);this.l_leg=new Leg(this.pelvis,LEFT);this.l_knee=new Knee(this.l_leg);this.l_ankle=new Ankle(this.l_knee,LEFT);if(detailedmodel){this.l_toes=new Toes(this.l_ankle);}
this.r_leg=new Leg(this.pelvis,RIGHT);this.r_knee=new Knee(this.r_leg);this.r_ankle=new Ankle(this.r_knee,RIGHT);if(detailedmodel){this.r_toes=new Toes(this.r_ankle);}
this.l_arm=new Arm(this.torso,LEFT);this.l_elbow=new Elbow(this.l_arm);this.l_wrist=new Wrist(this.l_elbow);if(detailedmodel){fingercount=0;this.l_fingers=new Fingers(this.l_wrist);this.l_fingers2=new Fingers(this.l_wrist);this.l_fingers3=new Fingers(this.l_wrist);this.l_fingers4=new Fingers(this.l_wrist);this.l_fingers5=new Fingers(this.l_wrist);this.l_fingers2.position.set(0,2,-0.9);this.l_fingers.position.set(0.1,2,-0.25);this.l_fingers3.position.set(0.07,2,0.35);this.l_fingers4.position.set(0,2,0.9);this.l_fingers5.position.set(-0.15,1,-1);this.l_fingers5.rotation.x=-2.1;this.l_fingers5.rotation.y=1;this.l_fingers5.rotation.z=-2.5;}else{this.l_fingers=new Fingers(this.l_wrist);}
this.r_arm=new Arm(this.torso,RIGHT);this.r_elbow=new Elbow(this.r_arm);this.r_wrist=new Wrist(this.r_elbow);if(detailedmodel){fingercount=0;this.r_fingers=new Fingers(this.r_wrist);this.r_fingers2=new Fingers(this.r_wrist);this.r_fingers3=new Fingers(this.r_wrist);this.r_fingers4=new Fingers(this.r_wrist);this.r_fingers5=new Fingers(this.r_wrist);this.r_fingers2.position.set(0,2,0.9);this.r_fingers.position.set(0.1,2,0.25);this.r_fingers3.position.set(0.07,2,-0.35);this.r_fingers4.position.set(0,2,-0.9);this.r_fingers5.position.set(-0.15,1,1);this.r_fingers5.rotation.x=2.1;this.r_fingers5.rotation.y=-1;this.r_fingers5.rotation.z=2.5;}else{this.r_fingers=new Fingers(this.r_wrist);}
this.add(this.body);var s=1.5/(0.5+height);this.head.scale.set(s,s,s);this.castShadow=true;this.receiveShadow=true;scene.add(this);this.updateMatrix();this.updateWorldMatrix();this.body.turn=-90;this.torso.bend=2;this.head.nod=-10;this.l_arm.raise=-5;this.r_arm.raise=-5;this.l_arm.straddle=7;this.r_arm.straddle=7;this.l_elbow.bend=15;this.r_elbow.bend=15;this.l_wrist.bend=-15;this.r_wrist.bend=-15;if(detailedmodel){this.l_fingers.bend=10;this.l_fingers2.bend=10;this.l_fingers3.bend=10;this.l_fingers4.bend=10;this.l_fingers5.bend=5;this.r_fingers.bend=10;this.r_fingers2.bend=10;this.r_fingers3.bend=10;this.r_fingers4.bend=10;this.r_fingers5.bend=5;}else{this.l_fingers.bend=10;this.r_fingers.bend=10;}}
get bend(){return-this.body.z;}
set bend(angle){this.body.z=-angle;}
get tilt(){return this.body.x;}
set tilt(angle){this.body.x=angle;}
get turn(){return this.body.y;}
set turn(angle){this.body.y=angle;}
get posture(){var posture=[[Number((this.body.position.x).toFixed(1)),Number((this.body.position.y).toFixed(1)),Number((this.body.position.z).toFixed(1))],this.body.posture,this.torso.posture,this.head.posture,this.l_leg.posture,this.l_knee.posture,this.l_ankle.posture,this.r_leg.posture,this.r_knee.posture,this.r_ankle.posture,this.l_arm.posture,this.l_elbow.posture,this.l_wrist.posture,this.l_fingers.posture,this.r_arm.posture,this.r_elbow.posture,this.r_wrist.posture,this.r_fingers.posture];return{version:MANNEQUIN_POSTURE_VERSION,data:posture,};}
set posture(posture){if(posture.version!=MANNEQUIN_POSTURE_VERSION)
throw new MannequinPostureVersionError(posture.version);var i=0;var posdata=posture.data[i++];if(posdata.length>1){this.body.position.x=posdata[0];this.body.position.y=posdata[1];this.body.position.z=posdata[2];}else{this.body.position.x=0;this.body.position.y=posdata;this.body.position.z=0;}
this.body.posture=posture.data[i++];this.torso.posture=posture.data[i++];this.head.posture=posture.data[i++];this.l_leg.posture=posture.data[i++];this.l_knee.posture=posture.data[i++];this.l_ankle.posture=posture.data[i++];this.r_leg.posture=posture.data[i++];this.r_knee.posture=posture.data[i++];this.r_ankle.posture=posture.data[i++];this.l_arm.posture=posture.data[i++];this.l_elbow.posture=posture.data[i++];this.l_wrist.posture=posture.data[i++];this.l_fingers.posture=posture.data[i++];this.r_arm.posture=posture.data[i++];this.r_elbow.posture=posture.data[i++];this.r_wrist.posture=posture.data[i++];this.r_fingers.posture=posture.data[i++];if(detailedmodel){this.l_fingers2.posture=this.l_fingers3.posture=this.l_fingers4.posture=this.l_fingers.posture;this.r_fingers2.posture=this.r_fingers3.posture=this.r_fingers4.posture=this.r_fingers.posture;}}
get postureString(){return JSON.stringify(this.posture);}
set postureString(string){this.posture=JSON.parse(string);}}
class Female extends Mannequin{constructor(height=0.95){super(true,height);this.position.y=2.2;this.l_leg.straddle-=4;this.r_leg.straddle-=4;this.l_ankle.tilt-=4;this.r_ankle.tilt-=4;}}
class Male extends Mannequin{constructor(height=1){super(false,height);this.position.y=3.8;this.l_leg.straddle+=6;this.r_leg.straddle+=6;this.l_ankle.turn+=6;this.r_ankle.turn+=6;this.l_ankle.tilt+=6;this.r_ankle.tilt+=6;}}
class Child extends Mannequin{constructor(height=0.65){super(false,height);this.position.y=-7.7;this.l_arm.straddle-=2;this.r_arm.straddle-=2;}}
class Dog extends Mannequin{constructor(height=0.5){super(false,height);this.position.y=-18
this.rotation.x=1.57
this.l_leg.straddle+=6;this.r_leg.straddle+=6;this.l_ankle.turn+=6;this.r_ankle.turn+=6;this.l_ankle.tilt+=6;this.r_ankle.tilt+=6;}}
Mannequin.colors=['white','white','white','white','white','white'];Mannequin.texHead=new THREE.TextureLoader().load("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAB9SURBVHhe7dCxAQAgDICw6v8/Vwe+gCzsnP1G7FKtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCpmQdVOgR8MR1eowAAAABJRU5ErkJggg==");Mannequin.texLimb=new THREE.TextureLoader().load("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAB9SURBVHhe7dCxAQAgDICw6v8/Vwe+gCzsnP1G7FKtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCtBlCpmQdVOgR8MR1eowAAAABJRU5ErkJggg==");Mannequin.sphereTemplate=new THREE.Mesh(new THREE.SphereBufferGeometry(1,16,8),new THREE.MeshPhongMaterial({color:modelcolor,shininess:1,precision:'mediump'}));Mannequin.sphereTemplate.castShadow=true;Mannequin.sphereTemplate.receiveShadow=true;Mannequin.cossers=function(u,v,params){function cosser(t,min,max){if(t<min)t++;if(t>max)t--;if(min<=t&&t<=max)
return 0.5+0.5*Math.cos((t-min)/(max-min)*2*Math.PI-Math.PI);return 0;}
for(var i=0,r=1;i<params.length;i++)
r+=cosser(u,params[i][0],params[i][1])*cosser(v,params[i][2],params[i][3])/params[i][4];return r;}
Mannequin.blend=function(posture0,posture1,k){if(posture0.version!=posture1.version)
throw 'Incompatibe posture blending.';function lerp(data0,data1,k){if(data0 instanceof Array)
{var result=[];for(var i in data0)
result.push(lerp(data0[i],data1[i],k));return result;}
else
{return data0*(1-k)+k*data1;}}
return{version:posture1.version,data:lerp(posture0.data,posture1.data,k)};}