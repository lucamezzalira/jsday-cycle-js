import Rx from 'rx';
import moment from 'moment';
import Cycle from '@cycle/core';
import {makeDOMDriver, option, ul, li, h2, select, div, p, span} from '@cycle/dom';
import {makeHTTPDriver} from '@cycle/http';

function getTrainData(data){
    return li(".train", [
        div(".train-data",
        [
            p(".stationName", [span("station: "), data.stationName]),
            p(".platform", [span("platform: "), data.platformName]),
            p("current-location", [span("current location: "), data.currentLocation]),
            p(".arrival-time: ", [span("expected arrival time: "), moment(new Date(data.expectedArrival)).format("HH:MM - Do MMM YYYY")])
        ]
    )])
}

function getDestinationStation(data){
    return div(".destination-station", [
        h2(data.destination),
        ul(".destination-trains-available", data.trains.map(item => getTrainData(item)))
    ]);
}

function renderTrainsData(data){
    return div(".all-stations", data.map(item => getDestinationStation(item)));
}

function normaliseData(data){
    let finalData = [];

    data.sort((a,b) => {
        if(a.destinationName > b.destinationName)
            return 1
        if(a.destinationName < b.destinationName)
            return -1
            
        return 0
    }).map((item, i, arr) => {
        if(finalData.length === 0 || item.destinationName !== finalData[finalData.length-1].destination)
            finalData.push({destination: item.destinationName, trains:[]});
        
        finalData[finalData.length-1].trains.push(item);
    });
                
   return finalData
}

function getBody(results){
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
                renderTrainsData(normaliseData(results))
            ])           
}

function main(drivers) {
   // let API_URL = "data.json"; //for local data
   const API_URL = "https://api.tfl.gov.uk/line/";

    let linesRequest$ = drivers.DOM.select("#lines").events("change")
                                .startWith({target: 
                                    {value: "district"}
                                })
                                .map(evt => {
                                    let selectedLine = evt.target.value;
                                    
                                    return {
                                        //url: API_URL
                                        url: API_URL + selectedLine + "/arrivals?app_id=a2420191&app_key=b81115a21d9e11449d8fffd165644709"
                                    }
                                });
    let vtree$ = drivers.HTTP
                .filter(res => res.request.url.indexOf(API_URL) === 0)
                .mergeAll()
                .map(res => {
                    let body = div();
                    let data = res.text;
                    if(data)
                        body = getBody(JSON.parse(data));
                    
                    return body;
                });

    return {
        DOM: vtree$,
        HTTP: linesRequest$
    };
    
}

const drivers = {
    DOM: makeDOMDriver("body"),
    HTTP: makeHTTPDriver()
}

Cycle.run(main, drivers);