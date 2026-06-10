const API_URL = process.env.PAGUELOFACIL_API_URL!
const CCLW = process.env.PAGUELOFACIL_CCLW!

export interface PaguéloFácilChargeParams {
  amount: number
  description: string
  cardNumber: string
  cardExpMonth: string
  cardExpYear: string
  cardCVV: string
  cardHolder: string
  email: string
  phone: string
}

export interface PaguéloFácilResponse {
  success: boolean
  transactionId?: string
  authCode?: string
  errorMessage?: string
  raw?: Record<string, unknown>
}

export async function chargeCard(params: PaguéloFácilChargeParams): Promise<PaguéloFácilResponse> {
  const body = {
    cclw: CCLW,
    amount: params.amount.toFixed(2),
    taxAmount: '0.00',
    summary: params.description,
    fname: params.cardHolder.split(' ')[0] || params.cardHolder,
    lname: params.cardHolder.split(' ').slice(1).join(' ') || '',
    email: params.email,
    phone: params.phone,
    cardNumber: params.cardNumber.replace(/\s/g, ''),
    expMonth: params.cardExpMonth,
    expYear: params.cardExpYear,
    cvv: params.cardCVV,
    lang: 'ES',
  }

  const res = await fetch(`${API_URL}/linkcobro/restAPI/dataRequest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await res.json()

  if (data.success === true || data.codOper) {
    return {
      success: true,
      transactionId: data.codOper,
      authCode: data.authCode,
      raw: data,
    }
  }

  return {
    success: false,
    errorMessage: data.description || data.msg || 'Error procesando el pago',
    raw: data,
  }
}
