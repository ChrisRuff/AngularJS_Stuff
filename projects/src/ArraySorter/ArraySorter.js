import React from "react"
import Rectangle from "react-rectangle";
import {useState} from "react";
import itemStyle from "./ArrayStyle.css"
function ArraySorter()
{
    const [data, setData] = useState(new ArrayModel());

    function plus(data) {
        data.data.push(listOfRectangles(0, 600, 1));
        setData(data);
    }


    return(
        <div>
            <ul>
                {data.data}
            </ul>
            <button onClick={() => plus(data)}>Add a Rectangle</button>
        </div>

    );
}
class ArrayModel extends React.Component
{
    constructor()
    {
        super();
        this.data = listOfRectangles(5, 600, 10);
    }
    render()
    {
        return (this.data);
    }

    change(x, y)
    {
        let tmp = this.data[x];
        this.data[x] = this.data[y];
        this.data[y] = tmp;
    }
}
function listOfRectangles(x, y, num)
{
    let array = [];
    for(let i = 0; i < num; i++)
    {
        let height = randomNum(0, y);
        array.push(
            <li style={{float: "Left", background: '#9e9e9e', width: x, height: height }}>{rectangle(x,height)}</li>
        );
    }
    return (array);



}
function rectangle(x, y)
{
    return (
        <Rectangle aspectRatio={[5, 3]}>
            <div style={{ background: '#607d8b', width: '100%', height: '100%' }} />
        </Rectangle>
    );
}
function randomNum(min, max)
{
    return (Math.random() * max) + min;
}
export default ArraySorter;