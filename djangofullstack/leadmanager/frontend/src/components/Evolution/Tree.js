import {GameEntity} from "yuka";
import * as THREE from "three";
export default class Tree extends GameEntity
{
  constructor(geo, mat, world)
  {
    super();

    this.mesh = new THREE.Mesh(geo, mat);
    console.log(world[0]);
    this.mesh.position.x = Math.random() * (world.worldSize[0][1] - world.worldSize[0][0]) + world.worldSize[0][0];
    this.mesh.position.z = Math.random() * (world.worldSize[1][1] - world.worldSize[1][0]) + world.worldSize[1][0];
    this.mesh.position.y = 0;
    this.mesh.updateMatrix();
    this.position.copy(this.mesh.position);
  }
  update(delta)
  {
    super.update(delta);
    this.deltaTime = delta;
  }
}
