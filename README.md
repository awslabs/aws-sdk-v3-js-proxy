# AWS SDK v3 Proxy

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Code Coverage][codecov-img]][codecov-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]

> A wrapper for adding proxy support to [AWS SDK v3](https://github.com/aws/aws-sdk-js-v3) clients

This wrapper adds a proxy configuration to AWS SDK clients by checking environment
variables and attaching the necessary request handler. By default, an error will
be thrown if no proxy is found in `process.env`, but also has options to not throw
which can be useful when developing other node utilities using this library.

**Note:** `http_proxy` and `HTTP_PROXY` take precedence over `https_proxy` and `HTTPS_PROXY`.
If you would like to change this behavior it can be specified in the [options](#options).

## Install

```bash
npm install aws-sdk-v3-proxy
```

## Usage

### HTTP Proxy

```ts
// process.env.HTTP_PROXY = 'http://127.0.0.1'
import { S3Client } from '@aws-sdk/client-s3';
import { addProxyToClient } from 'aws-sdk-v3-proxy';

const client = addProxyToClient(new S3Client({}));
// `client` now has HTTP proxy config at 'http://127.0.0.1'
```

or

```ts
import { S3Client } from '@aws-sdk/client-s3';
import { addProxyToClient } from 'aws-sdk-v3-proxy';

const client = addProxyToClient(new S3Client({}), {
  httpProxy: 'http://127.0.0.1',
});
// `client` now has HTTP proxy config at 'http://127.0.0.1'
```

### HTTPS Proxy

```ts
// process.env.HTTPS_PROXY = 'https://127.0.0.1'
import { S3Client } from '@aws-sdk/client-s3';
import { addProxyToClient } from 'aws-sdk-v3-proxy';

const client = addProxyToClient(new S3Client({}));
// `client` now has HTTPS proxy config at 'https://127.0.0.1'
```

or

```ts
import { S3Client } from '@aws-sdk/client-s3';
import { addProxyToClient } from 'aws-sdk-v3-proxy';

const client = addProxyToClient(new S3Client({}), {
  httpsProxy: 'https://127.0.0.1',
});
// `client` now has HTTPS proxy config at 'https://127.0.0.1'
```

### No Proxy with exception disabled

```ts
// process.env.HTTPS_PROXY = undefined
// process.env.HTTP_PROXY = undefined
import { S3Client } from '@aws-sdk/client-s3';
import { addProxyToClient } from 'aws-sdk-v3-proxy';

const client = addProxyToClient(new S3Client({}), { throwOnNoProxy: false });
// `client` has no proxy assigned and no error thrown
```

### Proxy with certs in header

```ts
// process.env.HTTPS_PROXY = 'https://127.0.0.1'
import { readFileSync } from 'fs';
import { S3Client } from '@aws-sdk/client-s3';
import { addProxyToClient } from 'aws-sdk-v3-proxy';

const client = addProxyToClient(new S3Client({}), {
  agentOptions: {
    ca: [readFileSync('custom-proxy-cert.pem').toString()],
  },
});

// `client` now has HTTPS proxy config at 'https://127.0.0.1' with ca `custom-proxy-cert.pem`
```

## API

### addProxyToClient(client, options?)

#### client

Type: `Object`

Any client from [@aws-sdk](https://github.com/aws/aws-sdk-js-v3).

#### options

Type: `object`

##### throwOnNoProxy

Type: `boolean`
Default: `true`

Throw an error if no proxy is found in the environment.

##### httpsOnly

Type: `boolean`
Default: `false`

Can be specified in cases where you have both http_proxy and https_proxy set, and would like to override the default behavior of the http_proxy taking precedence.

##### debug

Type: `boolean`
Default: `false`

Toggles additional logging for debugging.

##### httpProxy

Type: `string`

The URL for the HTTP proxy server.
If not specified, the value of `process.env.http_proxy` or `process.env.HTTP_RPOXY` will be used.

##### httpsProxy

The URL for the HTTPS proxy server.
If not specified, the value of `process.env.https_proxy` or `process.env.HTTPS_RPOXY` will be used.

##### agentOptions

Type: `HttpsProxyAgentOptions`

Used to pass specific options to the proxy agent.

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This project is licensed under the Apache-2.0 License.

[build-img]: https://github.com/awslabs/aws-sdk-v3-js-proxy/actions/workflows/release.yml/badge.svg
[build-url]: https://github.com/awslabs/aws-sdk-v3-js-proxy/actions/workflows/release.yml
[downloads-img]: https://img.shields.io/npm/dt/aws-sdk-v3-proxy
[downloads-url]: https://www.npmtrends.com/aws-sdk-v3-proxy
[npm-img]: https://img.shields.io/npm/v/aws-sdk-v3-proxy
[npm-url]: https://www.npmjs.com/package/aws-sdk-v3-proxy
[issues-img]: https://img.shields.io/github/issues/awslabs/aws-sdk-v3-js-proxy
[issues-url]: https://github.com/awslabs/aws-sdk-v3-js-proxy/issues
[codecov-img]: https://codecov.io/gh/awslabs/aws-sdk-v3-js-proxy/branch/main/graph/badge.svg
[codecov-url]: https://codecov.io/gh/awslabs/aws-sdk-v3-js-proxy
[semantic-release-img]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]: https://github.com/semantic-release/semantic-release
[commitizen-img]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]: http://commitizen.github.io/cz-cli/
