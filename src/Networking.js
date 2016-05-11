import Rx from 'rx';

const BASE_URL = "https://api.tfl.gov.uk/line/";
const INTERVAL_TIME = 5000;

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
                            url: `${BASE_URL}${line.value}/arrivals?app_id=a2420191&app_key=b81115a21d9e11449d8fffd165644709`
                        }
                    })
                    
        let final$ = lineURL$.combineLatest(interval$, (url, int) => url);
        return final$
    }
}
