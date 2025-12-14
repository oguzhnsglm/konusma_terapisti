#!/usr/bin/env node
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import open from 'open';

const PROBE_PORTS = [19006, 19007, 19008, 19009, 19010];
const LISTEN_PORT = 3000;

async function probePort(port) {
  try {
    const response = await fetch(`http://localhost:${port}`, { method: 'GET' });
    if (!response.ok) return false;
    const contentType = response.headers.get('content-type') || '';
    return contentType.includes('text/html');
  } catch {
    return false;
  }
}

async function findTargetPort() {
  for (const port of PROBE_PORTS) {
    const ok = await probePort(port);
    if (ok) {
      return port;
    }
  }
  return PROBE_PORTS[0];
}

async function start() {
  const targetPort = await findTargetPort();
  const target = `http://localhost:${targetPort}`;

  const app = express();
  app.use(
    '/',
    createProxyMiddleware({
      target,
      changeOrigin: true,
      ws: true,
      logLevel: 'warn',
    }),
  );

  app.listen(LISTEN_PORT, () => {
    console.log(`Proxy listening on http://localhost:${LISTEN_PORT} -> ${target}`);
    open(`http://localhost:${LISTEN_PORT}`).catch(() => {});
  });
}

start().catch((err) => {
  console.error('Proxy failed to start', err);
  process.exit(1);
});
