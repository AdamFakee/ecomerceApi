'use strict';


const _ = require('lodash');

// filter data with specificed fields
const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields);
}

// ['a', 'b'] => { 'a': 1, 'b': 1}
const getSelectData = ( select = [] ) => {
    return Object.fromEntries( select.map( el => [ el, 1 ]));
}

// ['a', 'b'] => { 'a': 0, 'b': 0}
const unGetSelectData = ( select = [] ) => {
    return Object.fromEntries( select.map( el => [ el, 0 ]));
}

/*
    {
        a: null,
        b: undefined,
        c: xxx,
        d: {
            e: null,
            h: xxx
        }
    }
    => 
    {
        c: xxx,
        d: {
            h: xxx
        }    
    }
*/
const removeUndefinedObject = obj => {
    Object.keys( obj ).forEach( key => {
        if( !obj[ key ] ) {
            delete obj[ key ]
        } else if( typeof obj[key] === 'object' && !Array.isArray(key) ) {
            const removedObj = removeUndefinedObject( obj[ key ] );
            Object.keys( removedObj ).forEach( nestKey => {
                if( !obj[ nestKey ]) {
                    delete obj[ nestKey ]
                }
            })
        }
    })
    return obj
}

/*
    {
        a: xxx,
        b: xxx,
        c: {
            d: xxx,
            e: xxx
        }
    }
    => 
    {
        a: xxx,
        b: xxx,
        'c.d': xxx,
        'c.e': xxx
    }
*/
const convertNestedObject = obj => {
    const result = {}

    Object.keys(obj).forEach( key => {
        if( typeof obj[key] === 'object' && !Array.isArray(key) ) {
            const nestedObj = convertNestedObject( obj[key] )
            Object.keys( nestedObj ).forEach( nestedKey => {
                result[`${key}.${nestedKey}`] = nestedObj[ nestedKey ]
            })
        } else {
            result[ key ] = obj[ key ]
        }
    })

    return result
} 

module.exports = {
    getInfoData, getSelectData, unGetSelectData, convertNestedObject, removeUndefinedObject
}