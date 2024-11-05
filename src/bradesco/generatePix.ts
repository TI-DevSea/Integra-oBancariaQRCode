import { createEMVBradesco } from "./createEMV";

interface PixData {
  value: number;
  description: string;
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

type GeneratePixResult = PixResponse | ErrorResponse;

function validateInput(data: PixData): void {
  if (!data?.value || !data?.description)
    throw new Error("Dados do PIX inválidos");
}

export async function generatePixBradesco(
  data: PixData,
  filial: string
): Promise<GeneratePixResult> {
  try {
    validateInput(data);

    if (!process.env.BRADESCO_PIX_KEY_DEV)
      throw new Error("Chave PIX Bradesco não configurada");

    const bradescoData = await createEMVBradesco(
      data,
      process.env.BRADESCO_PIX_KEY_DEV
    );

    if (bradescoData instanceof Error)
      return {
        status: "erro",
        message: bradescoData.message,
      };

    return {
      qrCode: bradescoData.base64,
      emv: bradescoData.emv,
      txid: bradescoData.cob.txid,
    };
  } catch (error) {
    console.error({
      message: error instanceof Error ? error.message : "Erro desconhecido",
      data,
    });

    return {
      status: "erro",
      message: "Falha ao gerar PIX Bradesco",
    };
  }
}
