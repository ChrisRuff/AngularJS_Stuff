import React from "react"
import Rectangle from "react-rectangle";
import itemStyle from "./ArrayStyle.css"

class ArraySorter extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            data: this.listOfRectangles(5, 600, 5)
        };
        this.count = 0;
    }
    render()
    {
        return(
        <div>
            <ul>
                {this.state.data}
            </ul>
            <button onClick={() => this.plus()}>Add a Rectangle</button>
            <button onClick={() => this.selectionSort()}>Selection Sort</button>
            <button onClick={() => this.removeFirst()}>Remove first</button>
        </div>);
    }
    plus()
    {
        this.state.data.push(this.listOfRectangles(5,600,1)[0]);
        this.update();
    }
    update()
    {
        this.setState({
            data: this.state.data
        });
    }
    selectionSort()
    {

        let len = this.state.data.length;
        console.log("height: " + this.state.data[0].key + "\nLength: " + len);
        for (let i = 0; i < len; i++) {
            let min = i;

            for (let j = i + 1; j < len; j++) {
                if (this.state.data[min].key > this.state.data[j].key) {
                    min = j;
                }
            }

            if (min !== i) {
                let tmp = this.state.data[i];
                this.state.data[i] = this.state.data[min];
                this.state.data[min] = tmp;
                this.update();

            }




        }

    }
    sleep(milliseconds)
    {
        let start = new Date().getTime();
        for (let i = 0; i < 1e7; i++)
        {
            if ((new Date().getTime() - start) > milliseconds){
                break;
            }
        }
    }
    removeFirst()
    {
        this.state.data[0] = this.state.data[this.state.data.length-1];
        this.state.data.pop();
        this.update();
    }

    change(x, y)
    {
        let tmp = this.state.data[x];
        this.state.data[x] = this.state.data[y];
        this.state.data[y] = tmp;
    }

    listOfRectangles(x, y, num)
    {
        let array = [];
        for(let i = 0; i < num; i++)
        {
            let height = this.randomNum(0, y);
            array.push(
                <li key={height} style={{float: "Left", background: '#9e9e9e', width: x, height: height }}>{this.rectangle(x,height)}</li>
            );
        }
        return (array);
    }
    rectangle(x, y)
    {
        return (
            <Rectangle aspectRatio={[5, 3]}>
                <div style={{ background: '#607d8b', width: '100%', height: '100%' }} />
            </Rectangle>
        );
    }
    randomNum(min, max)
    {
        return (Math.random() * max) + min;
    }
}

export default ArraySorter;