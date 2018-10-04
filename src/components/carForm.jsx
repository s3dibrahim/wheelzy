import React from "react";
import Form from "./common/form";
import Joi from "joi-browser";
import { getGenres } from "../services/genreService";
import { getCar, saveCar } from "../services/carService";

class CarForm extends Form {
  state = {
    data: { title: "", genreId: "", numberInStock: "", dailyRentalRate: "" },
    genres: [],
    errors: {}
  };

  schema = {
    _id: Joi.string(),
    title: Joi.string()
      .required()
      .label("Title"),
    genreId: Joi.string()
      .required()
      .label("Genre"),
    numberInStock: Joi.number()
      .integer()
      .min(0)
      .required()
      .label("Number in stock"),
    dailyRentalRate: Joi.number()
      .min(1)
      .max(10)
      .required()
      .label("Rate")
  };

  async populateGenres() {
    const { data: genres } = await getGenres();
    this.setState({ genres });
  }

  async populateCars() {
    try {
      const carID = this.props.match.params.id;
      if (carID === "new") return;

      const { data: car } = await getCar(carID);
      this.setState({ data: this.mapToViewModel(car) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateGenres();
    await this.populateCars();
  }

  mapToViewModel(car) {
    return {
      _id: car._id,
      title: car.title,
      genreId: car.genre._id,
      numberInStock: car.numberInStock,
      dailyRentalRate: car.dailyRentalRate
    };
  }

  Submit = async () => {
    await saveCar(this.state.data);
    this.props.history.push("/cars");
  };

  render() {
    return (
      <div>
        <h1>Car Form</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("title", "Title")}
          {this.renderSelect("genreId", "Type", this.state.genres)}
          {this.renderInput("numberInStock", "Number in stock", "number")}
          {this.renderInput("dailyRentalRate", "Rate", "number")}
          {this.renderButton("Save")}
        </form>
      </div>
    );
  }
}

export default CarForm;
