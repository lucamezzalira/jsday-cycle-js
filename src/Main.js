import Rx from 'rx';
import Cycle from '@cycle/core';
import CycleDOM from '@cycle/dom';
import {makeHTTPDriver} from '@cycle/http';

function body(value){
    return CycleDOM.div(".container", [
                CycleDOM.button("#btn", ["click me"]),
                CycleDOM.p(value + " value from Rx.JS")
            ])           
}

function main(drivers) {
    return {
        DOM: drivers.DOM.select('#btn').events('click')
            .startWith(false)
            .map(_ => {
                return body(Math.floor(Math.random()*1000));
            })
        
        /*Rx.Observable.interval(1000)
            .map(value => CycleDOM.p(`${value} value from Rx.JS`))*/       
        
    }
}

const drivers = {
    DOM: CycleDOM.makeDOMDriver("#container"),
    HTTP: makeHTTPDriver()
}

Cycle.run(main, drivers);