import * as express from "express";
import { IRate, Rate } from '../rates/rate.entities';
import { MockFileService } from '../rates/mock.file.service';
import logger from '../rates/logger';

import { AddressInfo } from "net";
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { StatusCodes } from 'http-status-codes';
import { BADQUERY } from 'node:dns';
import { inflateRaw } from "node:zlib";
const OK = StatusCodes.OK;
const BAD_REQUEST = StatusCodes.BAD_REQUEST;
const NOT_FOUND = StatusCodes.NOT_FOUND;
const CREATED = StatusCodes.CREATED;
const NO_CONTENT = StatusCodes.NO_CONTENT;
const CONFLICT = StatusCodes.CONFLICT;



//import RatesController from './rates/rate.controller';
const SPAN_MS = Number(process.env.SPAN_MS) || 1000 * 3600;
const RATE_DB_PATH = process.env.RATE_DB_PATH || './db/RateDb.json';
const RATE_DB_DIR = process.env.RATE_DB_DIR || './db';

const Mock = new MockFileService<IRate>();
const MapRates: Map<string, IRate> = new Map<string, IRate>();
(async () => {
	await Mock.init('./db', './db/RatesDB.json');
})();
try {
	if (Mock.init('./db', './db/RateDB.json')) {
		logger.info(`Storage /db/rates.json OK`);

		const arrRates: IRate[] = Mock.readSync();

		if (arrRates && arrRates.length > 0) {
			arrRates.forEach(p => {
				MapRates.set(p.code, p);
			})

		}


	} else {
		logger.error(`Storage /db/rates.json FAILED`);
	}
} catch (e) {
	logger.error(`Storage /db/rates.json FAILED, cause${e} `);

}

const getCode = (req: any) => {
	const code = '' + req?.params?.code;
	return ('' + code).toUpperCase().substr(0, 3);
}


const router = express();;







export default router;

async function tryGetYahoo(code: string): Promise<IRate | undefined> {

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
		Mock.writeSync(db);
		return rate;

	} catch (err) {
		logger.error(err);
		return undefined;
	}

}

router.get(`/:code`, (req, res) => {
	const code = getCode(req);
	if (code === '') {
		res.status(BAD_REQUEST).end();
	}

	tryGetYahoo(code).then(
		ret => res.status(200).json({ data: ret || 'undefined' }).end()
	).catch(
		err => res.status(NOT_FOUND).end()
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
	res.status(200).json({ data: [...MapRates.values()] }).end()
});


function deleteInternal(code: string, res) {

	if (code === '') {
		res.status(BAD_REQUEST).end();
	}
	const ret: boolean = MapRates.delete(code);
	if (ret) {
		Mock.write([...MapRates.values()]).then(
			b => {
				if (b) {
					res.status(OK).end();
					logger.info(`Removed USD-${code} `);
				} else {
					res.status(NO_CONTENT).end();
				}
			}
		).catch(
			err => {
				res.status(NO_CONTENT).end();
			}
		);
	} else {
		res.status(NOT_FOUND).end();

	}
}

