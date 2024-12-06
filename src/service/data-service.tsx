import axios, { ResponseType } from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/",
});

const getHeaders = (token?: string, isFormData?: boolean) => {
  const headers: { [key: string]: string } = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

export default async function dataFetch(
  endpoint: string,
  method: string,
  data?: any,
  token?: string,
  responseType?: ResponseType
) {
  try {
    const isFormData = data instanceof FormData;

    const response = await api.request({
      url: endpoint,
      method,
      data,
      headers: getHeaders(token, isFormData),
      responseType: responseType || "json",
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(token);
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}