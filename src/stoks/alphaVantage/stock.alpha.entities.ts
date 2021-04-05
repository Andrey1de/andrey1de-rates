//--------class  GlobalQuoteAlpha Global Quote object to decode html object-------

import { error } from "winston";
import logger from "../../shared/logger";


export class GlobalQuoteAlpha {
    symbol: string = '';// "IBM";//01
    open: string = '';// "133.7600";//02
    high: string = '';// "133.9300";//03
    low: string = '';// "132.2700";//04
    price: string = '';// "133.2300";//05
    volume: string = '';// "4074161";//06
    latestTradingDay: string = '';// "2021-04-01";//07
    previousClose: string = '';// "133.2600";//08
    change: string = '';// "-0.0300";//09
    changePercent: string = '';// "-0.0225%";//10
   
    static FromAny(json: any): GlobalQuoteAlpha | undefined{
      //  
        if (json) {
            try {
                const that: GlobalQuoteAlpha = new GlobalQuoteAlpha();
                return entryPopulate<GlobalQuoteAlpha>(that, json);

            } catch (e) {
                logger.error(e);
            }
        }
        return undefined;
    }

};// end class GlobalQuoteAlpha {

function entryPopulate<T>(that : T, json: any) {
    let strRet = '';
    for (const [keyRoot, root] of Object.entries(json)) {
        for (const [key0, prop] of Object.entries(root)) {
             const arrKey = key0.split(". ");
            const key = camelize(arrKey[1]);
            if (that.hasOwnProperty(key)) {
                that[key] = prop;
			}
        }
     }
    return that;
};

function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}

//--------class  BestMatchesEntity bestMatches object -------
export class BestMatchesAlpha {
    symbol: string = '';// "TESO";//1
    name: string = '';// "Tesco Corporation USA";//2
    type: string = '';// "Equity";//3
    region: string = '';// "United States";//4
    marketOpen: string = '';// "09:30";//5
    marketClose: string = '';// "16:00";//6
    timezone: string = '';// "UTC-04";//7
    currency: string = '';// "USD";//8
    matchScore: string = '';// "0.8889";//9
};// end class BestMatchesEntity {
//--------class  CompanyOverview  object -------
class CompanyOverviewAlpha {
    Symbol: string = '';// "IBM";//Symbol
    AssetType: string = '';// "Common Stock";//AssetType
    Name: string = '';// "International Business Machines Corporation";//Name
    Description: string = '';// "International Business Machines Corporation provides integrated solutions and services worldwide. Its Cloud & Cognitive Software segment offers software for vertical and domain-specific solutions in health, financial services, supply chain, and asset management, weather, and security software and services application areas; and customer information control system and storage, and analytics and integration software solutions to support client mission critical on-premise workloads in banking, airline, and retail industries. It also offers middleware and data platform software, including Red Hat that enables the operation of clients' hybrid multi-cloud environments; and Cloud Paks, WebSphere distributed, and analytics platform software, such as DB2 distributed, information integration, and enterprise content management, as well as IoT, Blockchain and AI/Watson platforms. The company's Global Business Services segment offers business consulting services; system integration, application management, maintenance, and support services for packaged software; and finance, procurement, talent and engagement, and industry-specific business process outsourcing services. Its Global Technology Services segment provides IT infrastructure and platform services; and project, managed, outsourcing, and cloud-delivered services for enterprise IT infrastructure environments; and IT infrastructure support services. The company's Systems segment offers servers for businesses, cloud service providers, and scientific computing organizations; data storage products and solutions; and z/OS, an enterprise operating system, as well as Linux. Its Global Financing segment provides lease, installment payment, loan financing, short-term working capital financing, and remanufacturing and remarketing services. The company was formerly known as Computing-Tabulating-Recording Co. The company was incorporated in 1911 and is headquartered in Armonk, New York.";//Description
    CIK: string = '';// "0000051143";//CIK
    Exchange: string = '';// "NYSE";//Exchange
    Currency: string = '';// "USD";//Currency
    Country: string = '';// "USA";//Country
    Sector: string = '';// "Technology";//Sector
    Industry: string = '';// "Information Technology Services";//Industry
    Address: string = '';// "One New Orchard Road, Armonk, NY, United States, 10504";//Address
    FullTimeEmployees: string = '';// "345900";//FullTimeEmployees
    FiscalYearEnd: string = '';// "December";//FiscalYearEnd
    LatestQuarter: string = '';// "2020-12-31";//LatestQuarter
    MarketCapitalization: string = '';// "118982033408";//MarketCapitalization
    EBITDA: string = '';// "15278999552";//EBITDA
    PERatio: string = '';// "21.3621";//PERatio
    PEGRatio: string = '';// "1.3754";//PEGRatio
    BookValue: string = '';// "23.074";//BookValue
    DividendPerShare: string = '';// "6.51";//DividendPerShare
    DividendYield: string = '';// "0.0489";//DividendYield
    EPS: string = '';// "6.233";//EPS
    RevenuePerShareTTM: string = '';// "82.688";//RevenuePerShareTTM
    ProfitMargin: string = '';// "0.0759";//ProfitMargin
    OperatingMarginTTM: string = '';// "0.1166";//OperatingMarginTTM
    ReturnOnAssetsTTM: string = '';// "0.0348";//ReturnOnAssetsTTM
    ReturnOnEquityTTM: string = '';// "0.2638";//ReturnOnEquityTTM
    RevenueTTM: string = '';// "73620996096";//RevenueTTM
    GrossProfitTTM: string = '';// "35575000000";//GrossProfitTTM
    DilutedEPSTTM: string = '';// "6.233";//DilutedEPSTTM
    QuarterlyEarningsGrowthYOY: string = '';// "-0.631";//QuarterlyEarningsGrowthYOY
    QuarterlyRevenueGrowthYOY: string = '';// "-0.065";//QuarterlyRevenueGrowthYOY
    AnalystTargetPrice: string = '';// "137.84";//AnalystTargetPrice
    TrailingPE: string = '';// "21.3621";//TrailingPE
    ForwardPE: string = '';// "12.0773";//ForwardPE
    PriceToSalesRatioTTM: string = '';// "1.6229";//PriceToSalesRatioTTM
    PriceToBookRatio: string = '';// "5.7814";//PriceToBookRatio
    EVToRevenue: string = '';// "2.3327";//EVToRevenue
    EVToEBITDA: string = '';// "13.6083";//EVToEBITDA
    Beta: string = '';// "1.2454";//Beta
    //52WeekHigh: string = '';// "137.07";//52WeekHigh
    //52WeekLow: string = '';// "103.0292";//52WeekLow
    //50DayMovingAverage: string = '';// "126.2691";//50DayMovingAverage
    //200DayMovingAverage: string = '';// "122.9146";//200DayMovingAverage
    SharesOutstanding: string = '';// "893593984";//SharesOutstanding
    SharesFloat: string = '';// "891967749";//SharesFloat
    SharesShort: string = '';// "29098388";//SharesShort
    SharesShortPriorMonth: string = '';// "29057711";//SharesShortPriorMonth
    ShortRatio: string = '';// "4.89";//ShortRatio
    ShortPercentOutstanding: string = '';// "0.03";//ShortPercentOutstanding
    ShortPercentFloat: string = '';// "0.0326";//ShortPercentFloat
    PercentInsiders: string = '';// "0.133";//PercentInsiders
    PercentInstitutions: string = '';// "58.194";//PercentInstitutions
    ForwardAnnualDividendRate: string = '';// "6.52";//ForwardAnnualDividendRate
    ForwardAnnualDividendYield: string = '';// "0.0489";//ForwardAnnualDividendYield
    PayoutRatio: string = '';// "0.752";//PayoutRatio
    DividendDate: string = '';// "2021-03-10";//DividendDate
    ExDividendDate: string = '';// "2021-02-09";//ExDividendDate
    LastSplitFactor: string = '';// "2:1";//LastSplitFactor
    LastSplitDate: string = '';// "1999-05-27";//LastSplitDate
};// end class CompanyOverview {