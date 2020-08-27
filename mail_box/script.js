"use strict";

fetch('mail.json')
    .then((res) => {
        return res.json()
    }).then((data) => {
        console.log(data)
    })