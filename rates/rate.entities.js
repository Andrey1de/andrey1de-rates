"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rate = void 0;
class Rate {
    constructor(irate) {
        this.code = '';
        this.name = '';
        this.rate = -1;
        this.bid = -1;
        this.ask = -1;
        this.stored = new Date('1900-01-01');
        this.lastRefreshed = new Date('1900-01-01');
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
exports.Rate = Rate;
//# sourceMappingURL=rate.entities.js.map