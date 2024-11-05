import path from "path";
import fs from "fs";
import { instancePost } from "./instance";

interface TokenResponse {
  access_token: string;
}

interface TokenError {
  message: string;
  error: unknown;
}

function validateEnvironment(): void {
  if (!process.env.BRADESCO_CLIENT_ID || !process.env.BRADESCO_CLIENT_SECRET)
    throw new Error("Credenciais Bradesco não encontradas");
}

function getAuthorizationHeader(
  clientId: string,
  clientSecret: string
): string {
  return `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  )}`;
}

export async function getTokenBradesco(): Promise<string> {
  try {
    validateEnvironment();

    const cert = fs.readFileSync(path.resolve(__dirname, "yourinfo.crt"));
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");

    const response = await instancePost<TokenResponse>(
      cert,
      "/oauth/token",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: getAuthorizationHeader(
            process.env.BRADESCO_CLIENT_ID!,
            process.env.BRADESCO_CLIENT_SECRET!
          ),
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    const errorDetails: TokenError = {
      message: "Erro ao gerar token Bradesco",
      error,
    };
    console.error(errorDetails);
    throw new Error("Falha na geração do token Bradesco");
  }
}
