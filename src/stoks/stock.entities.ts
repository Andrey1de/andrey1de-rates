

//"exchange": "NMS",
//    "shortname": "Tesla, Inc.",
//        "quoteType": "EQUITY",
//            "symbol": "TSLA",
//                "index": "quotes",
//                    "score": 393920,
//                        "typeDisp": "Equity",
//                            "longname": "Tesla, Inc.",
//                                "isYahooFinance": true
//      }

import { GlobalQuoteAlpha } from "./alphaVantage/stock.alpha.entities";


//export interface Stock {
//    symbol: string;//TSLA,
//  //  region: string;//TSLA,
//    shortname: string;//Tesla, Inc.,
//    quoteType: string;//EQUITY,
//    index: string;//quotes,
//    score: number;//393920,
//   // typeDisp: string;//Equity,
//    longname: string;//Tesla, Inc.,
//    percent: number ;
//    updated: Date;
//}



export class Stock  {

    symbol: string = '';// "IBM";//01
    open: number = 0;// "133.7600";//02
    high: number = 0;// "133.9300";//03
    low: number = 0;// "132.2700";//04
    price: number = 0;//  integer "133.2300";//05
    volume: number = 0;// integer "4074161";//06
    latestTradingDay: string = '';// "2021-04-01";//07
    previousClose: number = 0;// "133.2600";//08
    change: number = 0;// "-0.0300";//09
    changePercent: number = 0;// "-0.0225%";//10
    updated: Date = new Date();


   
    constructor(that: GlobalQuoteAlpha | Stock | undefined = undefined) {
        if (that) {
            this.symbol = that?.symbol ;// "IBM";//01
            this.open = +that?.open ;// "133.7600";//02
            this.high = +that?.high ;// "133.9300";//03                undefined
            this.low = +that?.low ;// "132.2700";//04
            this.price = +that?.price ;// "133.2300";//05
            this.volume = +that?.volume ;// "4074161";//06
            this.latestTradingDay = that?.latestTradingDay ;// "2021-04-01";//07
            this.previousClose = +that ?.previousClose ;// "133.2600";//08
            this.change = +that?.change ;// "-0.0300";//09
            this.changePercent = +(that?.toString().replace('\%','')) ;// "-0.0225%";//10

        }

    }

 //   setPercent(percent : number) : number{

 //       return this.score *= (1 +  percent) * 100.0;

	//}


}

