import Rx from 'rx';
import moment from 'moment';
import Cycle from '@cycle/core';
import {makeDOMDriver, option, ul, li, h1, h2, select, div, p, span, button} from '@cycle/dom';
import {makeHTTPDriver} from '@cycle/http';

function getTrainData(data){
    return li(".train", [
        div(".train-data",
        [
            p(".stationName .col", [span("station: "), data.stationName]),
            p(".platform", [span("platform: "), data.platformName]),
            p(".current-location", [span("current location: "), data.currentLocation]),
            p(".arrival-time: ", [span("expected arrival time: "), moment(new Date(data.expectedArrival)).format("HH:MM - Do MMM YYYY")])
        ]
    )])
}

function getDestinationStation(data){
    return div(`.destination-station .${data.lineId}`, [
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
    }).sort((a, b) => {
        return a - b;
    }).map((item, i, arr) => {
        if(item.destinationName === "" || !item.destinationName)
            return;
        
        if(finalData.length === 0 ||  finalData.findIndex(val => val.destination === item.destinationName) < 0)
            finalData.push({lineId: item.lineId, destination: item.destinationName, trains:[]});
        
        finalData[finalData.length-1].trains.push(item);
    });
                
   return finalData
}

function getBody(results){
    return div(".container", [
                h1("#title", ["Reactive Live London Tube trains status"]),
                select("#lines", [
                    option({ value: 'circle' }, ["Circle line"]),
                    option({ value: 'northern' }, ["Northern line"]),
                    option({ value: 'bakerloo' }, ["Bakerloo line"]),
                    option({ value: 'central' }, ["Central line"]),
                    option({ value: 'district' }, ["District line"]),
                    option({ value: 'piccadilly' }, ["Piccadilly line"]),
                    option({ value: 'victoria' }, ["Victora line"]),
                ]),
                renderTrainsData(normaliseData(results))
            ])           
}

function main(drivers) {
    const API_URL = "https://api.tfl.gov.uk/line/";
    let currentLine = "circle";
    
    let dropDownChange$ = drivers.DOM.select("#lines")
                                .events("change");                                                              
    let linesRequest$ = dropDownChange$.startWith({target: {value: currentLine}})
                                       .map(evt => {
                                            if(evt.target.value)
                                                currentLine = evt.target.value;

                                            return {
                                                url: `${API_URL}${currentLine}/arrivals?app_id=a2420191&app_key=b81115a21d9e11449d8fffd165644709`
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