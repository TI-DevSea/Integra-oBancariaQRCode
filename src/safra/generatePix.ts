import createEMVSafra from "./createEMV";

interface SafraResponse {
  charge: {
    transactions: Array<{
      qrCodeBase64: string;
      qrCode: string;
    }>;
    id: string;
  };
}

interface PixResponse {
  qrCode: string;
  emv: string;
  txid: string;
}

interface ErrorResponse {
  status: "erro";
  message: string;
}

type GeneratePixResponse = PixResponse | ErrorResponse;

interface SafraData {
  NOME_CLIENTE: string;
  CNPJ_CPF: string;
  VALOR: string;
  IDENTIFICADOR: string;
}

async function generatePixSafra(data: SafraData): Promise<GeneratePixResponse> {
  if (!data) throw new Error("Dados não fornecidos");

  try {
    const safraData = (await createEMVSafra(data)) as SafraResponse;

    return {
      qrCode: safraData.charge.transactions[0].qrCodeBase64,
      emv: safraData.charge.transactions[0].qrCode,
      txid: safraData.charge.id,
    };
  } catch (error) {
    console.error("Erro ao gerar PIX Safra:", {
      message: error instanceof Error ? error.message : "Erro desconhecido",
      data,
    });

    return {
      status: "erro",
      message: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

export default generatePixSafra;
