import { unirest } from 'unirest';
import	logger from '../shared/logger'


export async function loadStock(code: string, region: string = 'US'): Promise<any> {
	//var unirest = require("unirest");

	var req = unirest("GET", "https://apidojo-yahoo-finance-v1.p.rapidapi.com/auto-complete");

	req.query({
		"q": code,
		"region": region
	});

	req.headers({
		"x-rapidapi-key": "c8d476f2a9msh6a978a4e6151b0ap1bb8a4jsn62136729739e",
		"x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
		"useQueryString": true
	});


	

	req.end(function (res) {
		if (res.error) throw new Error(res.error);

		logger.info(res.body);
	});
}

/*
RapidAPI App : default-application_5162557

Header Parameters
X-RapidAPI-Proxy-Secret : a755b180-f5a9-11e9-9f69-7bf51e845926

X-RapidAPI-Key : 453d74353cmsha91ed7b68ff8fdep11d3b4jsn03b80f01754c


X-RapidAPI-Host : stock-and-options-trading-data-provider.p.rapidapi.com

Required Parameters
ticker : aapl

 */