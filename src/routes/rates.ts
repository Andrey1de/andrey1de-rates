import * as express from "express";
import { IRate, Rate } from '../rates/rate.entities';
import { MockFileService } from '../shared/mock.file.service';
import logger from '../shared/logger';
import { ratesRenderTable }   from '../rates/rates.render.table';
import { AddressInfo } from "net";
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
 import { StatusCodes } from 'http-status-codes';
import { BADQUERY, NODATA } from 'node:dns';
import { inflateRaw } from "node:zlib";
const OK = StatusCodes.OK;
const BAD_REQUEST = StatusCodes.BAD_REQUEST;
const NOT_FOUND = StatusCodes.NOT_FOUND;
const CREATED = StatusCodes.CREATED;
const NO_CONTENT = StatusCodes.NO_CONTENT;
const CONFLICT = StatusCodes.CONFLICT;
const IM_A_TEAPOT = StatusCodes.IM_A_TEAPOT;
//import RatesController from './rates/rate.controller';
const SPAN_MS = Number(process.env.SPAN_MS) || 1000 * 3600;	 // one hour
const RATE_DB_PATH = process.env.RATE_DB_PATH || './db/RatesDb.json';
const RATE_DB_DIR = process.env.RATE_DB_DIR || './db';


const router = express();
export default router;

/*
*  ==========  INIT MOCK DATA	==========
*/

const RateUsd: IRate = {
	code: 'USD',
	name: 'USA Dollar',
	rate: 1.0,
	bid: 1.0,
	ask: 1.0,
	lastRefreshed: new Date(),
	stored: new Date()
};

const Mock = new MockFileService<IRate>();
const MapRates: Map<string, IRate> = new Map<string, IRate>();
//First read of Rates
(async () => {
	let arr: IRate[] =  Mock.init(RATE_DB_DIR,RATE_DB_PATH, [RateUsd]);
	MapRates.set(RateUsd.code, RateUsd);
	arr?.forEach(rate => MapRates.set(rate.code, rate));
})();

const getCode = (req: any) => {
	const code = '' + req?.params?.code;
	return ('' + code).toUpperCase().substr(0, 3);
}

async function tryGetYahoo(code: string): Promise<IRate | undefined> {
	

	if (code === 'USD') return RateUsd;
	try {
	
		let rate: IRate | undefined = MapRates.get(code);
		const dt0 = new Date().getTime();

		if (rate) {
			const storedTicks = new Date(rate.stored).getTime();
			const dt1 = Number(SPAN_MS) + storedTicks;
			const remain = Math.round((dt1 - dt0) / 1000);

			if (remain > 0) {

				logger.info(`Cache => ${rate.code}=${rate.rate} from Cache remain ${remain} sec to store `);
				return rate;
			}
		}


		const urlIn = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&` +
			`from_currency=${code}&to_currency=USD&apikey=55Y1508W05UYQN3G`;
		logger.info(urlIn);
		console.log(urlIn);

		//debugger;
		const config: AxiosRequestConfig = {
			method: 'get',
			url: urlIn,
			headers: {
				Accept: '*/*'
				//        'Authorization': 'Bearer ' + token,
				//'Accept': 'routerlication/json,routerlication/text'
			}
		};

		const buildArray = (await axios(config)).data;
		const jsonRet = JSON.stringify(buildArray);//JSON.parse(buildArray);

		const arr: string[] = jsonRet.split(/\"\d. /);
		if (arr.length < 10) {
			throw `Request to Yahoo about currency ${code}failed `;
		}

		let codeReceived: string = '';//arr[1].split(/\"/)[2];
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


		rate = new Rate();
		rate.code = code;
		// const body = jsonRet.data["Realtime Currency Exchange Rate"];
		rate.name = arr[2].split(/\"/)[2];//'' + getProperty(jsonRet, "2. From_Currency Name");

		rate.rate = Number(arr[5].split(/\"/)[2]);// "5. Exchange Rate"));
		rate.lastRefreshed = new Date(arr[6].split(/\"/)[2]);//,"6. Last Refreshed"));
		rate.bid = Number(arr[8].split(/\"/)[2]); //"8. Bid Price"));
		rate.ask = Number(arr[9].split(/\"/)[2]);//"9. Ask Price"));
		rate.stored = new Date();
		MapRates.set(code, rate);
		const db: IRate[] = [...MapRates.values()];
		//    await this.save();
		logger.info(`Retrieved ${rate.code}=${rate.rate} from Yahoo`);
		let ft = Mock.write(db);
		return rate;

	} catch (err) {
		logger.error(err);
		return undefined;
	}

}

//function renderTable(req, res, data) { // eslint-disable-line @typescript-eslint/no-unused-vars
//	res.render('rates-table', {title: 'Rates Table', rates: data });
//};

router.get(`/:from/:to`, (req, res) => {
	const _from = ('' + req.params?.from).toUpperCase().substr(0, 3);
	const _to     = ('' + req.params?.to).toUpperCase().substr(0, 3);

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
		} else {
			const _rate = iFrom.rate / iTo.rate;
			const updated = Math.min(iFrom.lastRefreshed.getTime(), iTo.lastRefreshed.getTime());
			res.json({ from:_from,to:_to, rate: _rate, updated: new Date(updated) });
		}
	}).catch(err => {
		logger.error(`Get from:${_from}/to:${_to} error ${err}`)
		res.status(IM_A_TEAPOT).end();
	});


});

router.get(`/:code`, (req, res) => {
	const code = getCode(req);
	if (code === '') {
		const str = `Get code:${code}  BAD_REQUEST`;
		logger.error(str);
		res.send(str).status(BAD_REQUEST).end();
		return;
	} else if (code === 'TAB') {
		const rates = [...MapRates.values()]
			.sort((a, b) => a.code.localeCompare(b.code));
		const html = ratesRenderTable( rates);
		res.send(html).status(OK).end();
		return;
	}	else if (code === 'SQL') {
		const rates = [...MapRates.values()]
			.filter(a => a.code != 'USD')
			.sort((a, b) => a.code.localeCompare(b.code)) ;
		const table = 'RateUSD';

		let query = '<pre>';
			rates.forEach(r => {
			query += 'INSERT OR IGNORE INTO ' + table +
				` (code, name,rate,bid,ask,stored,lastRefreshed)  VALUES ` + '\n'
				+` ("${r.code}", "${r.name}", ${r.rate}, ${r.bid}, ${r.ask}, "${r.stored}","${r.lastRefreshed}");\n`
			});
		query += '</pre>';
		logger.info(	query );
		res.status(200).send( query).end();
		return;
	}
	 else tryGetYahoo(code).then(
		_rate => {
			if (_rate) {
				res.status(200).json({ data: _rate }).end()
			} else {
				const str = `Get code:${code}  NOT_FOUND`;
				logger.error(str);
				res.send(str).status(NOT_FOUND).end();
 			}
		}
	).catch(
		err => {
			const str = `Get code:${code} error ${err}`;
			logger.error(str) ;
			res.send(str).status(IM_A_TEAPOT).end();
		}
	);

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

function deleteInternal(code: string, res)  {

	if (code === '') {
		const str = `Get code:${code}  BAD_REQUEST`;
		logger.error(str);
		res.send(str).status(BAD_REQUEST).end();
		return;
	}
	const ret: boolean = MapRates.delete(code);
	if (Mock.write([...MapRates.values()])) {
		res.status(OK).end();
	} else {
		res.status(NO_CONTENT).end();

	}
	
}



