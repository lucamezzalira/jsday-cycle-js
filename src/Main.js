import {run} from '@cycle/core';
import {makeDOMDriver} from '@cycle/dom';
import {makeHTTPDriver} from '@cycle/http';
import {rerunner, restartable} from 'cycle-restart';
let app = require('./App').default;

const drivers = {
    DOM: restartable(makeDOMDriver("body"), {pauseSinksWhileReplaying: false}),
    HTTP: restartable(makeHTTPDriver())
}

let rerun = rerunner(run);
rerun(app, drivers);

if (module.hot) {
  module.hot.accept('./App', () => {
    app = require('./App').default;
    rerun(app, drivers);
  });
}