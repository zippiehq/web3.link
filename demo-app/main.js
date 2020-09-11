import { h, render, Component } from "preact";
import htm from "htm";
import App from "./App";
window.getComputedStyle = window.getComputedStyleAsync;
// Initialize htm with Preact
const html = htm.bind(h);

render(html`<${App} name="World" />`, document.body);
