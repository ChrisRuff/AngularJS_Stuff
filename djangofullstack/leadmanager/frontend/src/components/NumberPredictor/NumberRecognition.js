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
                <div style={{height: '252px', width: '200px', background: 'white'}}>
                  <DrawableCanvas
                    ref={this.canvas}
                    lineWidth={10}>
                  </DrawableCanvas>
                </div>
                <button onClick={()=>{this.predict()}}>What number?</button>
                <button onClick={()=>{this.clearCanvas()}}>Clear</button>
                <br/>
                <h3>The larger you make your digit the better the prediction will be</h3>
                <h2> Prediction is {this.state.prediction}</h2>
            </div>
            )
    }
    async predict()
    {
      let drawing = this.canvas.current.state.canvas.toDataURL();
      this.props.predictNum({"image":drawing})
      await this.sleep(1000);
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
    sleep (time)
    {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
}

const mapStateToProps = (state, myProps) => {
  prediction = (state.predict.prediction[state.predict.prediction.length - 1]);
  return({
    prediction: prediction
})};

export default connect(mapStateToProps, { predictNum })(NumberRecognition);
