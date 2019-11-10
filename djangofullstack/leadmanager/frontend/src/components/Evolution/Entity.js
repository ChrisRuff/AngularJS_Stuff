import {Vehicle, ArriveBehavior} from "yuka";

class Entity extends Vehicle
{
  constructor(obstacles)
  {
    super();
    this.maxTurnRate = Math.PI * 0.5;
    this.maxSpeed = 5;

    const arriveBehaviour = new ArriveBehavior();
    arriveBehaviour.deceleration = 1.5;
    this.steering.add(arriveBehaviour);
    //Obstacle Avoidance
    const obstacleAvoidance = new YUKA.ObstacleAvoidanceBehavior(obstacles);
    this.steering.add(obstacleAvoidance);

    this.energy = 100;
  }
  update(delta)
  {
    super.update(delta);
    this.deltaTime = delta;
  }
}

export {Entity};
