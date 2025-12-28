import axios from "axios";

export const http = axios.create({
  baseURL: "http://158.160.69.172:8080",
});