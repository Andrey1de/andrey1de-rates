export interface IStock {
    code: string;
    region: string ;
    name: string ;
    rate: number;
    percent: number ;
    bid: number;
    ask: number;
    stored: Date;
    lastRefreshed: Date;

}



export class Stock implements IStock {

    public code: string = '';
    public region: string = 'US';
    public name: string = '';
    public percent: number = -1;
    public rate: number = -1;
    public bid: number = -1;
    public ask: number = -1;
    public stored: Date = new Date('1900-01-01');
    public lastRefreshed: Date = new Date('1900-01-01');
   
    constructor(irate?: IStock) {
        if (irate) {
            this.code = irate.code.trim().toLowerCase();//.substr(0,4);
            this.name = irate.name;
            this.percent = irate.percent;
            this.rate = irate.rate;
            this.bid = irate.bid;
            this.ask = irate.ask;
            this.stored = irate.stored;
            this.lastRefreshed = irate.lastRefreshed;

        }

    }

    setPercent(percent : number) : number{

       return this.rate *= (1 +  percent) * 100.0;

	}


}

