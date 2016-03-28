import Rx from 'rx';
import Cycle from '@cycle/core';
import {makeDOMDriver, option, ul, li, select, div} from '@cycle/dom';
import {makeHTTPDriver} from '@cycle/http';

function body(results){
    console.log("results", results.text);
    return div(".container", [
                select("#lines", [
                    option({ value: 'district' }, ["District line"]),
                    option({ value: 'northern' }, ["Northern line"]),
                    option({ value: 'bakerloo' }, ["Bakerloo line"]),
                    option({ value: 'circle' }, ["Circle line"]),
                    option({ value: 'central' }, ["Central line"]),
                    option({ value: 'piccadilly' }, ["Piccadilly line"]),
                    option({ value: 'victoria' }, ["Victora line"]),
                ]),
                ul(".tube-results")
            ])           
}

function main(drivers) {
    //let API_URL = 'https://api.tfl.gov.uk/line/district/arrivals?app_id=a2420191&app_key=b81115a21d9e11449d8fffd165644709';
    let API_URL = "data.json";
    let request$ = Rx.Observable.just({
        url: API_URL
    });
    let vtree$ = drivers.HTTP
                .filter(res => res.request.url === API_URL)
                .mergeAll()
                .startWith("loading...")
                .map(res => {
                    return body(res);
                });
    return {
        DOM: vtree$,
        HTTP: request$
    };
    
}

const drivers = {
    DOM: makeDOMDriver("body"),
    HTTP: makeHTTPDriver()
}

Cycle.run(main, drivers);