import React, { Component } from "react";
import * as THREE from "three";
import * as YUKA from "yuka";
import { OrbitControls } from './OrbitControls.js';

class Evolution extends Component
{



  componentDidMount(){
    const width = this.mount.clientWidth
    const height = this.mount.clientHeight
    //ADD SCENE
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color( 0xcccccc );
    this.scene.fog = new THREE.FogExp2(0xcccccc, 0.003);

    //ADD CAMERA
    this.camera = new THREE.PerspectiveCamera(
      100,
      width / height,
      0.1,
      1000
    )
    this.camera.position.set(400,200,0);
    //ADD RENDERER
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setClearColor('#000000')
    this.renderer.setSize(width, height)
    this.mount.appendChild(this.renderer.domElement)

    //GAME SETUP
    this.entityManager= new YUKA.EntityManager();
    this.time = new YUKA.Time();

    //DEFINE MATERIAL AND GEOMETRIES
    const treeGeo  = new THREE.CylinderBufferGeometry(0, 10, 30, 4, 1);
    const treeMat = new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true });
    const foodMat = new THREE.MeshBasicMaterial({color: 0x0000ff})
    const foodGeo = new THREE.BoxBufferGeometry( 5, 5, 5 );
    const entityMat = new THREE.MeshNormalMaterial({color: 0xff0000});
    const entityGeo = new THREE.BoxBufferGeometry( 5,10,5);

    let numTrees = 500;
    let numFood = 100;
    this.trees = new Array(numTrees);
    for(let i = 0; i < numTrees; ++i)
      this.trees[i] = new Array(2);
    this.food = new Array(numFood);
    for(let i = 0; i < numFood; ++i)
        this.food[i] = new Array(2);

    //Generate Trees and food pickups
    for(let i = 0; i < numTrees; i++)
    {
      //Add the meshs to the scene
      treeGeo.computeBoundingSphere();
      this.trees[i][0] = new THREE.Mesh(treeGeo, treeMat);
      this.trees[i][0].position.x = Math.random() * 1600 - 800;
      this.trees[i][0].position.y = 0;
      this.trees[i][0].position.z = Math.random() * 1600 -  800;
      this.trees[i][0].updateMatrix();
      this.trees[i][0].boundingRadius = treeGeo.boundingSphere.radius;
      this.scene.add(this.trees[i][0]);
      //Add them as entities
      this.trees[i][1] = new YUKA.GameEntity();
      this.trees[i][1].setRenderComponent(this.trees[i][0], this.sync)
      this.trees[i][1].position.copy(this.trees[i][0].position);
      this.trees[i][1].boundingRadius = treeGeo.boundingSphere.radius;
      this.entityManager.add(this.trees[i][1]);
    }

    //Generate Food
    for(let i = 0; i < 100; i++)
    {
      this.food[0][i] = new THREE.Mesh(foodGeo, foodMat);
      this.food[0][i].position.x = Math.random() * 1600 - 800;
      this.food[0][i].position.y = 0;
      this.food[0][i].position.z = Math.random() * 1600 - 800;
      this.food[0][i].updateMatrix();
      this.scene.add(this.food[0][i]);


      this.food[1][i] = new YUKA.GameEntity();
      this.food[1][i].setRenderComponent(this.food[0][i], this.sync);
      this.food[1][i].position.copy(this.food[0][i].position);
      this.entityManager.add(this.food[1][i]);
    }
    //Make the player
    entityGeo.computeBoundingSphere();
    this.playerMesh = new THREE.Mesh(entityGeo, entityMat);
    this.scene.add(this.playerMesh);
    this.player = new YUKA.Vehicle();
    this.player.maxSpeed = 10;
    this.player.boudingRadius = entityGeo.boundingSphere.radius;
    //this.player.smoother = new YUKA.Smoother(20);
    this.player.setRenderComponent(this.playerMesh, this.sync);

    //Make the player go for the closest food
    if(this.target == null)
    {
      this.target = this.food
    }
    else if(this.target.position == this.player.position)
    {
      this.scene.remove(this.target)
      this.entityManager.remove(this.target)
    }

    //Seeking behaviour
    const arriveBehaviour = new YUKA.ArriveBehavior(this.target.position);
    this.player.steering.add(arriveBehaviour);
    //Wander behaviour
    // const wanderBehaviour = new YUKA.WanderBehavior(50, 100, 2);
    // this.player.steering.add(wanderBehaviour);
    //Obstacle Avoidance
    const obstacleAvoidance = new YUKA.ObstacleAvoidanceBehavior(this.trees[0]);
    this.player.steering.add(obstacleAvoidance);

    console.log(this.player.steering.behaviors[0]);
    this.entityManager.add(this.player);


    //Controls for orbit
    this.controls = new OrbitControls(this.camera,this.renderer.domElement);
    this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
		this.controls.dampingFactor = 0.05;
		this.controls.screenSpacePanning = false;
		this.controls.minDistance = 25;
		this.controls.maxDistance = 250;
		this.controls.maxPolarAngle = Math.PI / 2;

    this.start()
  }
componentWillUnmount(){
    this.stop()
    this.mount.removeChild(this.renderer.domElement)
  }



start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate)
    }
  }
stop = () => {
    cancelAnimationFrame(this.frameId)
  }
sync( entity, renderComponent)
{
  renderComponent.matrix.copy(entity.worldMatrix);
}

animate = () => {
   this.frameId = window.requestAnimationFrame(this.animate);
   this.player.position = this.playerMesh.position;
   const delta = this.time.update().getDelta();
   this.entityManager.update(delta);
   this.controls.update();
   this.renderScene();
 }
renderScene = () => {
  this.renderer.render(this.scene, this.camera)
}

getClosestFood(food1, food2)
{
  let relLocation1 = (food1.position.x - this.playerMesh.position.x) + (food1.position.x - this.playerMesh.position.z);
  let relLocation2 = (food2.position.x - this.playerMesh.position.x) + (food2.position.x - this.playerMesh.position.z);
  if(relLocation1 > relLocation2)
  {
    return food2;
  }
  else
  {
    return food1;
  }

}


render(){
    return(
      <div
        style={{ width: window.screen.width, height: window.screen.height-200 }}
        ref={(mount) => { this.mount = mount }}
      />
    )
  }

}
export default Evolution;
