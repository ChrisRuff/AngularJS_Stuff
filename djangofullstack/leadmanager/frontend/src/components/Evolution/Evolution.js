import React, { Component } from "react";
import * as THREE from "three";
import * as YUKA from "yuka";
import Entity from "./Entity";
import Food from "./Food";
import Tree from "./Tree";
import { OrbitControls } from './OrbitControls.js';

class Evolution extends Component
{
  constructor()
  {
    super();
    this.time = new YUKA.Time();
  }
  componentDidMount(){
    const width = this.mount.clientWidth
    const height = this.mount.clientHeight
    this.cycleTime = 30;
    this.cycle = 0;
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

        //DEFINE MATERIAL AND GEOMETRIES
    this.treeGeo  = new THREE.CylinderBufferGeometry(0, 10, 30, 4, 1);
    this.treeMat = new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true });

    let numTrees = 500;
    let numFood = 250;
    this.trees = new Array(numTrees);
    this.food = new Array(numFood);
    this.entities = [];

    //Generate Trees and food pickups
    for(let i = 0; i < numTrees; i++)
    {
      //Add the meshs to the scene
      this.treeGeo.computeBoundingSphere();
      this.trees[i] = new Tree(this.treeGeo, this.treeMat);
      this.trees[i].mesh.boundingRadius = this.treeGeo.boundingSphere.radius;
      this.scene.add(this.trees[i].mesh);
      //Add them as entities
      this.trees[i].setRenderComponent(this.trees[i].mesh, this.sync)
      this.trees[i].boundingRadius = this.treeGeo.boundingSphere.radius;
      this.entityManager.add(this.trees[i]);
    }

    //Generate Food
    for(let i = 0; i < numFood; i++)
    {
      this.food[i] = new Food();
      this.scene.add(this.food[i].mesh);

      this.food[i].setRenderComponent(this.food[i].mesh, this.sync);
      this.entityManager.add(this.food[i]);
    }
    //Make the entities
    for(let i = 0; i < 25; ++i)
    {
      this.addEntity(this.food, this.trees);
    }




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
  addEntity(food, obstacles, genes)
  {
    this.entities.push(new Entity(food, obstacles, genes));

    let i = this.entities.length -1; 
    this.scene.add(this.entities[i].mesh);
    this.entities[i].setRenderComponent(this.entities[i].mesh, this.sync);
    this.entityManager.add(this.entities[i]);
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
     const delta = this.time.update().getDelta();
     this.entityManager.update(delta);
     this.controls.update();
     this.renderScene();
     this.checkForFlags();
     this.forceUpdate();
  }
  renderScene = () => {
    this.renderer.render(this.scene, this.camera)
  }

  reset()
  {
    //Increments the cycle
    this.cycle++;

    //Picks the best entitiy for breeding
    this.bestEntity = this.entities[0];
    for(let i = 0; i < this.entities.length; ++i)
    {
      if(this.bestEntity.energy < this.entities[i].energy)
      {
        this.bestEntity = this.entities[i];
      }
    }

    //Clears all the entities
    for(let i = 0; i < this.entities.length; ++i)
    {
        this.entities[i].dead = true;
    }
    for(let i = 0; i < 25; ++i)
      this.addEntity(this.food, this.trees, this.bestEntity.genes)
    console.log("Replicating Gene: ");
    console.log(this.bestEntity.genes);
  }
  checkForFlags()
  {
    for(let i = 0; i < this.entities.length; ++i)
    {
      if(this.entities[i].dead)
      {
        this.scene.remove(this.entities[i].mesh);
        this.entities.splice(i, 1);
      }
    }
    for(let i = 0; i < this.food.length;++i)
    {
      if(this.food[i].eaten)
      {
        this.scene.remove(this.food[i].mesh);
        this.food.splice(i, 1);
        //Replace the food
        this.food.push(new Food(this.foodGeo, this.foodMat));
        this.scene.add(this.food[this.food.length-1].mesh);

        this.food[this.food.length-1].setRenderComponent(this.food[this.food.length-1].mesh, this.sync);
        this.entityManager.add(this.food[this.food.length-1]);
      }

    }
    if((Math.round(((this.cycleTime * (this.cycle+1)) - this.time.getElapsed())*100)/100).toFixed(2) <= 0)
    {
      this.reset();
    }


  }



  render(){
      return(

        <div
          style={{ width: window.screen.width, height: window.screen.height-200 }}
          ref={(mount) => { this.mount = mount }}
        >
        <label style={{paddingRight: '10px'}}>Time left: {(Math.round(((this.cycleTime * (this.cycle+1)) - this.time.getElapsed())*100)/100).toFixed(2)}</label>
        <label>Entities Remaining: {this.entities !== undefined ? this.entities.length : ""}</label>
      </div>
      )
    }

}
export default Evolution;
