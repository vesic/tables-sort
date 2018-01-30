import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { Button, ButtonGroup, ButtonToolbar } from "react-bootstrap";
import { isObj, formatDate } from "../util";

class TableBody extends Component {
  render() {
    const { rows, onDelete, onEdit } = this.props;
    return (
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {Object.keys(r).map((k, j) => {
              return (
                <td key={j} className={k === "id" ? "hidden" : ""}>
                  {isObj(r[k]) ? formatDate(r[k]) : r[k]}
                </td>
              );
            })}
            <td>
              <ButtonGroup bsSize="xsmall" justified>
                <Button onClick={() => onEdit(r)} href="#" bsStyle="success">
                  Edit
                </Button>
                <Button
                  onClick={() => onDelete(r.id)}
                  href="#"
                  bsStyle="danger"
                >
                  Delete
                </Button>
              </ButtonGroup>
            </td>
          </tr>
        ))}
      </tbody>
    );
  }
}

TableBody.propTypes = {
  rows: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired
};

export default TableBody;
