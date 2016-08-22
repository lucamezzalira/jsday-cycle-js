const BASE_URL = "https://api.tfl.gov.uk/line/";
const INTERVAL_TIME = 5000;
const HTTP_ARRIVALS_CATEGORY = "arrivals"
const APP_ID = "a2420191";
const APP_KEY = "b81115a21d9e11449d8fffd165644709";

export default {
    processResponse(_HTTP){
        console.log(_HTTP)
        let response = _HTTP.select('arrivals')
                        .flatten()
                        .map(res => {
                            return {trains: JSON.parse(res.text)}
                        })

        return response;
    },
    
    getRequestURL(line$, defaultLine){    
        let lineURL$ = line$
                        .startWith(defaultLine)
                        .map(line => {
                            return {
                                url: `${BASE_URL}${line.value}/arrivals`,
                                method: 'GET',
                                category: HTTP_ARRIVALS_CATEGORY,
                                headers: {
                                    "Content-Type": "text/plain"
                                },
                                query:{
                                    "app_id": APP_ID,
                                    "app_key": APP_KEY
                                }
                            }
                        })
        return lineURL$;
    }
}
