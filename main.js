import app from './public/app.js';
import { _runtime$ } from './lib/Store.js';

window._runtime$ = _runtime$
window._runtime$.render(app, document.getElementById('app'))
// document.getElementById('app').append(app());

