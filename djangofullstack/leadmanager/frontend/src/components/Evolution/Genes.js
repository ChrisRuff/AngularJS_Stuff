export default class Genes
{
  constructor(speed, senseArea,smarts, wanderDistance, mutateRate)
  {
    this.speed = speed;
    this.senseArea = senseArea;
    this.smarts = smarts/10;
    // this.wanderDistance = wanderDistance;
    // this.mutateRate = mutateRate;
    this.mutAmount = 5;
    this.genes = {speed: speed/10,
                  senseArea: senseArea,
                  smarts: smarts/10,
                  wanderDistance: wanderDistance,
                  mutateRate: mutateRate,
                  energyExpense: (speed) * (speed)+ (senseArea/30) }
    this.makeGeneMap();
    this.length = this.geneMap.length;
  }
  getGenes()
  {
    return this.genes;
  }
  //This function is called to adjust the weight since +1 to speed results in larger shift
  //Than +1 to senseArea
  updateGenes()
  {
    this.genes.speed = this.speed / 10;
    this.genes.senseArea = this.senseArea;
    this.genes.smarts = this.smarts;
    this.genes.energyExpense = 1.5*(this.genes.speed) + (this.genes.senseArea/10);
  }
  makeGeneMap()
  {
    let count = 0;
    this.geneMap = []
    // for(let gene in this.genes)
    // {
    //   this.geneMap[count] = gene;
    //   ++count;
    // }
    this.geneMap[0] = "speed";
    this.geneMap[1] = "senseArea";
    this.geneMap[2] = "smarts";
  }
  mutate()
  {
    let mutate = Math.random() < this.genes.mutateRate;
    if(mutate)
    {
      let mutGene = Math.round(Math.random() * (this.length -1));
      let mutNum = Math.random() * (this.mutAmount + this.mutAmount) - this.mutAmount;
      switch(mutGene)
      {
        case 0:
          this.speed += mutNum;
          if(this.speed <= 10)
            this.speed = 10;
          break;
        case 1:
          this.senseArea += mutNum;
          if(this.senseArea <= 30)
            this.senseArea = 30;
          break;
        case 2:
          this.smarts += mutNum;
          if(this.smarts <= 5)
            this.smarts = 5;
          break;
      }
      this.updateGenes();
    }
  }
}
