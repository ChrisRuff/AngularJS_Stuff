import React from "react";
//import {SketchField, Tools} from "react-sketch";
import Canvas from "./Canvas";
class NumberRecognition extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state =
            {
                drawing: null,
            }
    }
    render()
    {
        return(
            <div align="center" style={{background: 'gray',
                                        height: '500px' }} >
                <h1>Draw a single digit number and let the computer predict it</h1>
                <Canvas />
                <button onClick={()=>{this.predict(this.canvas.toDataURL())}}>What number?</button>
                <button onClick={()=>{this.canvas.clear()}}>Clear</button>
                <img src={this.state.image}></img>
            </div>
            )
    }
    predict(drawing)
    {
        console.log(drawing);
        this.setState({drawing: drawing});

    }
}


export default NumberRecognition
