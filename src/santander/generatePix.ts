import createEMVSantander from "./createEMV";

interface PixResponse {
  emv: string;
  txid: string;
}

interface ErrorResponse {
  status: "erro";
  message: string;
}

interface SantanderData {
  valor: number;
  descricao: string;
  identificador: string;
  S_CNPJ_CPF: string;
  S_NOME_CLIENTE: string;
  S_PEDIDO: string;
}

export function generatePixSantander(
  data: SantanderData
): Promise<PixResponse | ErrorResponse> {
  if (!process.env.SANTANDER_PIX_KEY_PROD || !process.env.SANTANDER_PIX_KEY_DEV)
    throw new Error("Chave PIX Santander não configurada");

  const pixKey =
    process.env.NODE_ENV === "production"
      ? process.env.SANTANDER_PIX_KEY_PROD
      : process.env.SANTANDER_PIX_KEY_DEV;

  return createEMVSantander(data, pixKey)
    .then((response: any) => {
      if (response instanceof Error)
        return {
          status: "erro",
          message: response.message,
        };

      return {
        emv: response.pixCopiaECola,
        txid: response.txid,
      };
    })
    .catch((error: any) => {
      console.error({ message: error.message, data });
      return {
        status: "erro",
        message: error.message,
      };
    });
}
