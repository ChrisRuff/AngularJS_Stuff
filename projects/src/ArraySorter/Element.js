import React from "react"
import "./ArrayStyle.css";

class Element extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            hover: false,
            highlight: false,
            chosen: false
        }

    }
    randomNum(min, max)
    {
        return Math.floor((Math.random() * max) + min);
    }
    select()
    {
        this.setState({
            hover: true,
            highlight: false,
            chosen: false
        });
    }
    deselect()
    {
        this.setState({
            hover: false
        });
    }
    highlight()
    {
        this.setState({
            hover: false,
            highlight: true,
            chosen: false
        });
    }
    unhighlight()
    {
        this.setState({
            highlight: false
        });
    }
    chose()
    {
        this.setState({
            hover: false,
            highlight: false,
            chosen: true
        });
    }
    unchose()
    {
        this.setState({
            chosen: false
        });
    }
    render()
    {
        return(
        <li height={this.props.height}
            className="element"
            style={{width: this.props.x, height: this.props.height,
                ...{background: this.state.hover?'red':this.state.chosen?'pink':this.state.highlight?'green':''}}}
        >
            <span className="height-text">{this.props.height}</span>
        </li>
        );
    }
}
export default Element;