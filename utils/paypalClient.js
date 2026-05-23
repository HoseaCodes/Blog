import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const SANDBOX_BASE = 'https://api-m.sandbox.paypal.com';
const LIVE_BASE = 'https://api-m.paypal.com';

function getBaseUrl() {
  return process.env.PAYPAL_ENV === 'live' ? LIVE_BASE : SANDBOX_BASE;
}

function getCreds() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !secret) {
    throw new Error('PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET must be set');
  }
  return { clientId, secret };
}

let cachedToken = null;
let cachedTokenExpiresAt = 0;

async function getAccessToken() {
  const now = Date.now();
  if (cachedToken && cachedTokenExpiresAt > now + 30_000) {
    return cachedToken;
  }
  const { clientId, secret } = getCreds();
  const basic = Buffer.from(`${clientId}:${secret}`).toString('base64');
  const response = await axios.post(
    `${getBaseUrl()}/v1/oauth2/token`,
    'grant_type=client_credentials',
    {
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  cachedToken = response.data.access_token;
  cachedTokenExpiresAt = now + response.data.expires_in * 1000;
  return cachedToken;
}

export async function createOrder({ amount, currency = 'USD', referenceId, description }) {
  const token = await getAccessToken();
  const response = await axios.post(
    `${getBaseUrl()}/v2/checkout/orders`,
    {
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: referenceId,
          description,
          amount: {
            currency_code: currency,
            value: Number(amount).toFixed(2),
          },
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
}

export async function captureOrder(orderId) {
  const token = await getAccessToken();
  const response = await axios.post(
    `${getBaseUrl()}/v2/checkout/orders/${orderId}/capture`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
}

export function getPublicClientId() {
  return process.env.PAYPAL_CLIENT_ID || null;
}
