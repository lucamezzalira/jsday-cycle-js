import {run} from '@cycle/core';
import {makeDOMDriver} from '@cycle/dom';
import {makeHTTPDriver} from '@cycle/http';
import {rerunner, restartable} from 'cycle-restart';
let app = require('./App').default;
import {makeReactDriver} from './ReactDriver';

const drivers = {
    DOM: restartable(makeDOMDriver(document.querySelector("#cont")), {pauseSinksWhileReplaying: false}),
    HTTP: restartable(makeHTTPDriver()),
    ReactDOM: makeReactDriver("contReact") 
}

let rerun = rerunner(run);
rerun(app, drivers);

if (module.hot) {
  module.hot.accept('./App', () => {
    app = require('./App').default;
    rerun(app, drivers);
  });
}