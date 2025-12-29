import axios from "axios";

export const http = axios.create({
  baseURL: "http://158.160.85.242:8080",
});