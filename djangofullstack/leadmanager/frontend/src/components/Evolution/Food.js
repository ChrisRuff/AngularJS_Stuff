import {GameEntity} from "yuka";
import * as THREE from "three";
export default class Food extends GameEntity
{
  constructor()
  {
    super();

    this.mat = new THREE.MeshBasicMaterial({color: 0x0000ff})
    this.geo = new THREE.BoxBufferGeometry( 5, 5, 5 );
    this.mesh = new THREE.Mesh(this.geo, this.mat);
    this.mesh.position.x = Math.random() * 1600 - 800;
    this.mesh.position.z = Math.random() * 1600 - 800;
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
