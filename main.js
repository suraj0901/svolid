import app from './public/app.js';
import { render } from './lib/Store.js';

render(app, document.getElementById('app'))
// document.getElementById('app').append(app());

