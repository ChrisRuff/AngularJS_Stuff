
export default class World
{
  constructor(x, y)
  {
    this.worldSize = new Array(2);
    this.x = x;
    this.y = y;
    this.worldSize[0] = [-x/2, x/2];
    this.worldSize[1] = [-y/2, y/2];
    this.perimeter = [];
    this.calculatePerimeter();
  }
  //Creates a 2D array of all the points along the outside of the map
  calculatePerimeter()
  {
    for(let x = this.worldSize[0][0]; x < this.worldSize[0][1]; ++x)
    {
      this.perimeter.push([x,this.y/2-30]);
      this.perimeter.push([x,-this.y/2+30]);
    }
    for(let y = this.worldSize[1][0]; y < this.worldSize[1][1]; ++y)
    {
      this.perimeter.push([this.x/2-30, y]);
      this.perimeter.push([-this.x/2+30, y]);
    }
  }
}
