import { instancePost } from "./instance";

const getEnvironmentValue = (key: string): string => {
  const isProd = process.env.NODE_ENV === "production";
  const value = isProd ? process.env[`${key}_PROD`] : process.env[`${key}_DEV`];

  if (!value) throw new Error(`Environment variable ${key} not found`);
  return value;
};

export default async function getTokenSantander(): Promise<string> {
  const params = new URLSearchParams();

  try {
    const clientId = getEnvironmentValue("SANTANDER_CLIENT_ID");
    const clientSecret = getEnvironmentValue("SANTANDER_CLIENT_SECRET");

    params.append("client_id", clientId);
    params.append("client_secret", clientSecret);

    const { data } = await instancePost(
      "/oauth/token?grant_type=client_credentials",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return data.access_token;
  } catch (error) {
    if (error instanceof Error)
      throw new Error(`Failed to get Santander token: ${error.message}`);

    throw new Error("Unknown error while getting Santander token");
  }
}
