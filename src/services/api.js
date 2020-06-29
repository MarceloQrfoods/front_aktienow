import axios from "axios";
import { getToken } from "./auth";

const api = axios.create({
  baseURL: "http://134.122.123.230:3333/"
});

api.interceptors.request.use(async config => {
  //const token = getToken();
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTU5MzI3Njc0MX0.jI_gqowgqRPl36GpRhUPEH_6n7wxlWNE8DZLjEPDW_A'
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;