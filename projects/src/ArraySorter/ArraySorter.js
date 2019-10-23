import React from "react"
import Rectangle from "react-rectangle";
var data;
function ArraySorter()
{
    if(data == null)
        data = new ArrayModel();
    return(data);
}

class ArrayModel extends React.Component
{
    constructor()
    {
        super();
        this.data = listOfRectangles(5, 10, 10);
    }
    render()
    {
        return ( <div>{this.data}</div> );
    }
    sort(array)
    {
        let timer = null;
        function frame()
        {
            let tmp;
            for (let i = 0; i < array.length; i++)
            {
                for (let j = 0; j < array.length; j++)
                {
                    tmp = this.data[i];
                    this.data[i] = this.data[j];
                    this.data[j] = tmp;
                }
            }

        }
        timer=setInterval(frame,300);
    }
}
function listOfRectangles(x, y, num)
{
    let array = [];
    for(let i = 0; i < num; i++)
    {
        array.push(

            <li style={{float: "Left"}}>{rectangle(x,randomNum(0, 500))}</li>
        );
    }
    return (
        <ul>
            {array}
        </ul>
    );



}

function rectangle(x, y)
{
    return (
        <div style={{ background: '#9e9e9e', width: x, height: y }}>
            <Rectangle aspectRatio={[5, 3]}>
                <div style={{ background: '#607d8b', width: '100%', height: '100%' }} />
            </Rectangle>
        </div>
    );
}

function randomNum(min, max)
{
    return (Math.random() * max) + min;
}


export default ArraySorter;