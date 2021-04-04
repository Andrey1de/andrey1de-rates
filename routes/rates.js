"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const rate_entities_1 = require("../rates/rate.entities");
const mock_file_service_1 = require("../rates/mock.file.service");
const logger_1 = require("../shared/logger");
const axios_1 = require("axios");
const http_status_codes_1 = require("http-status-codes");
const OK = http_status_codes_1.StatusCodes.OK;
const BAD_REQUEST = http_status_codes_1.StatusCodes.BAD_REQUEST;
const NOT_FOUND = http_status_codes_1.StatusCodes.NOT_FOUND;
const CREATED = http_status_codes_1.StatusCodes.CREATED;
const NO_CONTENT = http_status_codes_1.StatusCodes.NO_CONTENT;
const CONFLICT = http_status_codes_1.StatusCodes.CONFLICT;
const IM_A_TEAPOT = http_status_codes_1.StatusCodes.IM_A_TEAPOT;
//import RatesController from './rates/rate.controller';
const SPAN_MS = Number(process.env.SPAN_MS) || 1000 * 3600; // one hour
const RATE_DB_PATH = process.env.RATE_DB_PATH || './db/RatesDb.json';
const RATE_DB_DIR = process.env.RATE_DB_DIR || './db';
const router = express();
exports.default = router;
/*
*  ==========  INIT MOCK DATA	==========
*/
const RateUsd = {
    code: 'USD',
    name: 'USA Dollar',
    rate: 1.0,
    bid: 1.0,
    ask: 1.0,
    lastRefreshed: new Date(),
    stored: new Date()
};
const Mock = new mock_file_service_1.MockFileService();
const MapRates = new Map();
//First read of Rates
(async () => {
    let arr = Mock.init(RATE_DB_DIR, RATE_DB_PATH, [RateUsd]);
    MapRates.set(RateUsd.code, RateUsd);
    arr === null || arr === void 0 ? void 0 : arr.forEach(rate => MapRates.set(rate.code, rate));
})();
const getCode = (req) => {
    var _a;
    const code = '' + ((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.code);
    return ('' + code).toUpperCase().substr(0, 3);
};
async function tryGetYahoo(code) {
    if (code === 'USD')
        return RateUsd;
    try {
        let rate = MapRates.get(code);
        const dt0 = new Date().getTime();
        if (rate) {
            const storedTicks = new Date(rate.stored).getTime();
            const dt1 = Number(SPAN_MS) + storedTicks;
            const remain = Math.round((dt1 - dt0) / 1000);
            if (remain > 0) {
                logger_1.default.info(`Cache => ${rate.code}=${rate.rate} from Cache remain ${remain} sec to store `);
                return rate;
            }
        }
        const urlIn = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&` +
            `from_currency=${code}&to_currency=USD&apikey=55Y1508W05UYQN3G`;
        logger_1.default.info(urlIn);
        console.log(urlIn);
        //debugger;
        const config = {
            method: 'get',
            url: urlIn,
            headers: {
                Accept: '*/*'
                //        'Authorization': 'Bearer ' + token,
                //'Accept': 'routerlication/json,routerlication/text'
            }
        };
        const buildArray = (await axios_1.default(config)).data;
        const jsonRet = JSON.stringify(buildArray); //JSON.parse(buildArray);
        const arr = jsonRet.split(/\"\d. /);
        if (arr.length < 10) {
            throw `Request to Yahoo about currency ${code}failed `;
        }
        let codeReceived = ''; //arr[1].split(/\"/)[2];
        if (arr[1].split(/\"/).length < 3 || (codeReceived = arr[1].split(/\"/)[2]) != code) {
            throw `Request to Yahoo about currency ${code}failed `;
        }
        //0: "{"Realtime Currency Exchange Rate":{"
        //1: "From_Currency Code": "GBP", "
        //2: "From_Currency Name": "British Pound Sterling", "
        //3: "To_Currency Code": "USD", "
        //4: "To_Currency Name": "United States Dollar", "
        //5: "Exchange Rate": "1.37640000", "
        //6: "Last Refreshed": "2021-04-01 05:49:01", "
        //7: "Time Zone": "UTC", "
        //8: "Bid Price": "1.37634000", "
        //9: "Ask Price": "1.37644000"
        rate = new rate_entities_1.Rate();
        rate.code = code;
        // const body = jsonRet.data["Realtime Currency Exchange Rate"];
        rate.name = arr[2].split(/\"/)[2]; //'' + getProperty(jsonRet, "2. From_Currency Name");
        rate.rate = Number(arr[5].split(/\"/)[2]); // "5. Exchange Rate"));
        rate.lastRefreshed = new Date(arr[6].split(/\"/)[2]); //,"6. Last Refreshed"));
        rate.bid = Number(arr[8].split(/\"/)[2]); //"8. Bid Price"));
        rate.ask = Number(arr[9].split(/\"/)[2]); //"9. Ask Price"));
        rate.stored = new Date();
        MapRates.set(code, rate);
        const db = [...MapRates.values()];
        //    await this.save();
        logger_1.default.info(`Retrieved ${rate.code}=${rate.rate} from Yahoo`);
        let ft = Mock.write(db);
        return rate;
    }
    catch (err) {
        logger_1.default.error(err);
        return undefined;
    }
}
function renderTable(req, res, data) {
    res.render('rates-table', { title: 'Rates Table', rates: data });
}
;
router.get(`/:from/:to`, (req, res) => {
    var _a, _b;
    const _from = ('' + ((_a = req.params) === null || _a === void 0 ? void 0 : _a.from)).toUpperCase().substr(0, 3);
    const _to = ('' + ((_b = req.params) === null || _b === void 0 ? void 0 : _b.to)).toUpperCase().substr(0, 3);
    if (_from === '' || _to === '') {
        res.status(BAD_REQUEST).end();
        return;
    }
    Promise.all([
        tryGetYahoo(_from),
        tryGetYahoo(_to),
    ]).then(arr => {
        let [iFrom, iTo] = arr;
        if (!iFrom || !iTo) {
            res.status(NOT_FOUND).end();
        }
        else if (iTo.rate == 0.0) {
            res.status(NO_CONTENT).end();
        }
        else {
            const _rate = iFrom.rate / iTo.rate;
            const updated = Math.min(iFrom.lastRefreshed.getTime(), iTo.lastRefreshed.getTime());
            res.json({ from: _from, to: _to, rate: _rate, updated: new Date(updated) });
        }
    }).catch(err => {
        logger_1.default.error(`Get from:${_from}/to:${_to} error ${err}`);
        res.status(IM_A_TEAPOT).end();
    });
});
router.get(`/:code`, (req, res) => {
    const code = getCode(req);
    if (code === '') {
        const str = `Get code:${code}  BAD_REQUEST`;
        logger_1.default.error(str);
        res.send(str).status(BAD_REQUEST).end();
        return;
    }
    else if (code === 'TAB') {
        const rates = [...MapRates.values()]
            .sort((a, b) => a.code.localeCompare(b.code));
        renderTable(req, res, rates);
        return;
    }
    else if (code === 'SQL') {
        const rates = [...MapRates.values()]
            .filter(a => a.code != 'USD')
            .sort((a, b) => a.code.localeCompare(b.code));
        const table = 'RateUSD';
        let query = '';
        rates.forEach(r => {
            query += 'INSERT OR IGNORE INTO ' + table +
                ` (code, name,rate,bid,ask,stored,lastRefreshed)  VALUES ` + '\n'
                + `( "${r.code}", "${r.name}", ${r.rate}, ${r.bid}, ${r.ask}, "${r.stored}","${r.lastRefreshed}");\n`;
        });
        logger_1.default.info(query);
        res.status(200).send(query).end();
        return;
    }
    else
        tryGetYahoo(code).then(_rate => {
            if (_rate) {
                res.status(200).json({ data: _rate }).end();
            }
            else {
                const str = `Get code:${code}  NOT_FOUND`;
                logger_1.default.error(str);
                res.send(str).status(NOT_FOUND).end();
            }
        }).catch(err => {
            const str = `Get code:${code} error ${err}`;
            logger_1.default.error(str);
            res.send(str).status(IM_A_TEAPOT).end();
        });
});
router.get(`delete/:code`, (req, res) => {
    const code = getCode(req);
    deleteInternal(code, res);
});
router.delete(`/:code`, (req, res) => {
    const code = getCode(req);
    deleteInternal(code, res);
});
router.get(`/`, (req, res) => {
    res.status(200).json({ data: [...MapRates.values()] }).end();
});
function deleteInternal(code, res) {
    if (code === '') {
        const str = `Get code:${code}  BAD_REQUEST`;
        logger_1.default.error(str);
        res.send(str).status(BAD_REQUEST).end();
        return;
    }
    const ret = MapRates.delete(code);
    if (Mock.write([...MapRates.values()])) {
        res.status(OK).end();
    }
    else {
        res.status(NO_CONTENT).end();
    }
}
//# sourceMappingURL=rates.js.map