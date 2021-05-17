import { NodeHttpHandler } from '@aws-sdk/node-http-handler';
import ProxyAgent from 'proxy-agent';
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
    noProxyException = true,
  }: AddProxyOptions = {}
): T => {
  const httpProxy = getHttpProxy();
  const httpsProxy = getHttpsProxy();
  const log = debug ? console.log : () => null;

  if (httpProxy && httpsProxy && !httpsOnly) {
    console.warn(
      'Both HTTP and HTTPS proxy found in enviornment, defaulting to HTTP\n' +
        'To use the HTTPS proxy instead, set the `httpsOnly` option to `true`'
    );
  }

  if (httpProxy && !httpsOnly) {
    log(`Setting http proxy to ${httpProxy}`);
    client.config.requestHandler = new NodeHttpHandler({
      httpAgent: new ProxyAgent(httpProxy),
    });
  } else if (httpsProxy) {
    log(`Setting https proxy to ${httpsProxy}`);
    client.config.requestHandler = new NodeHttpHandler({
      httpsAgent: new ProxyAgent(httpsProxy),
    });
  } else if (noProxyException) {
    log(
      'No proxy found in env, and noProxyException is set to true, throwing error'
    );
    throw new Error(
      'Unable to add proxy to AWS SDK client. No proxy found in process.env'
    );
  }

  return client;
};
