import React from "react";
import {SketchField, Tools} from "react-sketch";
import Flask from "react-flask"

class NumberRecognition extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state =
            {
                drawing: null,
                image: new Image()
            }
    }
    render()
    {

        return(
            <div align="center" style={{background: 'gray',
                                        height: '500px' }} >
                <h1>Draw a single digit number and let the computer predict it</h1>
                <SketchField
                    style={{background: 'white'}}
                    height="112px"
                    width="112px"
                    tool={Tools.Pencil}
                    ref={canvas=>(this.canvas = canvas)}
                />
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
    sleep (time)
    {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
}


export default NumberRecognition