import { instancePost } from "./instance";

export default function getTokenSafra(): Promise<string> {
  if (!process.env.SAFRA_MERCHANTTOKEN)
    throw new Error("SAFRA_MERCHANTTOKEN não configurado");

  return instancePost(
    "/v2/merchant/auth",
    {},
    {
      headers: {
        Authorization: process.env.SAFRA_MERCHANTTOKEN,
      },
    }
  ).then((response) => response.data.accessToken);
}
