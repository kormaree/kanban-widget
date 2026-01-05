import axios from "axios";

export const http = axios.create({
  baseURL: "http://158.160.98.202:8080",
});