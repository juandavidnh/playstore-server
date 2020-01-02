const express = require('express');
const morgan = require('morgan');
const playstore = require('./playstore.js');

const app = express();

app.use(morgan('dev'));

app.get('/apps', (req, res) => {
    const {genres = '', sort} = req.query;

    if(genres){
        if(!['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'].includes(genres)){
            return res
                .status(400)
                .send('Genre not found')
        }
    }

    if(sort){
        if(!['Rating', 'App'].includes(sort)){
            return res
                .status(400)
                .send('Sort must be by rating or app')
        }
    }

    let results = playstore
            .filter(app =>
                app
                .Genres
                .includes(genres));
    
    if(sort){
        results
            .sort((a, b) => {
                return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
            })
    }

    res.json(results);
})

module.exports = app;