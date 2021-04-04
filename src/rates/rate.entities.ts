export interface IRate {
    code: string;
    name: string;
    rate: number;
    bid: number;
    ask: number;
    stored: Date;
    lastRefreshed: Date;

}



export class Rate implements IRate {

    public code: string = '';
    public name: string = '';
    public rate: number = -1;
    public bid: number = -1;
    public ask: number = -1;
    public stored: Date = new Date('1900-01-01');
    public lastRefreshed: Date = new Date('1900-01-01');
   
    constructor(irate?: IRate) {
        if (irate) {
            this.code = irate.code.toUpperCase().substr(0, 3);
            this.name = irate.name;
            this.rate = irate.rate;
            this.bid = irate.bid;
            this.ask = irate.ask;
            this.stored = irate.stored;
             this.lastRefreshed = irate.lastRefreshed;

        }

    }


}

