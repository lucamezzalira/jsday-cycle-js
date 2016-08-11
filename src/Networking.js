import Rx from 'rx';

const BASE_URL = "https://api.tfl.gov.uk/line/";
const INTERVAL_TIME = 5000;
const APP_ID = "a2420191";
const APP_KEY = "b81115a21d9e11449d8fffd165644709";

export default {
    processResponse(_HTTP){
        return _HTTP.switch()
                    .filter(res => res.request.url.indexOf(BASE_URL) === 0)
                    .map(res => {
                      return {trains: JSON.parse(res.text)}
                    })
    },
    
    getRequestURL(line$, defaultLine){
        let interval$ = Rx.Observable.interval(INTERVAL_TIME);
        let lineURL$ = line$
                    .startWith(defaultLine)
                    .map(line => {
                        return {
                            url: `${BASE_URL}${line.value}/arrivals`,
                            method: 'GET',
                            headers: {
                                "Content-Type": "text/plain"
                            },
                            query:{
                                "app_id": APP_ID,
                                "app_key": APP_KEY
                            }
                        }
                    })
                    
        let final$ = lineURL$.combineLatest(interval$, (url, int) => url);
        return final$; 
    }
}
