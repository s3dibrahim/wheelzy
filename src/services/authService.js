import jwtDecode from "jwt-decode";
import http from "./httpService";

const apiEndPoint = "auth";
const tokenKey = "token";

function getJWT() {
  return localStorage.getItem(tokenKey);
}
http.setToken(getJWT());

export async function login(email, password) {
  const { data: jwt } = await http.post(apiEndPoint, { email, password });
  localStorage.setItem(tokenKey, jwt);
}

export function loginWithJWT(jwt) {
  localStorage.setItem(tokenKey, jwt);
}

export function logout() {
  localStorage.removeItem(tokenKey);
}

export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    return jwtDecode(jwt);
  } catch (ex) {
    return null;
  }
}

export default { login, loginWithJWT, logout, getCurrentUser };
