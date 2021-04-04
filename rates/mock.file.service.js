"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockFileService = void 0;
const jsonfile = require('jsonfile');
const fs = require('fs');
//import path from 'path';
const logger_1 = require("../shared/logger");
class MockFileService {
    constructor() {
        this.dbFilePath = '';
        this.dir = '';
        this.ready = false;
    }
    init(dir, dbFilePath, initArray) {
        this.dir = dir;
        this.dbFilePath = dbFilePath;
        this.tryInit();
        return this.read();
    }
    tryInit() {
        if (this.ready)
            return true;
        try {
            let ft = fs.existsSync(this.dbFilePath);
            if (!ft) {
                if (!fs.existsSync(this.dir)) {
                    fs.mkdirSync(this.dir, {
                        recursive: true
                    });
                }
                fs.write();
            }
        }
        catch (e) {
            logger_1.default.error(`Error : ${e} in reading ${this.dbFilePath} `);
            return this.ready = false;
        }
        this.ready = true;
    }
    read() {
        if (!this.tryInit())
            return [];
        try {
            return jsonfile.readFileSync(this.dbFilePath);
        }
        catch (e) {
            logger_1.default.error(e);
            logger_1.default.error(`Error : ${e} in reading ${this.dbFilePath} `);
            return [];
        }
    }
    write(db) {
        if (!this.tryInit())
            return;
        try {
            const json = JSON.stringify(db, null, 2);
            fs.writeFileSync(this.dbFilePath, json);
            return true;
        }
        catch (e) {
            logger_1.default.error(e);
            logger_1.default.error(`Error : ${e} in writing ${this.dbFilePath} `);
        }
        return false;
    }
}
exports.MockFileService = MockFileService;
//# sourceMappingURL=mock.file.service.js.map