import Rx from 'rx';
let getBody = require('./Template').default;

const BASE_URL = "https://api.tfl.gov.uk/line/";
const DEFAULT_LINE = "piccadilly";

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

function intent(_DOM){
    let dropDownChange$ = _DOM.select("#lines").events("change");

    return {
        line$: dropDownChange$.map(evt => evt.target.value)
    }  
}

function model(_response$, _actions){
   let state$ = _response$.map(data => normaliseData(data.trains));
   return state$;
}

function view(_states$){
    return _states$.map(state => getBody(state))
}

const networking = {
    processResponse(_HTTP){
        return _HTTP.switch()
                    .filter(res => res.request.url.indexOf(BASE_URL) === 0)
                    .map(res => {
                        
                      return {trains: JSON.parse(res.text)}
                    })
    },
    
    getRequestURL(line$){
        return line$.startWith(DEFAULT_LINE)
                    .map(line => {
                        return {
                            url: `${BASE_URL}${line}/arrivals?app_id=a2420191&app_key=b81115a21d9e11449d8fffd165644709`
                        }
                    });
    }
}

export default function app(_drivers){
    const response$ = networking.processResponse(_drivers.HTTP);
    const actions = intent(_drivers.DOM);
    const state$ = model(response$, actions);
    const vtree$ = view(state$);
    const trainsRequest$ = networking.getRequestURL(actions.line$);

    return {
        DOM: vtree$,
        HTTP: trainsRequest$
    };
}