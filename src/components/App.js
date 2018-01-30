import React, { Component } from "react";
import axios from "axios";
import { find, orderBy, filter } from "lodash";
import moment from "moment";
import {
  Grid,
  Row,
  Col,
  Table,
  Modal,
  Button,
  FormGroup,
  ControlLabel,
  FormControl
} from "react-bootstrap";
import Tabs from "./Tabs";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import Header from "./Header";
import { titleCase } from "../util";

const ASC = "asc";
const DESC = "desc";

const map = {
  users: "http://localhost:3001/users",
  cars: "http://localhost:3002/cars",
  uploads: "http://localhost:3003/uploads"
};

class App extends Component {
  state = {
    rows: [],
    headers: [],
    tab: "users",
    showModal: false,
    row: {}
  };

  toggle = tab => {
    this.setState({ tab }, () => this.loadData());
  };

  loadData = () => {
    const url = map[this.state.tab];
    axios(url).then(res => this.setData(res));
  };

  setData = res => {
    let sorted = new Map();
    Object.keys(res.data[0]).forEach(k => sorted.set(k, ASC));
    this.setState({
      rows: res.data,
      headers: Object.keys(res.data[0]),
      sorted
    });
  };

  componentDidMount() {
    axios(map.users).then(res => this.setData(res));
  }

  sort = by => {
    let sorted = this.state.sorted;
    let order = sorted.get(by);
    sorted.set(by, order === ASC ? DESC : ASC);
    let rows = [];
    if (by === "datetime") {
      rows = orderBy(this.state.rows, e => new Date(e.datetime.date), order);
    } else {
      rows = orderBy(this.state.rows, by, order);
    }
    this.setState({ rows, sorted });
  };

  onDelete = id => {
    const { tab } = this.state;
    const url = map[tab];
    if (confirm(`Delete ${id} from ${tab}`)) {
      axios.delete(`${url}/${id}`).then(res => {
        const rows = this.state.rows.filter(r => r.id !== id);
        this.setState({ rows });
      });
    }
  };

  onEdit = row => {
    this.setState({ row, showModal: true });
  };

  edit = () => {
    const { tab, row } = this.state;
    const url = map[tab];
    const payload = {};
    Object.keys(row).forEach(r => {
      if (r !== "id") {
        payload[r] = this[r].value;
      }
      if (r === "datetime") {
        payload[r] = {
          date: moment().format("L"),
          time: moment().format("LT")
        };
      }
    });
    axios.put(`${url}/${row.id}`, payload).then(res => {
      let rows = this.state.rows;
      rows = rows.map(r => (r.id === row.id ? res.data : r));
      this.setState({
        showModal: false,
        rows
      });
    });
  };

  create = payload => {
    let { tab, rows } = this.state;
    const url = map[tab];
    axios.post(url, payload).then(res => {
      this.loadData();
    });
  };

  onFilter = (el, value) => {
    this.loadData();
    let { rows, tab } = this.state;
    const url = map[tab];
    axios.get(url).then(res => {
      rows = filter(res.data, r =>
        r[el].toLowerCase().includes(value.toLowerCase())
      );
      this.setState({
        rows
      });
    });
  };

  onFocus = () => {
    const { tab } = this.state;
    const url = map[tab];
    axios.get(url).then(res => {
      this.setState({ rows: res.data });
    });
  };

  modal = () => (
    <Modal show={this.state.showModal}>
      <Modal.Header>
        <Modal.Title>Edit</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {Object.keys(this.state.row).map(r => {
          return (
            <div className={r === "id" ? "hidden" : null}>
              {r !== "datetime" ? (
                <FormGroup>
                  <ControlLabel>{titleCase(r)}</ControlLabel>
                  <FormControl
                    defaultValue={this.state.row[r]}
                    inputRef={input => (this[r] = input)}
                  />
                </FormGroup>
              ) : (
                <FormGroup>
                  <FormControl
                    type="hidden"
                    inputRef={input => (this[r] = input)}
                  />
                </FormGroup>
              )}
            </div>
          );
        })}
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={() => this.setState({ showModal: false })}>
          Close
        </Button>
        <Button onClick={this.edit} bsStyle="primary">
          Save changes
        </Button>
      </Modal.Footer>
    </Modal>
  );

  render() {
    const { headers, rows, tab } = this.state;
    return (
      <Grid>
        {this.modal()}
        <Row>
          <Col xs={12}>
            <Header />
            <Tabs headers={headers} toggle={this.toggle} />
            <hr />
            <Table
              style={{ tableLayout: "fixed" }}
              striped
              bordered
              condensed
              hover
            >
              <TableHeader
                sort={this.sort}
                headers={headers}
                create={this.create}
                onFilter={this.onFilter}
                onFocus={this.onFocus}
              />
              <TableBody
                rows={rows}
                onDelete={this.onDelete}
                onEdit={this.onEdit}
              />
            </Table>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default App;
