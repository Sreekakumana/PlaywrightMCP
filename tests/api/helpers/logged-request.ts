import { test, APIRequestContext, APIResponse } from '@playwright/test';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

function pretty(text: string) {
  try {
    return JSON.stringify(JSON.parse(text), null, 2);
  } catch {
    return text;
  }
}

// Sends a request and records the full exchange in the test's stdout and as an
// attachment, so every call is visible per test in the HTML report.
export async function send(
  request: APIRequestContext,
  method: Method,
  path: string,
  data?: unknown,
): Promise<APIResponse> {
  const start = Date.now();
  const response = await request.fetch(path, { method, data });
  const elapsed = Date.now() - start;

  const lines = [
    `--> ${method} ${response.url()}`,
    ...(data !== undefined ? ['Request body:', JSON.stringify(data, null, 2)] : []),
    `<-- ${response.status()} ${response.statusText()} (${elapsed} ms)`,
    `Content-Type: ${response.headers()['content-type'] ?? '(none)'}`,
    'Response body:',
    pretty(await response.text()),
  ];
  const log = lines.join('\n');

  console.log(`${log}\n`);
  await test.info().attach(`${method} ${path} -> ${response.status()}`, {
    body: log,
    contentType: 'text/plain',
  });

  return response;
}
