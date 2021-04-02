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
   
    constructor(iratio?: IRate) {
        if (iratio) {
            this.code = iratio.code.toUpperCase().substr(0, 3);
            this.name = iratio.name;
            this.rate = iratio.rate;
            this.bid = iratio.bid;
            this.ask = iratio.ask;
            this.stored = iratio.stored;
             this.lastRefreshed = iratio.lastRefreshed;

        }

    }


}

