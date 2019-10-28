import React from "react"
import "./ArrayStyle.css";

class ArraySorter extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            data: this.listOfRectangles(5, 600, 5),
            num: 5
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
            <div name="manipulations" style={{display: "block", float: "left"}}>
                <button className="button" disabled={this.editable?false:true} onClick={() => this.selectionSort()}>Selection Sort</button>
                <button className="button" disabled={this.editable?false:true} onClick={() => this.removeFirst()}>Remove first</button>
                <button className="button" disabled={this.editable?false:true} onClick={() => this.clear()}>Clear</button>
            </div>
            <br/><br/><br/><br/><br/>
            <div style={{display: "block", float: "left"}}>
                <button className="button" onClick={() => this.plus()}>Add a Rectangle</button>

                <button className="button" onClick={() => this.plus(this.state.num)}>Add __ Rectangles</button>
                <input placeholder="5" name="num" value={this.state.num} onChange={evt => this.updateNum(evt)} className="button" type="number"/>
            </div>

        </div>);
    }
    updateNum(evt)
    {
        this.setState({
            num: evt.target.value
        });
    }
    plus(num=1)
    {
        for(let i = 0; i < num; i++)
            this.state.data.push(this.listOfRectangles(5,600,1)[0]);
        this.update();
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
    selectionSort()
    {
        this.timer = setInterval(() => this.selectTick(), 500);
    }
    selectTick()
    {
        let len = this.state.data.length;
        let abort = false;
        for (let i = 0; i < len && !abort; i++) {
            let min = i;
            for (let j = i + 1; j < len; j++)
            {
                if (this.state.data[i].props.height > this.state.data[j].props.height)
                {
                    min = j;
                    abort = true;
                }
            }
            if(i !== min)
                this.change(i, min);
            if(i >= len-1)
                clearInterval(this.timer);
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
        let len = this.state.data.length;
        for(let i = 0; i < len-1; i++)
            this.state.data[i] = this.state.data[i+1];
        this.state.data.pop();
        this.update();
    }
    clear()
    {
        this.setState({data: []});
        this.editable = false;
    }

    change(x, y)
    {
        let tmp = this.state.data[x];
        this.state.data[x] = this.state.data[y];
        this.state.data[y] = tmp;
        this.update()

    }

    listOfRectangles(x, y, num)
    {
        let array = [];
        for(let i = 0; i < num; i++)
        {
            let height = this.randomNum(0, y);
            array.push(
                <li height={height}
                    className="element"
                    style={{width: x, height: height}}
                >
                    <span className="height-text">{height}</span>
                </li>
            );
        }
        return (array);
    }
    randomNum(min, max)
    {
        return Math.floor((Math.random() * max) + min);
    }
}

export default ArraySorter;