import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";
import { getTokenBradesco } from "./getToken";
import { instancePut } from "./instance";

interface PayerData {
  CNPJ_CPF: string;
  NOME_CLIENTE: string;
  VALOR: number;
}

interface EMVResponse {
  base64: string;
  emv: string;
  cob: {
    txid: string;
  };
}

interface EMVPayload {
  nomePersonalizacaoQr: string;
  calendario: {
    expiracao: number;
  };
  devedor: {
    cnpj?: string;
    cpf?: string;
    nome: string;
  };
  valor: {
    modalidadeAlteracao: number;
    original: number;
  };
  chave: string;
  solicitacaoPagador: string;
}

function validateInput(data: PayerData, pixKey: string): void {
  if (!data?.CNPJ_CPF || !data?.NOME_CLIENTE || !data?.VALOR || !pixKey)
    throw new Error("Dados inválidos para geração de EMV");
}

function createPayload(data: PayerData, pixKey: string): EMVPayload {
  const isCompany = data.CNPJ_CPF.length === 14;
  const documentType = isCompany ? "cnpj" : "cpf";

  return {
    nomePersonalizacaoQr: "NOME EMPRESA",
    calendario: { expiracao: 86400 },
    devedor: {
      [documentType]: data.CNPJ_CPF,
      nome: data.NOME_CLIENTE,
    },
    valor: {
      modalidadeAlteracao: 0,
      original: data.VALOR,
    },
    chave: pixKey,
    solicitacaoPagador: "IDENTIFICADOR",
  };
}

export async function createEMVBradesco(
  data: PayerData,
  pixKey: string
): Promise<EMVResponse | Error> {
  try {
    validateInput(data, pixKey);

    const cert = fs.readFileSync(path.resolve(__dirname, "yourinfo.crt"));
    const token = await getTokenBradesco();
    const uuid = randomUUID().replace(/-/g, "");
    const payload = createPayload(data, pixKey);

    const response = await instancePut<EMVResponse>(
      cert,
      `/v2/cob-emv/${uuid}`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.status !== 201) throw new Error("Erro ao criar o EMV");

    return response.data;
  } catch (error) {
    console.error({
      message: error instanceof Error ? error.message : "Erro desconhecido",
      data,
    });
    return new Error("Falha na criação do EMV Bradesco");
  }
}
