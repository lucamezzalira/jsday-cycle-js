const BASE_URL = "https://api.tfl.gov.uk/line/";
const DEFAULT_LINE = "piccadilly";

export default {
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
