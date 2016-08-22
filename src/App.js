import xs from 'xstream';
import {normaliseData} from './NormaliseData';
let getBody = require('./Template').default;
let networking = require('./Networking').default;

const DEFAULT_LINE = {
    label: "Piccadilly line",
    value: "piccadilly"
}

function intent(_DOM){
    let dropDownChange$ = _DOM.select("#lines").events("change");

    return {
        line$: dropDownChange$.map(evt => {
            return {
                label: evt.target[evt.target.selectedIndex].innerHTML,
                value: evt.target.value
            }
        })
    }  
}

function model(_response$, _actions){
   let trains$ = _response$.map(data => normaliseData(data.trains))
   let line$ = _actions.line$.startWith(DEFAULT_LINE).map(line => line.label);
   let state$ = xs.combine(line$, trains$);

   return state$;
}

function view(_states$){
    return _states$.map(state => getBody(state))
}

export default function app(_drivers){
    const response$ = networking.processResponse(_drivers.HTTP);
    const actions = intent(_drivers.DOM);
    const state$ = model(response$, actions);
    const vtree$ = view(state$);
    const trainsRequest$ = networking.getRequestURL(actions.line$, DEFAULT_LINE);
    
    return {
        DOM: vtree$,
        HTTP: trainsRequest$
    };
}