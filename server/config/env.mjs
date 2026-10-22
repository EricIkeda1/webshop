import { EnvHttpProxyAgent, setGlobalDispatcher } from "undici";
import { fileURLToPath } from "node:url";
try {
  if (!process.env.VERCEL)
    process.loadEnvFile(fileURLToPath(new URL("../../.env", import.meta.url)));
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
export const config = {
  token: process.env.MELHOR_ENVIO_TOKEN || "",
  originCep: process.env.SHIPPING_ORIGIN_CEP || "",
  userAgent: process.env.SHIPPING_USER_AGENT || "",
  sandbox: process.env.SHIPPING_SANDBOX !== "false",
  port: Number(process.env.PORT || 3000),
};

// Respect an explicitly configured corporate/hosting proxy without exposing it to the client.
if (
  process.env.HTTP_PROXY ||
  process.env.HTTPS_PROXY ||
  process.env.http_proxy ||
  process.env.https_proxy
)
  setGlobalDispatcher(new EnvHttpProxyAgent());
