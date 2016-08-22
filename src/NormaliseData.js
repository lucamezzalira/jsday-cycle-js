export function normaliseData(data){ 
    let finalData = [];

    data.sort((a,b) => {
        if(a.towards > b.towards)
            return 1
        if(a.towards < b.towards)
            return -1
            
        return 0
    }).sort((a, b) => {
        return a - b;
    }).map((item, i, arr) => {
        if(item.towards === "" || !item.towards)
            return;
        
        if(finalData.length === 0 ||  finalData.findIndex(val => val.destination === item.towards) < 0)
            finalData.push({lineId: item.lineId, destination: item.towards, trains:[]});
        
        finalData[finalData.length-1].trains.push(item);
    });
 
   return finalData
}