export default class Genes
{
  constructor(speed, senseArea, wanderDistance, mutateRate)
  {
    // this.speed = speed;
    // this.senseArea = senseArea;
    // this.wanderDistance = wanderDistance;
    // this.mutateRate = mutateRate;
    this.mutAmount = 5;
    this.energyExpense = (speed+1) * (speed)+ (senseArea/15);
    this.genes = {speed: speed,
                  senseArea: senseArea,
                  wanderDistance: wanderDistance,
                  mutateRate: mutateRate,
                  energyExpense: this.energyExpense}
    this.makeGeneMap();
    this.length = this.geneMap.length;
  }
  getGenes()
  {
    return this.genes;
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
  }
  mutate()
  {
    let mutate = Math.random() < this.genes.mutateRate;
    if(mutate)
    {
      let mutGene = Math.round(Math.random() * (this.length -1));
      let mutNum = Math.random() * (this.mutAmount + this.mutAmount) - this.mutAmount;
      this.genes[this.geneMap[mutGene]] += mutNum;
      this.genes[this.geneMap[mutGene]] = Math.abs(this.genes[this.geneMap[mutGene]]);
      this.genes.energyExpense = (this.genes.speed+1) * (this.genes.speed)+ (this.genes.senseArea/15);
      console.log(this.genes);
    }
  }
}
