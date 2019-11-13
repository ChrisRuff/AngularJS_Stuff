import React, { Component } from "react";
import * as THREE from "three";
import * as YUKA from "yuka";

import Entity from "./Entity";
import Genes from "./Genes";
import Food from "./Food";
import Tree from "./Tree";
import World from "./World";

import { GUI } from "./GUI";
import { OrbitControls } from './OrbitControls.js';

class Evolution extends Component
{
  constructor()
  {
    super();
    this.time = new YUKA.Time();
    this.world = new World(500, 500)

    //Number of Trees and Food
    this.numTrees = 75;
    this.numFood = 50;

    //How many random entities are added each cycle
    this.noise = 0;

    //Current Cycle/Generation
    this.cycle = 0;

    //Defaults for the Genetics that the user can edit
    this.Speed = 10;
    this.SenseArea = 50;
    this.Smarts = 10;
    this.WanderDistance = 50;
    this.MutationRate = 0.10;
  }
  componentDidMount()
  {
    const width = this.mount.clientWidth
    const height = this.mount.clientHeight
    //ADD SCENE
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color( 0xcccccc );
    this.scene.fog = new THREE.FogExp2(0xcccccc, 0.003);

    //Create the rectangle visualising the world
    const recGeo = new THREE.BoxBufferGeometry(
      this.world.worldSize[0][1]-this.world.worldSize[0][0],
      -30,
      this.world.worldSize[1][1]-this.world.worldSize[1][0]);
    const recMat = new THREE.MeshBasicMaterial({color: 0x5aa00a})
    this.rec = new THREE.Mesh(recGeo, recMat);
    this.scene.add(this.rec);

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

    this.trees = new Array(this.numTrees);
    this.food = new Array(this.numFood);
    this.entities = [];

    //Generate Trees and food pickups
    for(let i = 0; i < this.numTrees; i++)
    {
      //Add the meshs to the scene
      // this.treeGeo.computeBoundingSphere();
      // this.trees[i] = new Tree(this.treeGeo, this.treeMat, this.world);
      // this.trees[i].mesh.boundingRadius = this.treeGeo.boundingSphere.radius;
      // this.scene.add(this.trees[i].mesh);
      // //Add them as entities
      // this.trees[i].setRenderComponent(this.trees[i].mesh, this.sync)
      // this.trees[i].boundingRadius = this.treeGeo.boundingSphere.radius;
      // this.entityManager.add(this.trees[i]);
    }

    //Generate Food
    for(let i = 0; i < this.numFood; i++)
    {
      this.food[i] = new Food(this.world);
      this.scene.add(this.food[i].mesh);

      this.food[i].setRenderComponent(this.food[i].mesh, this.sync);
      this.entityManager.add(this.food[i]);
    }
    //Make the entities
    for(let i = 0; i < 10; ++i)
    {
      this.addEntity();
    }




    //Controls for orbit
    this.controls = new OrbitControls(this.camera,this.renderer.domElement);
    this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
		this.controls.dampingFactor = 0.05;
		this.controls.screenSpacePanning = false;
		this.controls.minDistance = 25;
		this.controls.maxDistance = 250;
		this.controls.maxPolarAngle = Math.PI / 2;

    this.gui = new GUI();
		this.gui.add(this, 'numFood', 1, 500, 1);
    this.gui.add(this, 'noise', 0, 25, 1);
    this.gui.add(this, 'Speed', 0, 50, 1);
    this.gui.add(this, 'SenseArea', 30, 100, 1);
    this.gui.add(this, 'Smarts', 0, 100, 1);
    this.gui.add(this, 'WanderDistance', 10, 100, 1);
    this.gui.add(this, 'MutationRate', 0.01, 1, 0.01);
		this.gui.open();
    console.log(this.gui);
    this.start()
  }
  addEntity(genes)
  {
    let gene;
    if(genes == null)
    {
      gene = new Genes(this.Speed, this.SenseArea, this.Smarts, this.WanderDistance, this.MutationRate);
    }
    const entity = new Entity(this.food, this.trees, genes == null ? gene : genes, this.world);
    this.entities.push(entity);
    this.scene.add(entity.mesh);
    entity.setRenderComponent(entity.mesh, this.sync);
    this.entityManager.add(entity);
  }
  componentWillUnmount()
  {
    this.gui.close();
    this.stop()
    this.mount.removeChild(this.renderer.domElement)
  }
  start = () =>
  {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate)
    }
  }
  stop = () =>
  {
    cancelAnimationFrame(this.frameId)
  }
  sync( entity, renderComponent)
  {
    renderComponent.matrix.copy(entity.worldMatrix);
  }
  animate = () =>
  {
     this.frameId = window.requestAnimationFrame(this.animate);
     const delta = this.time.update().getDelta();
     this.entityManager.update(delta);
     this.controls.update();
     this.renderScene();
     this.checkForFlags();
     this.forceUpdate();
     this.calculateStats();
  }
  renderScene = () =>
  {
    this.renderer.render(this.scene, this.camera)
  }
  reset()
  {
    //Increments the cycle
    this.cycle++;


    //Clears all the entities and reproduces all those that were succesful
    //This also keeps those entities that made surived alive
    let len = this.entities.length;
    for(let i = 0; i < len; ++i)
    {
      this.entities[i].dead = true;
      if(this.entities[i].reproduce)
      {
        let genes = this.entities[i].genes;
        this.addEntity(genes);
        this.addEntity(genes);
      }
      else if(this.entities[i].survived)
      {
        let genes = this.entities[i].genes;
        this.addEntity(genes);
      }
    }

    //Picks up the food to eliminate fruit flies
    for(let i = 0; i < this.food.length; ++i)
    {
      this.food[i].eaten = true;
    }

    //Add noise to the population
    for(let i = 0; i < this.noise; ++i)
    {
      this.addEntity();
    }

    //Replace the food
    for(let i = 0; i < this.numFood; ++i)
    {
      this.food.push(new Food(this.world));
      this.scene.add(this.food[this.food.length-1].mesh);

      this.food[this.food.length-1].setRenderComponent(this.food[this.food.length-1].mesh, this.sync);
      this.entityManager.add(this.food[this.food.length-1]);
    }
  }
  //This method is essentiall the garbage collector
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
      }
    }
    if(this.roundIsFinished())
    {
      this.reset();
    }
  }
  roundIsFinished()
  {
    for(let i = 0; i < this.entities.length; ++i)
    {
      if(!this.entities[i].survived)
      {
        return false;
      }
    }
    if(this.entities.length == 0)
      return false;
    return true;
  }
  calculateStats()
  {
    let sumSpeed = 0;
    let sumSense = 0;
    let sumExpense = 0;
    let sumSmarts = 0;
    let countReproduce = 0;
    let countSurvived = 0;
    this.stats = {}
    for(let i = 0;i < this.entities.length; ++i)
    {
      sumSpeed += this.entities[i].genes.getGenes().speed;
      sumSense += this.entities[i].genes.getGenes().senseArea;
      sumExpense += this.entities[i].genes.getGenes().energyExpense;
      sumSmarts += this.entities[i].genes.getGenes().smarts;
      if(this.entities[i].survived)
      {
          if(this.entities[i].reproduce)
          {
            ++countReproduce;
          }
          ++countSurvived;
      }
    }
    this.stats.speedAvg = sumSpeed/this.entities.length;
    this.stats.senseAvg = sumSense/this.entities.length;
    this.stats.smarts = sumSmarts/this.entities.length;
    this.stats.expenseAvg = sumExpense/this.entities.length;
    this.stats.survived = countSurvived;
    this.stats.reproduced = countReproduce;
  }
  render()
  {
      return(

        <div
          style={{ width: window.screen.width, height: window.screen.height-200 }}
          ref={(mount) => { this.mount = mount }}
        >
        <label style={{paddingRight: '40px'}}>Cycle: {this.cycle}</label>
        <label style={{paddingRight: '40px'}}>Entities Remaining: {this.entities !== undefined ? this.entities.length : ""}</label>
        <label style={{paddingRight: '40px'}}>Survived: {this.stats !== undefined ? this.stats.survived : ""}</label>
        <label style={{paddingRight: '40px'}}>Reproduced: {this.stats !== undefined ? this.stats.reproduced : ""}</label>
        <br/>
        <label style={{paddingRight: '20px'}}>Average Speed: {this.stats !== undefined ? this.stats.speedAvg.toFixed(2) : ""}</label>
        <label style={{paddingRight: '20px'}}>Average Sense: {this.stats !== undefined ? this.stats.senseAvg.toFixed(2) : ""}</label>
        <label style={{paddingRight: '20px'}}>Average Smarts: {this.stats !== undefined ? this.stats.smarts.toFixed(2) : ""}</label>
        <label style={{paddingRight: '20px'}}>Average Expense: {this.stats !== undefined ? this.stats.expenseAvg.toFixed(2) : ""}</label>
      </div>
      )
    }

}
export default Evolution;
