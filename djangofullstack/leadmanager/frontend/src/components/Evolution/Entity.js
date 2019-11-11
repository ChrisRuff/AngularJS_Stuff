import {Vehicle, ObstacleAvoidanceBehavior} from "yuka";
import * as THREE from "three";
import Genes from "./Genes";
export default class Entity extends Vehicle
{
  constructor(foodMap, obstacles, genes)
  {
    super();
    //Represent the genes of the entity
    if(genes == null)
    {
      this.genes = new Genes(0.5, 50, 50, 0.15);
    }
    else {
      this.genes = genes;
    }
    this.genes.mutate();
    this.genesSet = this.genes.getGenes();
    //Encode a color based on the genes
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
    const color = fullColorHex(255-20*Math.round(this.genesSet.speed),
                               20*Math.round(this.genesSet.speed),
                               20*Math.round(this.genesSet.speed));
    const size = new THREE.Vector3(.125*Math.round(this.genesSet.senseArea),
                                   .250*Math.round(this.genesSet.senseArea),
                                   .125*Math.round(this.genesSet.senseArea))
    console.log(color);

    //Create the meshs and geometry for the entity
    this.mat = new THREE.MeshBasicMaterial({color: color});
    this.geo = new THREE.BoxBufferGeometry(size.x,size.y,size.z);
    this.geo.computeBoundingSphere();
    this.mesh = new THREE.Mesh(this.geo, this.mat);
    this.boundingRadius = this.geo.boundingSphere.radius;

    //Setup variables used for later
    this.dead = false;
    this.energy =  1000;
    this.obstacles = obstacles;
    this.foodMap = foodMap

    //Place the entity randomly on the map
    this.mesh.position.x = Math.random() * 1600 - 800;
    this.mesh.position.z = Math.random() * 1600 - 800;
    this.mesh.position.y = 0;

    //Create an avoidance behavior
    this.ObstacleAvoidanceBehavior = new ObstacleAvoidanceBehavior(obstacles);
    this.steering.add(this.ObstacleAvoidanceBehavior);
  }

  update(delta)
  {
    this.position = this.mesh.position;
    if(!this.dead)
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
    this.energy += 1000;
    target.eat();
    this.target = null;
  }
  findNextFood()
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
    this.wander();
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
