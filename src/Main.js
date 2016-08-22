import {run} from '@cycle/xstream-run';
import {makeDOMDriver} from '@cycle/dom';
import {makeHTTPDriver} from '@cycle/http';
let app = require('./App').default;

const drivers = {
    DOM: makeDOMDriver("#app"),
    HTTP: makeHTTPDriver()
}

run(app, drivers)
