import React from "react";
import Element from "./Element.js";
import Slider from "./Slider.js";
import "./ArrayStyle.css";
class ArraySorter extends React.Component
{
    constructor(props)
    {
        super(props);
        this.myRefs = [];
        this.state = {
            rectangles: 100,
            data: this.listOfRectangles(5, 600, 100),
            num: 15,
            speed: 10
        };
        this.editable = true;
        this.timer = null;

    }
    render()
    {
        return(
        <div>
            <ul className="arrayContainer">
                {this.state.data}
            </ul>
            <Slider
                 change={(num)=>
                 {
                     this.myRefs = [];
                     this.setState(
                     {data: this.listOfRectangles(5,600, num),
                           rectangles: num})
                     console.log(this.state.data);
                 }}
            />
            <div name="manipulations" style={{display: "block", float: "left"}}>
                <button
                    className="button"
                    disabled={this.editable?false:true}
                    onClick={() => this.selectionSort()}>
                    Selection Sort
                </button>
                <button
                    className="button"
                    disabled={this.editable?false:true}
                    onClick={() => this.bubbleSort()}>
                    Bubble Sort
                </button>
                <button
                    className="button"
                    disabled={this.editable?false:true}
                    onClick={() => this.insertionSort()}>
                    Insertion Sort
                </button>
                <button
                    className="button"
                    disabled={this.editable?false:true}
                    onClick={() => this.quickSortControl()}>
                    Quick Sort
                </button>
                <Slider
                    change={(speed)=>this.setState({speed: 250-speed})}
                />
            </div>
        </div>);
    }
    update()
    {
        this.setState({
            data: this.state.data
        });
        if(this.state.data.length < 1)
            this.editable = false;
        else
            this.editable = true;
    }

    async selectionSort()
    {
        for(let i = 0; i < this.state.data.length; ++i)
            await this.selectTick(i);
    }
    async selectTick(i)
    {
        let len = this.state.data.length;
        let abort = false;
        let min = i;
        for(let k = 0; k < i; k++)
        {
            this.myRefs[k].deselect();
        }
        for(let k = 0; k < len; k++)
        {
            this.myRefs[k].unhighlight();
        }
        this.myRefs[i].select();
        for (let j = i + 1; j < len; j++)
        {
            await this.sleep(this.state.speed * 5);
            this.myRefs[j].highlight();
            if (this.state.data[min].props.height > this.state.data[j].props.height)
            {
                min = j;
                abort = true;
                for(let q = i+1; q < len; q++)
                    this.myRefs[q].unchose();
                this.myRefs[j].chose();
            }
        }
        if(i != min)
        {
            this.change(i, min);
            this.myRefs[min].unchose();
        }
        if(i >= len-1)
        {
            this.myRefs[i].deselect();
            clearInterval(this.timer);
        }
    }

    async bubbleSort()
    {
        let len = this.state.data.length;
        for(let i = 0; i < len; i++)
            await this.bubbleTick(i);
        for(let k = 0; k < len; k++)
        {
            this.myRefs[k].deselect();
            this.myRefs[k].unhighlight();
        }

    }
    async bubbleTick(i)
    {
        let len = this.state.data.length;
        for(let j=0; j < len-1; j++)
        {
            for(let k = 0; k < len; k++)
                this.myRefs[k].deselect();
            this.myRefs[j+1].select();

            if(this.state.data[j].props.height > this.state.data[j+1].props.height)
            {
                this.change(j, j+1);

                await this.sleep(this.state.speed * 25);
            }
        }
        this.myRefs[len-i-1].highlight();
    }

    async insertionSort()
    {
        let len = this.state.data.length;
        for(let i = 1; i < len; i++)
            await this.insertionTick(i);
        for(let k = 0; k < len; k++)
        {
            this.myRefs[k].deselect();
            this.myRefs[k].unhighlight();
            this.myRefs[k].unchose();
        }
    }
    async insertionTick(i)
    {
        let key = this.state.data[i];
        let keyVal = this.state.data[i].props.height;
        this.myRefs[i].select();
        let j = i-1;
        for(; j>=0; j--)
        {
            this.myRefs[j].chose();
            await this.sleep(this.state.speed * 20);
            if(this.state.data[j].props.height > keyVal)
            {
                this.myRefs[j].highlight();
                await this.sleep(this.state.speed * 5);
                this.state.data[j + 1] = this.state.data[j];
            }
            else
            {
                break;
            }
        }
        for(let k = 0; k < this.state.data.length; k++)
        {
            this.myRefs[k].unhighlight();
            this.myRefs[k].unchose();
        }
        this.state.data[j+1] = key;

        this.update();
        for (let k = 0; k < this.state.data.length; k++) {
            if (j + 1 !== k)
                this.myRefs[k].deselect();
        }
    }

    async quickSortControl()
    {
        await this.quickSort(0, this.state.data.length-1);
    }

    async quickSort(left, right) {
        let index;
        if (this.state.data.length > 1)
        {
            index = await this.partition(left, right);
            await this.sleep(this.state.speed * 25);
            if(left < index-1)
            {
                for(let k = 0; k < this.state.data.length; k++)
                {
                    this.myRefs[k].deselect();
                    this.myRefs[k].unhighlight();
                    this.myRefs[k].unchose();
                }
                await this.quickSort(left,index-1);
            }
            if(index < right)
            {
                for(let k = 0; k < this.state.data.length; k++)
                {
                    this.myRefs[k].deselect();
                    this.myRefs[k].unhighlight();
                    this.myRefs[k].unchose();
                }
                await this.quickSort(index, right);
            }
        }
        //this.update();
    }


    async partition(left, right)
    {
        let pivot = this.state.data[Math.floor((right + left)/2)].props.height,
            i     = left,
            j     = right;

        while(i <= j)
        {
            this.myRefs[Math.floor((right+left)/2)].select();
            await this.sleep(this.state.speed * 20);
            while(this.state.data[i].props.height < pivot)
            {
                this.myRefs[i].highlight();
                i++;
                await this.sleep(this.state.speed * 20);
            }
            while(this.state.data[j].props.height > pivot)
            {
                this.myRefs[j].highlight();
                j--;
                await this.sleep(this.state.speed * 20);
            }
            if(i <= j)
            {
                this.myRefs[i].chose();
                this.myRefs[j].chose();
                this.change(i, j);
                i++;
                j--;

                await this.sleep(this.state.speed * 25);
            }
            for(let k = 0; k < this.state.data.length; k++)
            {
                this.myRefs[k].unhighlight();
                this.myRefs[k].unchose();
            }
        }
        return i;
    }
    plus(num=1)
    {
        for(let i = 0; i < num; i++)
            this.state.data.push(this.listOfRectangles(5,600,1)[0]);
        this.update();
    }
    sleep (time)
    {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
    removeFirst()
    {
        let len = this.state.data.length;
        for(let i = 0; i < len-1; i++)
        {
            this.state.data[i] = this.state.data[i+1];
            this.myRefs[i] = this.myRefs[i+1];
        }

        this.state.data.pop();
        this.myRefs.pop();
        this.update();
    }
    clear()
    {
        this.setState({data: []});
        this.editable = false;
        this.myRefs = [];
    }
    change(x, y)
    {
        let el = this.state.data[x];
        this.state.data[x] = this.state.data[y];
        this.state.data[y] = el;
        this.update();
    }
    listOfRectangles(x, y, num)
    {
        let array = [];
        for(let i = 0; i < num; i++)
        {
            let height = this.randomNum(0, y);
            array.push(
                <Element
                    ref={(ref)=>{if(ref!=null && !this.myRefs.includes(ref)){this.myRefs.push(ref)}}}
                    height={height}
                    x={x}
                />
            );
        }
        console.log(this.myRefs);
        return (array);
    }
    randomNum(min, max)
    {
        return Math.floor((Math.random() * max) + min);
    }
}

export default ArraySorter;
