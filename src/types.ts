import { HttpHandlerOptions, RequestHandler } from '@aws-sdk/types';
import type { NodeHttpHandlerOptions } from '@smithy/node-http-handler';
import type { HttpsProxyAgentOptions } from 'hpagent';

type ConfigWithRequestHandler = {
  config: {
    requestHandler: RequestHandler<any, any, HttpHandlerOptions>;
  };
};

export type ClientWithConfig<T> = T extends ConfigWithRequestHandler
  ? T
  : never;

/**
 * Set of options that can be passed to `addProxyToClient`
 */
export interface AddProxyOptions
  extends Pick<NodeHttpHandlerOptions, 'connectionTimeout' | 'socketTimeout'> {
  /**
   * Throw an error if no proxy is found in the environment.
   *
   * @default true
   */
  throwOnNoProxy?: boolean;
  /**
   * Toggles logging
   *
   * @default false
   */
  debug?: boolean;
  /**
   * Can be specified in the event you have both http_proxy and
   * https_proxy set, and would like to override the default behavior
   * of the http_proxy taking precedence.
   *
   * @default false
   */
  httpsOnly?: boolean;
  /**
   * The URL for the HTTP proxy server.
   * If not specified, the value of `process.env.http_proxy` or `process.env.HTTP_RPOXY` will be used.
   */
  httpProxy?: string;
  /**
   * The URL for the HTTPS proxy server.
   * If not specified, the value of `process.env.https_proxy` or `process.env.HTTPS_RPOXY` will be used.
   */
  httpsProxy?: string;
  /**
   * Options to be provided to the proxy agent. This can be used for modifyi
   */
  agentOptions?: Partial<HttpsProxyAgentOptions>;
}
