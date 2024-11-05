import getTokenSafra from "./getToken";
import { instancePost } from "./instance";

interface Customer {
  name: string;
  document: string;
  documentType: number;
}

interface Transaction {
  amount: string;
}

interface Metadata {
  key: string;
  value: string;
}

interface ChargeRequest {
  charge: {
    customer: Customer;
    transactions: Transaction[];
    metadata: Metadata[];
    source: number;
  };
}

interface SafraData {
  NOME_CLIENTE: string;
  CNPJ_CPF: string;
  VALOR: string;
  IDENTIFICADOR: string;
}

function createChargePayload(data: SafraData): ChargeRequest {
  const isCompany = data.CNPJ_CPF.length === 14;
  const documentType = isCompany ? 2 : 1;

  return {
    charge: {
      customer: {
        name: data.NOME_CLIENTE,
        document: data.CNPJ_CPF,
        documentType,
      },
      transactions: [{ amount: `${data.VALOR}` }],
      metadata: [
        {
          key: "IDENTIFICADOR",
          value: data.IDENTIFICADOR,
        },
      ],
      source: 1,
    },
  };
}

async function createEMVSafra(data: SafraData): Promise<any> {
  if (
    !data.NOME_CLIENTE ||
    !data.CNPJ_CPF ||
    !data.VALOR ||
    !data.IDENTIFICADOR
  )
    throw new Error("Dados inválidos para criação do EMV");

  try {
    const token = await getTokenSafra();
    const payload = createChargePayload(data);

    const response = await instancePost("/v2/charge/pix", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status !== 200) throw new Error("Erro ao criar o EMV");

    return response.data;
  } catch (error: any) {
    console.error({ message: error.message, data });
    throw error;
  }
}

export default createEMVSafra;
