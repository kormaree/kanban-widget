import axios from "axios";

export const http = axios.create({
  baseURL: "http://158.160.12.246:8080",
});