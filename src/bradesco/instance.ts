import fs from "fs";
import path from "path";
import axios, { AxiosResponse } from "axios";
import https from "https";

interface RequestHeaders {
  headers: Record<string, string>;
}

interface CertificateOptions {
  key: Buffer;
  cert: Buffer;
  passphrase: string;
}

const mainPath =
  process.env.NODE_ENV === "production"
    ? "https://qrpix.bradesco.com.br"
    : "https://qrpix-h.bradesco.com.br";

function getCertificateOptions(cert: string): CertificateOptions {
  if (!process.env.BRADESCO_PASSPHRASE)
    throw new Error("BRADESCO_PASSPHRASE não definido");

  return {
    key: fs.readFileSync(
      path.resolve(__dirname, "..", "..", "..", `${cert}.key`)
    ),
    cert: fs.readFileSync(
      path.resolve(__dirname, "..", "..", "..", `${cert}.crt`)
    ),
    passphrase: process.env.BRADESCO_PASSPHRASE,
  };
}

export async function instancePut<T>(
  cert: string,
  url: string,
  data: unknown,
  headers: RequestHeaders
): Promise<AxiosResponse<T>> {
  const instance = axios.create({
    httpsAgent: new https.Agent(getCertificateOptions(cert)),
  });
  return instance.put(`${mainPath}${url}`, data, headers);
}

export async function instancePost<T>(
  cert: string,
  url: string,
  data: unknown,
  headers: RequestHeaders
): Promise<AxiosResponse<T>> {
  const instance = axios.create({
    httpsAgent: new https.Agent(getCertificateOptions(cert)),
  });
  return instance.post(`${mainPath}${url}`, data, headers);
}

export async function instanceGet<T>(
  cert: string,
  url: string,
  headers: RequestHeaders
): Promise<AxiosResponse<T>> {
  const instance = axios.create({
    httpsAgent: new https.Agent(getCertificateOptions(cert)),
  });
  return instance.get(`${mainPath}${url}`, headers);
}
