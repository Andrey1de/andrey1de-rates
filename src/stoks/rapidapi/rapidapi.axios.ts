import logger from '../../shared/logger';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Stock } from '../stock.entities';


export async function loadStockRatidApi(symbol: string, region: string = 'US'): Promise<Stock | undefined> {
	//var unirest = require("unirest");						 

	//try {
		//var req = await unirest("GET", "https://apidojo-yahoo-finance-v1.p.rapidapi.com/auto-complete");

		const urlIn = `https://apidojo-yahoo-finance-v1.p.rapidapi.com/auto-complete?q=${symbol}&region=${region}`;
	//const urlIn =  `https://stock-and-options-trading-data-provider.p.rapidapi.com/options/${code}`
		
	//const urlIn =`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=3MEYVIGY6HV9QYMI` ;

		const config: AxiosRequestConfig = {
			method: 'get',
			url: urlIn,
			headers: {
				Accept: '*/*',
				"x-rapidapi-proxy-secret": "a755b180-f5a9-11e9-9f69-7bf51e845926" ,
				"x-rapidapi-key": "c8d476f2a9msh6a978a4e6151b0ap1bb8a4jsn62136729739e",
				"x-rapidapi-host": "stock-and-options-trading-data-provider.p.rapidapi.com",
				"useQueryString": true
			}
		};

		const retsp= (await axios(config)).data;
		//const ret = retsp.data;
	const stockRet = stockFromGlobalQuota(symbol, retsp);
		return stockRet		;

		//req.query({
		//	"q": code,
		//	"region": region
		//});

		//req.headers({
		//	"x-rapidapi-key": "c8d476f2a9msh6a978a4e6151b0ap1bb8a4jsn62136729739e",
		//	"x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
		//	"useQueryString": true
		//});




		//req.end(function (res) {
		//	if (res.error) throw new Error(res.error);

		//	logger.info(res.body);
		//});

	//} catch (e) {
	//	logger.error(e);
	//	throw e;
	//}
}

function stockFromGlobalQuota(symbol: string, jsonRet: object): Stock {

	let  jssonObject = {
			"01. symbol": "",
			"02. open": "0",
			"03. high": "",
			"04. low": "",
			"05. price": "",
			"06. volume": "",
			"07. latest trading day": "",
			"08. previous close": "",
			"09. change": "",
			"10. change percent": ""
		
	}
	const arr = jsonRet["Global Quote"];
	const objArr = Object.assign(jssonObject, jsonRet["Global Quote"]);
	//for (const [key, value] of Object.entries(object1)) {
	//	console.log(`${key}: ${value}`);
	//}

	//const arr: string[] = jsonRet.split(/\"\d. /);
	if (arr.length < 10) {
		throw `Request to https://www.alphavantage.co about currency ${symbol}failed `;
	}

	let codeReceived: string = '';//arr[1].split(/\"/)[2];
	if (arr[1].split(/\"/).length < 3 || (codeReceived = arr[1].split(/\"/)[2]) != symbol) {
		throw `Request to Yahoo about currency ${symbol}failed `;
	}

	const _stock = new Stock();
	_stock.symbol = symbol;
	// const body = jsonRet.data["Realtime Currency Exchange Stock"];
	//Stock.name = arr[2].split(/\"/)[2];//'' + getProperty(jsonRet, "2. From_Currency Name");

	//Stock.Stock = Number(arr[5].split(/\"/)[2]);// "5. Exchange Stock"));
	//Stock.lastRefreshed = new Date(arr[6].split(/\"/)[2]);//,"6. Last Refreshed"));
	//Stock.bid = Number(arr[8].split(/\"/)[2]); //"8. Bid Price"));
	//Stock.ask = Number(arr[9].split(/\"/)[2]);//"9. Ask Price"));
	//Stock.stored = new Date();
	//MapStocks.set(code, Stock);
	//const db: Stock[] = [...MapStocks.values()];
	////    await this.save();
	//logger.info(`Retrieved ${Stock.code}=${Stock.Stock} from Yahoo`);
	//let ft = Mock.write(db);
	return  _stock;
}

	//# Global Quota
//{
//    "Global Quote": {
//        "01. symbol": "IBM",
//        "02. open": "133.7600",
//        "03. high": "133.9300",
//        "04. low": "132.2700",
//        "05. price": "133.2300",
//        "06. volume": "4074161",
//        "07. latest trading day": "2021-04-01",
//        "08. previous close": "133.2600",
//        "09. change": "-0.0300",
//        "10. change percent": "-0.0225%"
//    }
//}

/*
RapidAPI App : default-application_5162557

Header Parameters
X-RapidAPI-Proxy-Secret : a755b180-f5a9-11e9-9f69-7bf51e845926

X-RapidAPI-Key : 453d74353cmsha91ed7b68ff8fdep11d3b4jsn03b80f01754c


X-RapidAPI-Host : stock-and-options-trading-data-provider.p.rapidapi.com

Required Parameters
ticker : aapl

 */