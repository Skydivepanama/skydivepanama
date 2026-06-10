import crypto from 'crypto'

const MERCHANT_ID = process.env.YAPPY_MERCHANT_ID!
const SECRET_KEY = process.env.YAPPY_SECRET_KEY!
const API_URL = process.env.YAPPY_API_URL!

export interface YappyPaymentParams {
  amount: number
  orderId: string
  description: string
  phone: string
  successUrl: string
  failureUrl: string
}

export interface YappyResponse {
  success: boolean
  paymentUrl?: string
  transactionId?: string
  errorMessage?: string
}

function generateSignature(params: Record<string, string>): string {
  const sortedKeys = Object.keys(params).sort()
  const queryString = sortedKeys.map(k => `${k}=${params[k]}`).join('&')
  return crypto.createHmac('sha256', SECRET_KEY).update(queryString).digest('hex')
}

export async function createYappyPayment(params: YappyPaymentParams): Promise<YappyResponse> {
  const payload: Record<string, string> = {
    merchantId: MERCHANT_ID,
    orderId: params.orderId,
    amount: params.amount.toFixed(2),
    description: params.description,
    phone: params.phone,
    successUrl: params.successUrl,
    failureUrl: params.failureUrl,
  }

  const signature = generateSignature(payload)

  const res = await fetch(`${API_URL}/payments/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Signature': signature,
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json()

  if (data.paymentUrl) {
    return {
      success: true,
      paymentUrl: data.paymentUrl,
      transactionId: data.transactionId,
    }
  }

  return {
    success: false,
    errorMessage: data.message || 'Error creando pago Yappy',
  }
}

export function verifyYappyWebhook(payload: Record<string, string>, receivedSignature: string): boolean {
  const expected = generateSignature(payload)
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(receivedSignature))
}
