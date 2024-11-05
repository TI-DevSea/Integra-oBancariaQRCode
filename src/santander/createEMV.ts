import { randomUUID } from "crypto";
import getTokenSantander from "./getToken";
import { instancePut } from "./instance";

interface Devedor {
  nome: string;
  cpf?: string;
  cnpj?: string;
}

interface CalendarioCobranca {
  dataDeVencimento: string;
}

interface ValorCobranca {
  original: string;
}

interface CobrancaPayload {
  calendario: CalendarioCobranca;
  devedor: Devedor;
  valor: ValorCobranca;
  chave: string;
  solicitacaoPagador: string;
}

interface ClienteData {
  S_CNPJ_CPF: string;
  S_NOME_CLIENTE: string;
  S_PEDIDO: string;
}

export default function createEMVSantander(data: ClienteData, pix: string) {
  if (!data?.S_CNPJ_CPF || !data?.S_NOME_CLIENTE || !data?.S_PEDIDO)
    throw new Error("Dados do cliente incompletos");

  if (!pix) throw new Error("Chave PIX não fornecida");

  async function execute() {
    const token = await getTokenSantander();
    if (!token) throw new Error("Falha ao obter token de autenticação");

    const uuid = randomUUID().toString().replace(/-/g, "").slice(0, 30);
    const dataDeVencimento = new Date();
    dataDeVencimento.setDate(dataDeVencimento.getDate() + 1);
    const formatedData = dataDeVencimento.toISOString().split("T")[0];

    const isCNPJ = data.S_CNPJ_CPF.length === 14;
    const devedorTipo = isCNPJ ? "cnpj" : "cpf";

    const payload: CobrancaPayload = {
      calendario: { dataDeVencimento: formatedData },
      devedor: {
        [devedorTipo]: data.S_CNPJ_CPF,
        nome: data.S_NOME_CLIENTE,
      },
      valor: { original: "1.00" },
      chave: pix,
      solicitacaoPagador: `Entrega Pedido: ${data.S_PEDIDO}`,
    };

    const response = await instancePut(`/api/v1/cobv/${uuid}`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status !== 201)
      throw new Error("Falha ao criar EMV: Status inválido");

    return response.data;
  }

  return execute().catch((error) => {
    console.error({
      message: error.message,
      clienteData: data,
    });
    throw error;
  });
}
