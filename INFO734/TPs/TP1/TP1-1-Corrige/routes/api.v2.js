const express = require('express');
const router = express.Router();

router.get('/get/:param1', function (req, res, next) {

    /**
     * Fonction pour transformer un string en hexadécimal
     * @param str Le string à convertir
     * @return Le string converti
     */
    function toHex(str) {
        let result = '';
        for (let i=0; i<str.length; i++) {
            result += str.charCodeAt(i).toString(16);
        }
        return result;
    }

    res.json(toHex(req.params.param1));
})

router.post('/post', function (req, res, next) {

    const obj = {};
    for (let key in req.body) {
        obj[req.body[key]] = key;
    }

    res.json(obj);
})

router.put('/put/:timestamp', function (req, res, next) {

    const dateFromTimestamp = new Date(req.params.timestamp);
    const dateFromBody = new Date(req.body.timestamp);

    const theDate = dateFromTimestamp.;
    res.json(`${theDate.getDate()}/${theDate.getMonth()}/${theDate.getFullYear()}`)
})

router.delete('/delete/:param1', function (req, res, next) {
    if (!isNaN(+req.params.param1)) {
        res.json((+req.params.param1 % 2) === 0);
    } else {
        res.json(undefined);
    }
})

// Utilisé pour exporter le router comme module
module.exports = router;
