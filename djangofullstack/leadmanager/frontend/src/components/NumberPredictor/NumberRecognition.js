import React from "react";
import { connect } from 'react-redux';
import DrawableCanvas from "react-drawable-canvas"
import { predictNum } from '../../actions/predict';
import PropTypes from 'prop-types';

var prediction = null
export class NumberRecognition extends React.Component
{
    static propTypes = {
      predictNum: PropTypes.func.isRequired
    }

    constructor(props)
    {
        super(props);
        this.canvas = React.createRef();
        this.state =
            {
                drawing: null,
                prediction: null
            }
    }
    render()
    {
        return(
            <div align="center" style={{background: 'gray',
                                        height: '500px' }} >
                <h1>Draw a single digit number and let the computer predict it</h1>
                <div style={{height: '28px', width: '28px'}}>
                  <DrawableCanvas ref={this.canvas}/>
                </div>
                <button onClick={()=>{this.predict()}}>What number?</button>
                <button onClick={()=>{this.clearCanvas()}}>Clear</button>
                <br/>
                <img src={this.state.drawing}></img>
                <br/>
                <h2> Prediction is {this.state.prediction}</h2>
            </div>
            )
    }
    predict()
    {
      let drawing = this.canvas.current.state.canvas.toDataURL();
      this.props.predictNum({"image":drawing})
      this.setState({drawing: drawing,
                     prediction: prediction});
      console.log(this.state)

    }
    clearCanvas()
    {
      let canvas = this.canvas.current.state.canvas;
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
}

const mapStateToProps = (state) => {
  prediction = (state.predict.prediction[state.predict.prediction.length - 1]);
  return({
    prediction: state.predict
})};
