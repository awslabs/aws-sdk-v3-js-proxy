import type { HttpHandler } from '@aws-sdk/protocol-http';

type ConfigWithRequestHandler = {
  config: {
    requestHandler: HttpHandler;
  };
};

export type ClientWithConfig<T> = T extends ConfigWithRequestHandler
  ? T
  : never;

/**
 * Set of options that can be passed to `addProxyToClient`
 */
export interface AddProxyOptions {
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
}
