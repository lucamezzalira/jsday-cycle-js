import ReactDOM from 'react-dom';
import React from 'react';

function makeReactDriver(container){
    let DOMContainer = document.getElementById(container);
    return function reactDriver(vtree$){
        vtree$.subscribe(tree => ReactDOM.render(tree, DOMContainer))
        
        return {
            ReactDOM: vtree$,
            events: []
        }
    }
}

module.exports = {
    makeReactDriver
}