import axios from "axios";
import { BASE_URL } from "@/constants/constants";
// axios.defaults.withCredentials = true;

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  // headers: {
  //   "Content-Type": "application/x-www-form-urlencoded",
  // },
});

export default API;
