import {GameEntity} from "yuka";
import * as THREE from "three";
export default class Tree extends GameEntity
{
  constructor(geo, mat)
  {
    super();

    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.position.x = Math.random() * 1600 - 800;
    this.mesh.position.z = Math.random() * 1600 - 800;
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
