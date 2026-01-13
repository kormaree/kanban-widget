import axios from "axios";

export const http = axios.create({
  baseURL: "http://130.193.59.201:8080",
});