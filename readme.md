# Documentação de Integrações PIX - Bancos

## Visão Geral

Documentação das integrações PIX para os bancos Bradesco, Santander e Safra, detalhando os requisitos e funcionalidades para geração de QR Code.

## Variáveis de Ambiente Necessárias

### Bradesco

```env
BRADESCO_CLIENT_ID=
BRADESCO_CLIENT_SECRET=
BRADESCO_PASSPHRASE=
BRADESCO_PIX_KEY_DEV=
BRADESCO_PIX_KEY_PROD=
```

### Santander

```env
SANTANDER_CLIENT_ID_DEV=
SANTANDER_CLIENT_ID_PROD=
SANTANDER_CLIENT_SECRET_DEV=
SANTANDER_CLIENT_SECRET_PROD=
SANTANDER_PASSPHRASE=
SANTANDER_PIX_KEY_DEV=
SANTANDER_PIX_KEY_PROD=
```

### Safra

```env
SAFRA_MERCHANTTOKEN=
```

## Estrutura de Dados por Banco

### Bradesco

```typescript
interface PixData {
  value: number; // Valor do PIX
  description: string; // Descrição da cobrança
}

// Retorno
interface PixResponse {
  qrCode: string; // QR Code em base64
  emv: string; // EMV (código PIX copia e cola)
  txid: string; // Identificador da transação
}
```

### Santander

```typescript
interface SantanderData {
  valor: number; // Valor do PIX
  descricao: string; // Descrição da cobrança
  identificador: string; // Identificador único
  CNPJ_CPF: string; // Documento do pagador
  NOME_CLIENTE: string; // Nome do pagador
  PEDIDO: string; // Número do pedido
}

// Retorno
interface PixResponse {
  emv: string; // EMV (código PIX copia e cola)
  txid: string; // Identificador da transação
}
```

### Safra

```typescript
interface SafraData {
  NOME_CLIENTE: string; // Nome do pagador
  CNPJ_CPF: string; // Documento do pagador
  VALOR: string; // Valor do PIX
  IDENTIFICADOR: string; // Identificador único
}

// Retorno
interface PixResponse {
  qrCode: string; // QR Code em base64
  emv: string; // EMV (código PIX copia e cola)
  txid: string; // Identificador da transação
}
```

## Como Usar

### Bradesco

```typescript
import { generatePixBradesco } from "./bradesco/generatePix";

const pixData = {
  value: 100.0,
  description: "Pagamento Pedido #123",
};

const result = await generatePixBradesco(pixData, "filial");
```

### Santander

```typescript
import { generatePixSantander } from "./santander/generatePix";

const pixData = {
  valor: 100.0,
  descricao: "Pagamento Pedido #123",
  identificador: "ID123",
  CNPJ_CPF: "12345678901",
  NOME_CLIENTE: "João Silva",
  PEDIDO: "123",
};

const result = await generatePixSantander(pixData);
```

### Safra

```typescript
import generatePixSafra from "./safra/generatePix";

const pixData = {
  NOME_CLIENTE: "João Silva",
  CNPJ_CPF: "12345678901",
  VALOR: "100.00",
  IDENTIFICADOR: "ID123",
};

const result = await generatePixSafra(pixData);
```

## Particularidades

### Bradesco

- Requer certificado digital (.crt e .key)
- Suporta CPF e CNPJ automaticamente
- Validade do QR Code: 24 horas

### Santander

- Requer certificado digital (.crt e .key)
- Suporta CPF e CNPJ automaticamente
- Validade do QR Code: 24 horas
- Requer número do pedido

### Safra

- Não requer certificado digital
- Usa token merchant para autenticação
- Suporta CPF e CNPJ automaticamente
- Identificador é obrigatório

## Tratamento de Erros

Todas as integrações retornam um objeto de erro padronizado:

```typescript
interface ErrorResponse {
  status: "erro";
  message: string;
}
```
