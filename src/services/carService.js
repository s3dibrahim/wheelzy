import http from "./httpService";

const apiEndPoint = "movies";

function carUrl(id) {
  return `${apiEndPoint}/${id}`;
}

export function getCars() {
  return http.get(apiEndPoint);
}

export function getCar(carID) {
  return http.get(carUrl(carID));
}

export function saveCar(car) {
  if (car._id) {
    const body = { ...car };
    delete body._id;
    return http.put(carUrl(car._id), body);
  }
  return http.post(apiEndPoint, car);
}

export function deleteCar(carID) {
  return http.delete(carUrl(carID));
}
