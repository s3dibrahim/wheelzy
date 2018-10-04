import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "./common/table";
import Like from "./common/like";
import auth from "../services/authService";

class CarsTable extends Component {
  columns = [
    {
      value: "title",
      label: "Title",
      content: movie => <Link to={`/cars/${movie._id}`}>{movie.title}</Link>
    },
    { value: "genre.name", label: "Type" },
    { value: "numberInStock", label: "Stock" },
    { value: "dailyRentalRate", label: "Rate" },
    {
      value: "like",
      content: movie => (
        <Like liked={movie.liked} onClick={() => this.props.onLike(movie)} />
      )
    }
  ];
  deleteColumn = {
    value: "delete",
    content: movie => (
      <button
        onClick={() => this.props.onDelete(movie)}
        className="btn btn-danger btn-sm"
      >
        Delete
      </button>
    )
  };
  constructor() {
    super();
    const user = auth.getCurrentUser();
    if (user && user.isAdmin) this.columns.push(this.deleteColumn);
  }
  render() {
    const { cars, onSort, sortColumn } = this.props;
    return (
      <Table
        data={cars}
        columns={this.columns}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default CarsTable;
