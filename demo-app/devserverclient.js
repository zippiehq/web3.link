const BaseClient = require('webpack-dev-server/client/clients/BaseClient')

module.exports = class WebsocketClient extends BaseClient {
  constructor(url) {
    super();
    this.client = new WebSocket(url.replace(/^https/, 'ws').replace(/^http/, 'ws'));

    this.client.onerror = (err) => {
      // TODO: use logger to log the error event once client and client-src
      // are reorganized to have the same directory structure
    };
  }

  static getClientPath(options) {
    return require.resolve('./devserverclient');
  }

  onOpen(f) {
    this.client.onopen = f;
  }

  onClose(f) {
    this.client.onclose = f;
  }

  // call f with the message string as the first argument
  onMessage(f) {
    this.client.onmessage = (e) => {
      f(e.data);
    };
  }
};