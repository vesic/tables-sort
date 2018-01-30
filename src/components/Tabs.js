import React, { Component } from "react";
import { Button, ButtonGroup } from "react-bootstrap";

class Tabs extends Component {
  render() {
    const { toggle } = this.props;
    return (
      <ButtonGroup justified>
        <Button name='users' onClick={(e) => toggle(e.target.name)} href="#">Users</Button>
        <Button name='cars' onClick={(e) => toggle(e.target.name)} href="#">Cars</Button>
        <Button name='uploads' onClick={(e) => toggle(e.target.name)} href="#">Uploads</Button>
      </ButtonGroup>
    );
  }
}

export default Tabs;
