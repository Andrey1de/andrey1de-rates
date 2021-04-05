import * as express from "express";
import { StatusCodes } from 'http-status-codes';
import * as path from 'path';
import logger from '../shared/logger';
import { MockFileService } from '../shared/mock.file.service';
import { Stock } from '../stoks/stock.entities';
//HACK!!!
//import { loadStockRatidApi as loadStock } from '../stoks/rapidapi/rapidapi.axios';
import { loadGlobalQuoteAlpha } from '../stoks/alphaVantage/stock.alpha.axios';
import { globalQuotesRenderTable } from "../stoks/global.quote.render.table";
 

const OK = StatusCodes.OK;
const BAD_REQUEST = StatusCodes.BAD_REQUEST;
const NOT_FOUND = StatusCodes.NOT_FOUND;
const CREATED = StatusCodes.CREATED;
const NO_CONTENT = StatusCodes.NO_CONTENT;
const CONFLICT = StatusCodes.CONFLICT;
const IM_A_TEAPOT = StatusCodes.IM_A_TEAPOT;
//import RatesController from './rates/rate.controller';
const SPAN_MS = Number(process.env.SPAN_MS) || 1000 * 3600;	 // one hour
const RATE_DB_PATH = process.env.RATE_DB_PATH || './db/StocksDb.json';
const RATE_DB_DIR = process.env.RATE_DB_DIR || './db';


const router = express();
export default router;

/*
*  ==========  INIT MOCK DATA	==========
*/


const Mock = new MockFileService<Stock>();
const MapStocks = new Map<string, Stock>();
//First read of Rates
(async () => {
		try {
			let arr: Stock[] = Mock.init(RATE_DB_DIR, RATE_DB_PATH, []);
			arr?.forEach(rate =>
				MapStocks.set(rate.symbol, new Stock(rate)));
		} catch (e) {
			logger.info(e);
		}
	}
 )();

const getCode = (req: any) => {
	const code = '' + req?.params?.code;
	return ('' + code).trim().toUpperCase();//.substr(0, 4);
}


router.get(`/:code`, (req, res) => {
	const code = getCode(req);
	if (code === '') {
		const str = `Get code:${code}  BAD_REQUEST`;
		logger.error(str);
		res.send(str).status(BAD_REQUEST).end();
		return;
	}
	else if (code.startsWith('TABL')) {
		const rates = [...MapStocks.values()]
			.sort((a, b) => a.symbol.localeCompare(b.symbol));
		let html = renderTable(req, res, rates);

		//res.status(200).send(html).end();
		return;
	}
	else if (code.startsWith('SQL') ){
		const rates: Stock[] = [...MapStocks.values()]
				.sort((a, b) => a.symbol.localeCompare(b.symbol));
		const table = 'stocks';

		let query = '<pre>';
		rates.forEach(r => {
			query += 'INSERT OR IGNORE INTO ' + table +	'\n' +
`  (symbol,open,high,low,price,volume,	latestTradingDay,previousClose,change,changePercent)
  VALUES ` + ` ("${r.symbol}", "${r.open}","${r.high}", "${r.low}", ${r.price},`
				+ `"${r.volume}", ${r.latestTradingDay},\n`
				+ `"${r.previousClose}", ${r.change},"${r.changePercent}");\n`
		});
		query += '</pre>';
		logger.info(query);
		res.status(200).send(query).end();
		return;
	}
	else new Promise( _=>tryLoadStock(code,res));

});


async function tryLoadStock(code: string,res): Promise<Stock | undefined> {
	let _stock: Stock | undefined = MapStocks.get(code);
	if (!_stock) {
		let _stock1 = await loadGlobalQuoteAlpha(code).catch(
			error => {
				logger.error({ code: code, error: error });
				res.status(IM_A_TEAPOT).json({ code: code, error: error }).end();
			}
		)
		if (_stock1)
			_stock = _stock1;
	}
		
	if (_stock) {
		logger.info(_stock);
		if (MapStocks.set(_stock.symbol, new Stock(_stock))) {
			Mock.write([...MapStocks.values()]);
		}
			
		res.status(200).json({ code: code, data: _stock }).end();
	}
	else {
		const str = `Get code:${code}  NOT_FOUND`;
		logger.error(str);
		//
		res.json({ code: code, error: 'NOT_FOUND' }).status(NOT_FOUND).end();
	}
	return new Stock(_stock);
 }

router.get(`delete/:code`, (req, res) => {
	const code = getCode(req);
	deleteInternal(code, res);
});

router.delete(`/:code`, (req, res) => {
	const code = getCode(req);
	deleteInternal(code, res);
});

router.get(`/`, (req, res) => {
	res.status(200).json({ data: [...MapStocks.values()] }).end();
});

function deleteInternal(code: string, res)  {

	if (code === '') {
		const str = `Get code:${code}  BAD_REQUEST`;
		logger.error(str);
		res.send(str).status(BAD_REQUEST).end();
		return;
	}
	const ret: boolean = MapStocks.delete(code);
	if (Mock.write([...MapStocks.values()])) {
		res.status(OK).end();
	} else {
		res.status(IM_A_TEAPOT).end();

	}
	
}


function renderTable(req, res, data) {
	const strHtmlEnd = globalQuotesRenderTable(data)
	
	res.send(strHtmlEnd).status(OK).end();
	return strHtmlEnd;


	//var __dirname = path.resolve(path.dirname(''));

	//// view engine setup
	//router.set('views', path.join(__dirname, 'views'));

	//res.render('stocks-table', { title: 'Stocks Table', stocks: data });
};

	// else tryGetYahoo(code).then(
	//	_stock => {
	//		if (_stock) {
	//			res.status(200).json({ data: _stock }).end()
	//		} else {
	//			const str = `Get code:${code}  NOT_FOUND`;
	//			logger.error(str);
	//			res.send(str).status(NOT_FOUND).end();
 //			}
	//	}

//async function tryGetYahoo(code: string): Promise<Stock | undefined>


 //{


//	if (code === 'USD') return RateUsd;
//	try {

//		let rate: Stock | undefined = MapRates.get(code);
//		const dt0 = new Date().getTime();

//		if (rate) {
//			const storedTicks = new Date(rate.stored).getTime();
//			const dt1 = Number(SPAN_MS) + storedTicks;
//			const remain = Math.round((dt1 - dt0) / 1000);

//			if (remain > 0) {

//				logger.info(`Cache => ${rate.code}=${rate.rate} from Cache remain ${remain} sec to store `);
//				return rate;
//			}
//		}


//		const urlIn = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&` +
//			`from_currency=${code}&to_currency=USD&apikey=55Y1508W05UYQN3G`;
//		logger.info(urlIn);
//		console.log(urlIn);

//		//debugger;
//		const config: AxiosRequestConfig = {
//			method: 'get',
//			url: urlIn,
//			headers: {
//				Accept: '*/*'
//				//        'Authorization': 'Bearer ' + token,
//				//'Accept': 'routerlication/json,routerlication/text'
//			}
//		};

//		const buildArray = (await axios(config)).data;
//		const jsonRet = JSON.stringify(buildArray);//JSON.parse(buildArray);

//		const arr: string[] = jsonRet.split(/\"\d. /);
//		if (arr.length < 10) {
//			throw `Request to Yahoo about currency ${code}failed `;
//		}

//		let codeReceived: string = '';//arr[1].split(/\"/)[2];
//		if (arr[1].split(/\"/).length < 3 || (codeReceived = arr[1].split(/\"/)[2]) != code) {
//			throw `Request to Yahoo about currency ${code}failed `;
//		}


//		//0: "{"Realtime Currency Exchange Rate":{"
//		//1: "From_Currency Code": "GBP", "
//		//2: "From_Currency Name": "British Pound Sterling", "
//		//3: "To_Currency Code": "USD", "
//		//4: "To_Currency Name": "United States Dollar", "
//		//5: "Exchange Rate": "1.37640000", "
//		//6: "Last Refreshed": "2021-04-01 05:49:01", "
//		//7: "Time Zone": "UTC", "
//		//8: "Bid Price": "1.37634000", "
//		//9: "Ask Price": "1.37644000"


//		rate = new Stock();
//		rate.code = code;
//		// const body = jsonRet.data["Realtime Currency Exchange Rate"];
//		rate.name = arr[2].split(/\"/)[2];//'' + getProperty(jsonRet, "2. From_Currency Name");

//		rate.rate = Number(arr[5].split(/\"/)[2]);// "5. Exchange Rate"));
//		rate.lastRefreshed = new Date(arr[6].split(/\"/)[2]);//,"6. Last Refreshed"));
//		rate.bid = Number(arr[8].split(/\"/)[2]); //"8. Bid Price"));
//		rate.ask = Number(arr[9].split(/\"/)[2]);//"9. Ask Price"));
//		rate.stored = new Date();
//		MapRates.set(code, rate);
//		const db: Stock[] = [...MapRates.values()];
//		//    await this.save();
//		logger.info(`Retrieved ${rate.code}=${rate.rate} from Yahoo`);
//		//let ft = Mock.write(db);
//		return rate;

//	} catch (err) {
//		logger.error(err);
//		return undefined;
//	}

//}