import axios from "axios";

const instance = axios.create();

const mainPath =
  process.env.NODE_ENV === "production"
    ? "https://payment.safrapay.com.br"
    : "https://payment-hml.safrapay.com.br";

export async function instancePost(
  url: string,
  data: any,
  headers: any
): Promise<any> {
  return await instance.post(`${mainPath}${url}`, data, headers);
}

export async function instanceGet(url: string, headers: any): Promise<any> {
  return await instance.get(`${mainPath}${url}`, headers);
}
