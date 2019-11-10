import React, { Component } from "react";
import * as THREE from "three";
import { OrbitControls } from './OrbitControls.js';

class Evolution extends Component
{
componentDidMount(){
    const width = this.mount.clientWidth
    const height = this.mount.clientHeight
    //ADD SCENE
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color( 0xcccccc );
    this.scene.fog = new THREE.FogExp2(0xcccccc, 0.002);
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

    //ADD TREES
    const geometry = new THREE.CylinderBufferGeometry(0, 10, 30, 4, 1);
    const material = new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true });
    this.trees = [];
    for(let i = 0; i < 500; i++)
    {
      this.trees[i] = new THREE.Mesh(geometry, material);
      this.trees[i].position.x = Math.random() * 1600 - 800;
      this.trees[i].position.y = 0;
      this.trees[i].position.z = Math.random() * 1600 -  800;
      this.trees[i].updateMatrix();
      this.trees[i].matrixAutoUpdate = false;
      this.scene.add(this.trees[i]);
    }
    const entityMat = new THREE.MeshBasicMaterial({color: 0xffffff})
    const entityGeo = new THREE.BoxBufferGeometry( 5, 5, 5 );

    this.entity = new THREE.Mesh(entityGeo, entityMat)
    this.scene.add(this.entity)

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





animate = () => {
   this.controls.update();
   
   this.renderScene();
   this.frameId = window.requestAnimationFrame(this.animate);
 }
renderScene = () => {
  this.renderer.render(this.scene, this.camera)
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
