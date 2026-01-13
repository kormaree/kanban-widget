import axios from "axios";

export const platformHttp = axios.create({
  baseURL: "http://85.234.22.160:1111",
  headers: {
    "Content-Type": "application/json",
  },
});