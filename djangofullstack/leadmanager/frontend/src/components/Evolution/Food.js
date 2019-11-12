import {GameEntity} from "yuka";
import * as THREE from "three";
export default class Food extends GameEntity
{
  constructor(world)
  {
    super();

    this.mat = new THREE.MeshBasicMaterial({color: 0x0000ff})
    this.geo = new THREE.BoxBufferGeometry( 5, 5, 5 );
    this.mesh = new THREE.Mesh(this.geo, this.mat);
    //Padding is the distance the food will spawn from the walls
    const padding = 100;
    this.mesh.position.x = Math.random() * ((world.worldSize[0][1] - padding) - (world.worldSize[0][0]+padding)) + world.worldSize[0][0]+padding;
    this.mesh.position.z = Math.random() * ((world.worldSize[1][1]-padding) - (world.worldSize[1][0]+padding)) + world.worldSize[1][0]+padding;
    this.mesh.position.y = 0;
    this.mesh.updateMatrix();
    this.position.copy(this.mesh.position);
    this.eaten = false;
  }

  update(delta)
  {
    if(this.eaten)
    {
      this.manager.remove(this);
    }
    super.update(delta);
    this.deltaTime = delta;
  }

  eat()
  {
    this.eaten = true;
  }
}
