const express = require("express");
const app = express();
const https = require('https');

const pug = require('pug');

app.set('view engine', 'pug');

https.get('https://capi.inhaabit.com/load/64f67627adf0765d30a92a52', (res) => {
  res.on('data', (data) => {
    const saveData = JSON.parse(data);
    saveData.extra.project = {
      "shelving": [
        {
          "name": "460 x 1830 x 1880",
          "quantity": 4,
          "cost": 2000,
          "sell": 3200
        },
        {
          "name": "460 x 910 x 1880",
          "quantity": 2,
          "cost": 24000,
          "sell": 40000
        },
        {
          "name": "610 x 1830 x 1880",
          "quantity": 1,
          "cost": 10,
          "sell": 30
        }
      ],
      "shelvingNotes": "231323",
      "options": [
        {
          "name": "Widgets",
          "cost": 0,
          "sell": 0,
          "quantity": 3
        },
        {
          "name": "Bracket 20x100",
          "cost": 0,
          "sell": 0,
          "quantity": 4
        },
        {
          "name": "Bracket 20x200",
          "cost": 0,
          "sell": 0,
          "quantity": 0
        }
      ],
      "optionsNotes": "optioiroiori",
      "quotation": {
        "Freight Inwards": {
          "sell": 0,
          "cost": 2
        },
        "Installation": {
          "sell": 0,
          "cost": 5
        },
        "Delivery": {
          "sell": 0,
          "cost": 20
        },
        "Total Investment": {
          "sell": 43230,
          "cost": 26012
        },
        "GP": {
          "sell": 66,
          "cost": 0
        }
      },
      "quotationNotes": "quiterorkokerok"
    };
    app.get('/', (req, res)=>{
      res.render(
        'page',
        saveData
      )
    });
  });
});

app.listen(3000);
