

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register(document.location.origin + '/sw.js', { scope: document.location.origin}).then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
} 
 
class Sanitizer {
  constructor(origin) {

  }
}


class IDPScript extends HTMLElement {
  constructor() {
    // If you define a constructor, always call super() first!
    // This is specific to CE and required by the spec.
    super();  
    import(/* webpackChunkName: 'worker-dom' */ '@ampproject/worker-dom/dist/amp/main.mjs').then((res) => {
        res.upgradeElement(this, document.location.origin + '/v0.idp-framework.eth/domworker.js')
    })
    console.log('idp src ', this.getAttribute('src'))
  }
}

window.customElements.define('idp-script', IDPScript);

// origin == parse window.location
// popovers are real same-origin iframes also validated
// dweb.js provides abilitty to launch secured web workers (services) and IPC with them
// self-iframe for speed and switching between pages?

