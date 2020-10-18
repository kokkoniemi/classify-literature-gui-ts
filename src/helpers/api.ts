import { ID, Params, Data } from "../types/api";
import { nprogress } from "./utils";
import axios from "axios";

const API_ROOT = "http://localhost:3000/api/";

export const http = axios.create({
  baseURL: API_ROOT,
  timeout: 10000
});

const handleError = (error: Error) => {
  nprogress.done();
  console.error(error);
  return Promise.reject(error);
};

http.interceptors.request.use(request => {
  nprogress.start();
  return request;
}, handleError);

http.interceptors.response.use(response => {
  nprogress.done();
  return response;
}, handleError);

export const records = {
  index: (params: Params) => http.get("records", { params }),
  get: (id: ID, params: Params) => http.get(`records/${id}`, { params }),
  update: (id: ID, data: Data, params: Params) =>
    http.put(`records/${id}`, data, { params }),
  mappingOptions: {
    save: (id: ID, data: Data, params: Params) =>
      http.post(`records/${id}/mapping-options`, data, { params }),
    delete: (id: ID, optionId: ID, params: Params) =>
      http.delete(`records/${id}/mapping-options/${optionId}`, { params })
  }
};

export const mappingQuestions = {
  index: (params: Params) => http.get("mapping-questions", { params }),
  save: (data: Data, params: Params) =>
    http.post("mapping-questions", data, { params }),
  update: (id: ID, data: Data, params: Params) =>
    http.put(`mapping-questions/${id}`, data, { params }),
  delete: (id: ID, params: Params) =>
    http.delete(`mapping-questions/${id}`, { params }),
  mappingOptions: {
    index: (id: ID, params: Params) =>
      http.get(`mapping-questions/${id}/mapping-options`, { params }),
    save: (id: ID, data: Data, params: Params) =>
      http.post(`mapping-questions/${id}/mapping-options`, data, { params }),
    update: (id: ID, optionId: ID, data: Data, params: Params) =>
      http.put(`mapping-questions/${id}/mapping-options/${optionId}`, data, {
        params
      }),
    delete: (id: ID, optionId: ID, params: Params) =>
      http.delete(`mapping-questions/${id}/mapping-options/${optionId}`, {
        params
      })
  }
};
