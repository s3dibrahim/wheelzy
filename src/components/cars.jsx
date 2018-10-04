import React, { Component } from "react";
import { getCars, deleteCar } from "../services/carService";
import { getGenres } from "../services/genreService";
import Pagination from "./common/pagination";
import { paginate } from "../utils/paginate";
import ListGroup from "./common/listGroup";
import CarsTable from "./carsTable";
import SearchBox from "./common/searchBox";
import _ from "lodash";
import { toast } from "react-toastify";

class Cars extends Component {
  state = {
    cars: [],
    genres: [],
    pageSize: 4,
    currentPage: 1,
    sortColumn: { value: "title", order: "asc" },
    searchQuery: "",
    selectedGenre: ""
  };

  async componentDidMount() {
    const { data } = await getGenres();
    const genres = [{ _id: null, name: "All Types" }, ...data];
    const { data: cars } = await getCars();
    this.setState({ cars, genres });
  }

  handelDelete = async car => {
    const originalCars = this.state.cars;
    const cars = originalCars.filter(c => c._id !== car._id);
    this.setState({ cars });
    try {
      await deleteCar(car._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This car has already been deleted");

      this.setState({ cars: originalCars });
    }
  };

  handleLike = car => {
    const cars = [...this.state.cars];
    const index = cars.indexOf(car);
    cars[index] = { ...cars[index] };
    cars[index].liked = !cars[index].liked;
    this.setState({ cars });
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handelGenereSelect = genere => {
    this.setState({ selectedGenre: genere, searchQuery: "", currentPage: 1 });
  };
  handleSearch = query => {
    this.setState({ searchQuery: query, selectedGenre: null, currentPage: 1 });
  };
  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      selectedGenre,
      searchQuery,
      sortColumn,
      cars: allCars
    } = this.state;

    let filtered = allCars;
    if (searchQuery)
      filtered = allCars.filter(m =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else
      filtered =
        selectedGenre && selectedGenre._id
          ? allCars.filter(m => m.genre._id === selectedGenre._id)
          : allCars;

    const sorted = _.orderBy(filtered, [sortColumn.value], [sortColumn.order]);
    const cars = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: cars };
  };

  render() {
    // const { length: count } = this.state.cars;
    const {
      pageSize,
      currentPage,
      sortColumn,
      genres,
      selectedGenre,
      searchQuery
    } = this.state;
    const user = this.props.user;
    // if (count === 0) return <p>There are no cars in the database</p>;
    const { totalCount, data: cars } = this.getPagedData();

    return (
      <div className="row">
        <div className="col-md-2">
          <ListGroup
            items={genres}
            selectedItem={selectedGenre}
            onItemSelect={this.handelGenereSelect}
          />
        </div>
        <div className="col">
          {user && (
            <button
              onClick={() => this.props.history.push("/cars/new")}
              className="btn btn-primary mb-4 mt-4"
            >
              New Car
            </button>
          )}
          <br />
          <p>Showing {totalCount} cars in the database</p>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          <CarsTable
            cars={cars}
            sortColumn={sortColumn}
            onLike={this.handleLike}
            onDelete={this.handelDelete}
            onSort={this.handleSort}
          />
          <Pagination
            onPageChange={this.handlePageChange}
            itemsCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
          />
        </div>
      </div>
    );
  }
}

export default Cars;
