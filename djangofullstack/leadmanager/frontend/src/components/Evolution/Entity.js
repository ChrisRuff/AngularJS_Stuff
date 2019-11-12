import {Vehicle, ObstacleAvoidanceBehavior} from "yuka";
import * as THREE from "three";
import Genes from "./Genes";
export default class Entity extends Vehicle
{
  constructor(foodMap, obstacles, genes, world)
  {
    super();
    this.world = world;

    //Represent the genes of the entity
    if(genes == null)
    {
      this.genes = new Genes(1, 50, 50, 0.5);
    }
    else
    {
      this.genes = genes;
    }
    //Mutate the genes (only actual changes the genes a percentage of the time)
    this.genes.mutate();
    this.genesSet = this.genes.getGenes();

    //Encode a color and size based on the genes
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    var rgbToHex = function (rgb) {
      var hex = Number(rgb).toString(16);
      if (hex.length < 2) {
           hex = "0" + hex;
      }
      return hex;
    };
    var fullColorHex = function(r,g,b) {
      var red = rgbToHex(r);
      var green = rgbToHex(g);
      var blue = rgbToHex(b);
      return "#"+red+green+blue;
    };

    let color = fullColorHex((20 * this.genesSet.speed),
                               100,
                               100);
    let size = new THREE.Vector3(10,
                                (this.genesSet.senseArea-30).toFixed(2),
                                10)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //Create the meshs and geometry for the entity
    this.mat = new THREE.MeshBasicMaterial({color: color});
    this.geo = new THREE.BoxBufferGeometry(size.x,size.y,size.z);
    this.geo.computeBoundingSphere();
    this.mesh = new THREE.Mesh(this.geo, this.mat);
    this.boundingRadius = this.geo.boundingSphere.radius;

    //Setup variables used for later
    this.dead = false;
    this.hasEaten = false;
    this.reproduce = false;
    this.survived = false;
    this.energy =  1000;
    this.obstacles = obstacles;
    this.foodMap = foodMap

    //Place the entity randomly on the map around the perimeter
    let place = Math.floor(Math.random() * world.perimeter.length);
    this.spawn = world.perimeter[place];
    this.mesh.position.x = world.perimeter[place][0];
    this.mesh.position.z = world.perimeter[place][1];
    this.mesh.position.y = 0;

    //Create an avoidance behavior
    this.ObstacleAvoidanceBehavior = new ObstacleAvoidanceBehavior(obstacles);
    this.steering.add(this.ObstacleAvoidanceBehavior);
  }
  update(delta)
  {
    this.position = this.mesh.position;
    if(!this.dead && !this.survived)
    {
      if(this.target != null)
      {
        this.move(this.target.position,this.target);
      }
      else
      {
          this.findNextFood();
      }
      this.energy -= this.genesSet.energyExpense;
      if(this.energy <= 0)
      {
        this.dead = true;
        this.manager.remove(this);
      }
      super.update(delta);
      this.deltaTime = delta;
    }
  }
  move(aim, target=null)
  {
    if(aim.x >= this.world.worldSize[0][1]
       || aim.x <= this.world.worldSize[0][0]
       || aim.z >= this.world.worldSize[1][1]
       || aim.z <= this.world.worldSize[1][0])
    {
      this.point = null;
      return;
    }
    if(aim.x > this.mesh.position.x)
      this.mesh.position.x += this.genesSet.speed;
    else
      this.mesh.position.x -= this.genesSet.speed;
    if(aim.z > this.mesh.position.z)
      this.mesh.position.z += this.genesSet.speed;
    else
      this.mesh.position.z -= this.genesSet.speed;
    if(target != null)
    {
      let locationDiff = [Math.abs(aim.x - this.mesh.position.x), Math.abs(aim.z- this.mesh.position.z)]
      if(locationDiff[0] < 10 && locationDiff[1] < 10)
      {
        this.eat(target);
      }
    }
  }
  eat(target)
  {
    if(!target.eaten)
    {
      target.eat();
      if(this.hasEaten)
        this.reproduce = true;
      this.hasEaten = true;
      console.log("ate")
      this.energy += 1000;
      this.target = null;
    }
  }
  findNextFood()
  {
    const spawnLocation = new THREE.Vector3(this.spawn[0], 0, this.spawn[1]);
    if(!this.reproduce)
    {
      for(let i = 0; i < this.foodMap.length; ++i)
      {
        let foodLoc = this.foodMap[i].position;
        let foodRelative = [Math.abs(foodLoc.x - this.mesh.position.x),
                            Math.abs(foodLoc.z - this.mesh.position.z)];

        if(foodRelative[0] < this.genesSet.senseArea && foodRelative[1] < this.genesSet.senseArea)
        {
          this.target = this.foodMap[i];
          return;
        }
      }
      if(!this.hasEaten)
      {
        this.wander();
      }
      else
      {
        if(this.energy <= 500)
        {
          this.move(spawnLocation);
        }
        else
        {
          this.wander();
        }
      }
    }
    else
    {
      this.move(spawnLocation);
    }
    if(this.hasEaten)
    {
      const locationDiff = [Math.abs(spawnLocation.x - this.mesh.position.x),
                            Math.abs(spawnLocation.z - this.mesh.position.z)];
      if(locationDiff[0] < 10 && locationDiff[1] < 10)
      {
        this.survived = true;
      }
    }
  }
  wander()
  {
    if(this.point == null)
      this.point = GenRandPoint(this.mesh, this.genesSet.wanderDistance);

    let locationDiff = [Math.abs(this.point.x - this.mesh.position.x),
                        Math.abs(this.point.z- this.mesh.position.z)]
    if(locationDiff[0] < 5 && locationDiff[1] < 5)
    {
      this.point = null;
    }
    else
    {
      this.move(this.point);
    }


    function GenRandPoint(mesh, wanderDistance){
      let pivot = mesh.position;
      let point = new THREE.Vector3(pivot.x + Math.random()*(wanderDistance + wanderDistance) - wanderDistance,
                                     pivot.y,
                                     pivot.z + Math.random()*(wanderDistance + wanderDistance) - wanderDistance);
      return point;
    }
  }

}
