import React, { Component } from 'react';

const dataTable = [
    {
        id: 1,
        date: '1-03-2018',
        oil_total: Math.random() * 1000,
        stock1: Math.random() * 1000 / 2,
        stock2: Math.random() * 1000 / 2,
        r1: Math.random() * 1000 / 2,
        r2: Math.random() * 1000 / 2,
        s1: Math.random(),
        s2: Math.random(),
        lstock1: Math.random() * 100000,
        lstock2: Math.random() * 100000
    },
    {
        id: 2,
        date: '2-03-2018',
        oil_total: Math.random() * 1000,
        stock1: Math.random() * 1000 / 2,
        stock2: Math.random() * 1000 / 2,
        r1: Math.random() * 1000 / 2,
        r2: Math.random() * 1000 / 2,
        s1: Math.random(),
        s2: Math.random(),
        lstock1: Math.random() * 100000,
        lstock2: Math.random() * 100000
    }
];

export default dataTable;