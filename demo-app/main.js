
import { h, render, Component } from 'preact';
import htm from 'htm';

// Initialize htm with Preact
const html = htm.bind(h);

function App (props) {
   return html`<h1>Hello ${props.name}!</h1>`;
}

render(html`<${App} name="World" />`, document.body);