import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Modal,
  FormControl,
  FormGroup,
  ControlLabel
} from "react-bootstrap";
import moment from "moment";
import { titleCase } from "../util";

class TableHeader extends Component {
  state = {
    showModal: false
  };

  create = () => {
    const { headers, create } = this.props;
    let payload = {};
    headers.forEach(h => {
      if (h !== "id") {
        payload[h] = this[h].value;
      }
      if (h === "datetime") {
        payload["datetime"] = {
          date: moment().format("L"),
          time: moment().format("LT")
        };
      }
    });
    create(payload);
    this.setState({
      showModal: false
    });
  };

  cancel = () => {
    this.setState({
      showModal: false
    });
  };

  modal = () => (
    <Modal show={this.state.showModal}>
      <Modal.Header>
        <Modal.Title>Add New</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {this.props.headers.map((h, i) => {
          return h !== "id" && h !== "datetime" ? (
            <FormGroup key={i}>
              <ControlLabel>{titleCase(h)}</ControlLabel>
              <FormControl inputRef={input => (this[h] = input)} />
            </FormGroup>
          ) : null;
        })}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={this.create}>Save</Button>
        <Button onClick={this.cancel} bsStyle="primary">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );

  newModal = () => {
    this.setState({
      showModal: true
    });
  };

  onFilter = (el, value) => {
    const { headers, onFilter } = this.props;
    onFilter(el, value);
  };

  onFocus = el => {
    const { headers, onFocus } = this.props;
    headers.forEach(h => {
      if (h !== el) {
        this[h].value = "";
      }
    });
    onFocus();
  };

  render() {
    const { headers } = this.props;
    return (
      <thead>
        {this.modal()}
        <tr>
          {headers.map((h, i) => (
            <th
              key={i}
              className={"center" + (h === "id" ? " hidden" : "")}
              onClick={() => this.props.sort(h)}
            >
              {titleCase(h)}
            </th>
          ))}
          <th>#</th>
        </tr>
        <tr>
          {headers.map((h, i) => (
            <td key={i} className={h === "id" ? "hidden" : ""}>
              <input
                ref={input => (this[h] = input)}
                onChange={value => this.onFilter(h, this[h].value)}
                onFocus={() => this.onFocus(h)}
                style={{
                  position: "relative",
                  width: "100%"
                }}
              />
            </td>
          ))}
          <td>
            <Button
              onClick={this.newModal}
              style={{ width: "100%" }}
              bsStyle="primary"
              bsSize="small"
            >
              New
            </Button>
          </td>
        </tr>
      </thead>
    );
  }
}

TableHeader.propTypes = {
  sort: PropTypes.func.isRequired,
  headers: PropTypes.array.isRequired,
  create: PropTypes.func.isRequired,
};

export default TableHeader;
