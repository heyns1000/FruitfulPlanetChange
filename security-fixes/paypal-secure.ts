// SECURITY-HARDENED PayPal Integration
// Fixed: Removed hardcoded credentials (CRITICAL VULNERABILITY)
// Maintains PayPal SDK integration integrity

import {
  Client,
  Environment,
  LogLevel,
  OAuthAuthorizationController,
  OrdersController,
} from "@paypal/paypal-server-sdk";
import { Request, Response } from "express";

/* Environment Variable Validation */

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `CRITICAL: Missing required environment variable: ${name}\n` +
      `Please set ${name} in your environment or .env file.\n` +
      `DO NOT hardcode credentials in source code.`
    );
  }
  return value;
}

/* PayPal Controllers Setup */

// SECURITY FIX: No fallback credentials - strict environment variable requirement
const PAYPAL_CLIENT_ID = requireEnv('PAYPAL_CLIENT_ID');
const PAYPAL_CLIENT_SECRET = requireEnv('PAYPAL_CLIENT_SECRET');

const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: PAYPAL_CLIENT_ID,
    oAuthClientSecret: PAYPAL_CLIENT_SECRET,
  },
  timeout: 0,
  environment:
    process.env.NODE_ENV === "production"
      ? Environment.Production
      : Environment.Sandbox,
  logging: {
    logLevel: LogLevel.Info,
    logRequest: {
      logBody: true,
    },
    logResponse: {
      logHeaders: true,
    },
  },
});

const ordersController = new OrdersController(client);
const oAuthAuthorizationController = new OAuthAuthorizationController(client);

/* Token generation helpers */

export async function getClientToken() {
  const auth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`,
  ).toString("base64");

  const { result } = await oAuthAuthorizationController.requestToken(
    {
      authorization: `Basic ${auth}`,
    },
    { intent: "sdk_init", response_type: "client_token" },
  );

  return result.accessToken;
}

/*  Process transactions */

export async function createPaypalOrder(req: Request, res: Response) {
  try {
    const { amount, currency, intent } = req.body;

    // Enhanced validation
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res
        .status(400)
        .json({
          error: "Invalid amount. Amount must be a positive number.",
        });
    }

    // Maximum transaction amount validation (security)
    const maxAmount = parseFloat(process.env.MAX_TRANSACTION_AMOUNT || "10000");
    if (parseFloat(amount) > maxAmount) {
      return res
        .status(400)
        .json({
          error: `Amount exceeds maximum allowed (${maxAmount})`,
        });
    }

    if (!currency) {
      return res
        .status(400)
        .json({ error: "Invalid currency. Currency is required." });
    }

    // Currency whitelist (security)
    const allowedCurrencies = ['USD', 'EUR', 'GBP', 'ZAR'];
    if (!allowedCurrencies.includes(currency)) {
      return res
        .status(400)
        .json({ error: `Currency must be one of: ${allowedCurrencies.join(', ')}` });
    }

    if (!intent) {
      return res
        .status(400)
        .json({ error: "Invalid intent. Intent is required." });
    }

    // Intent whitelist (security)
    if (!['CAPTURE', 'AUTHORIZE'].includes(intent)) {
      return res
        .status(400)
        .json({ error: "Intent must be CAPTURE or AUTHORIZE" });
    }

    const collect = {
      body: {
        intent: intent,
        purchaseUnits: [
          {
            amount: {
              currencyCode: currency,
              value: amount,
            },
          },
        ],
      },
      prefer: "return=minimal",
    };

    const { body, ...httpResponse } =
      await ordersController.createOrder(collect);

    const jsonResponse = JSON.parse(String(body));
    const httpStatusCode = httpResponse.statusCode;

    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    // Don't expose internal error details to client
    res.status(500).json({ error: "Failed to create order." });
  }
}

export async function capturePaypalOrder(req: Request, res: Response) {
  try {
    const { orderID } = req.params;

    // Validate orderID format (security)
    if (!orderID || typeof orderID !== 'string' || orderID.length < 10) {
      return res
        .status(400)
        .json({ error: "Invalid order ID" });
    }

    const collect = {
      id: orderID,
      prefer: "return=minimal",
    };

    const { body, ...httpResponse } =
      await ordersController.captureOrder(collect);

    const jsonResponse = JSON.parse(String(body));
    const httpStatusCode = httpResponse.statusCode;

    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to capture order:", error);
    // Don't expose internal error details to client
    res.status(500).json({ error: "Failed to capture order." });
  }
}

export async function loadPaypalDefault(req: Request, res: Response) {
  try {
    const clientToken = await getClientToken();
    res.json({
      clientToken,
    });
  } catch (error) {
    console.error("Failed to get client token:", error);
    res.status(500).json({ error: "Failed to initialize payment" });
  }
}
