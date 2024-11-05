import fs from "fs";
import path from "path";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import https from "https";

interface HttpsOptions {
  key: Buffer;
  cert: Buffer;
  passphrase: string;
}

interface RequestHeaders {
  [key: string]: string;
}

const getHttpsOptions = (): HttpsOptions => {
  const passphrase = process.env.SANTANDER_PASSPHRASE;
  if (!passphrase)
    throw new Error("SANTANDER_PASSPHRASE not found in environment");

  return {
    key: fs.readFileSync(path.resolve(__dirname, "yourinfo.key")),
    cert: fs.readFileSync(path.resolve(__dirname, "yourinfo.crt")),
    passphrase,
  };
};

const instance: AxiosInstance = axios.create({
  httpsAgent: new https.Agent(getHttpsOptions()),
});

const mainPath =
  process.env.NODE_ENV === "production"
    ? "https://trust-pix.santander.com.br"
    : "https://trust-pix-h.santander.com.br";

export async function instancePut<T>(
  url: string,
  data: unknown,
  headers: RequestHeaders
): Promise<AxiosResponse<T>> {
  return instance.put<T>(`${mainPath}${url}`, data, { headers });
}

export async function instancePost<T>(
  url: string,
  data: unknown,
  headers: RequestHeaders
): Promise<AxiosResponse<T>> {
  return instance.post<T>(`${mainPath}${url}`, data, { headers });
}

export async function instanceGet<T>(
  url: string,
  headers: RequestHeaders
): Promise<AxiosResponse<T>> {
  return instance.get<T>(`${mainPath}${url}`, { headers });
}
