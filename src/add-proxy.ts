import { NodeHttpHandler } from '@smithy/node-http-handler';
import { HttpsProxyAgent } from 'hpagent';
import { AddProxyOptions, ClientWithConfig } from './types';

export const getHttpProxy = (): string =>
  process.env.http_proxy || process.env.HTTP_PROXY || '';

export const getHttpsProxy = (): string =>
  process.env.https_proxy || process.env.HTTPS_PROXY || '';

export const addProxyToClient = <T>(
  client: ClientWithConfig<T>,
  {
    debug = false,
    httpsOnly = false,
    throwOnNoProxy = true,
    agentOptions = {},
    ...opts
  }: AddProxyOptions = {}
): T => {
  const httpProxy = getHttpProxy();
  const httpsProxy = getHttpsProxy();
  const httpAgent = httpProxy
    ? new HttpsProxyAgent({ proxy: httpProxy, ...agentOptions })
    : undefined;
  const httpsAgent = httpsProxy
    ? new HttpsProxyAgent({ proxy: httpsProxy, ...agentOptions })
    : undefined;
  const log = debug ? console.log : () => null;

  if (httpProxy && httpsProxy) {
    if (httpsOnly) {
      log(
        `Setting https proxy to ${httpsProxy} (httpsOnly enabled with both https and http found in env)`
      );
      client.config.requestHandler = new NodeHttpHandler({
        httpAgent: httpsAgent,
        httpsAgent,
        ...opts,
      });
    } else {
      log(
        `Setting http proxy to ${httpProxy} and https proxy to ${httpsProxy}`
      );
      client.config.requestHandler = new NodeHttpHandler({
        httpAgent,
        httpsAgent,
        ...opts,
      });
    }

    return client;
  }

  if (httpProxy && !httpsOnly) {
    log(`Setting http proxy to ${httpProxy}`);
    client.config.requestHandler = new NodeHttpHandler({
      httpAgent,
      httpsAgent: httpAgent,
      ...opts,
    });
  } else if (httpsProxy) {
    log(`Setting https proxy to ${httpsProxy}`);
    client.config.requestHandler = new NodeHttpHandler({
      httpAgent: httpsAgent,
      httpsAgent,
      ...opts,
    });
  } else if (throwOnNoProxy) {
    log(
      'No proxy found in env, and throwOnNoProxy is set to true, throwing error'
    );
    throw new Error(
      'Unable to add proxy to AWS SDK client. No proxy found in process.env'
    );
  }

  return client;
};
