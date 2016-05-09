import Cycle from '@cycle/core';
import {makeDOMDriver} from '@cycle/dom';
import {makeHTTPDriver} from '@cycle/http';
let app = require('./App').default;

const drivers = {
    DOM: makeDOMDriver("body"),
    HTTP: makeHTTPDriver()
}

Cycle.run(app, drivers);