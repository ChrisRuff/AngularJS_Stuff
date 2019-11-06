import React from "react"
import "./Slider.css"
class Slider extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            sliderValue: 5,
        }
    }

    onChange = (e) => {
        console.log(e.target.value)
        this.setState({ sliderValue: e.target.value });
        this.props.change(e.target.value);
    }

    render () {
        return (
            <div>
                <span class="sliderContainer">{this.state.sliderValue}</span>
                <input
                    className="slider"
                    type="range"
                    value={this.state.sliderValue}
                    min="0"
                    max="50"
                    step="1"
                    onChange={this.onChange.bind(this)} />
            </div>
        )
    }
}
export default Slider;