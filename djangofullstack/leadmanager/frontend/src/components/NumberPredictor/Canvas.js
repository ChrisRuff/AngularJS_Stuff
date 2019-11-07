import React, { Component } from "react";

class Canvas extends Component
{
  constructor(props)
  {
    super(props);
    this.state =
    {
      isDrawing: false,
      lines: Immutable.List()
    };
  }
}
export default Canvas;
