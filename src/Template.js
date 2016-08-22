import {option, ul, li, h1, h2, h3, select, div, p, span} from '@cycle/dom';
import moment from 'moment';

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
    console.log(data);
    return div(`.destination-station .${data.lineId}`, [
        h2(data.destination),
        ul(".destination-trains-available", data.trains.map(item => getTrainData(item)))
    ]);
}

function renderTrainsData(data){
    return div(".all-stations", data.map(item => getDestinationStation(item)));
}

export default function getBody(results){
    let selectedLine = results[0].length > 0 ? 'Selected line: ' + results[0] : "";
       
    return div(".container", [
                h1("#title", ["Reactive Live London Tube trains status"]),
                select("#lines", [
                    option({attrs: { value: 'piccadilly' }}, ["Piccadilly line"]),
                    option({attrs: { value: 'northern' }}, ["Northern line"]),
                    option({attrs: { value: 'bakerloo' }}, ["Bakerloo line"]),
                    option({attrs: { value: 'central' }}, ["Central line"]),
                    option({attrs: { value: 'district' }}, ["District line"]),
                    option({attrs: { value: 'circle' }}, ["Circle line"]),
                    option({attrs: { value: 'victoria' }}, ["Victora line"]),
                ]),
                h3("#selectedLine", [selectedLine]),            
                renderTrainsData(results[1])
            ]);

}
