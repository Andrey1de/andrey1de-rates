const jsonfile = require('jsonfile');

const fs = require('fs');
//import path from 'path';
import logger from './logger';




export class MockFileService<T> {

     public dbFilePath = '';
    public dir = '';

    public ready: boolean = false;

    constructor() {
    }

    init(dir: string, dbFilePath: string, initArray: T[]): T[] {
        this.dir = dir;
        this.dbFilePath = dbFilePath;
        this.tryInit()
        return this.read();
    }
    protected tryInit() : boolean {
        if (this.ready) return true;
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
          } catch (e) {
            logger.error(`Error : ${e} in reading ${this.dbFilePath} `);
            return this.ready = false;
         }
         this.ready = true;
	}
    public  read(): T[] {
        if (!this.tryInit()) return [];
        try {
            return  jsonfile.readFileSync(this.dbFilePath);
        } catch (e) {
            logger.error(e);
            logger.error(`Error : ${e} in reading ${this.dbFilePath} `);
            return [];
          }
       }
    public  write(db: T[]) : boolean {
        if (!this.tryInit()) return;
        try {
            const json = JSON.stringify(db, null, 2);
             fs.writeFileSync(this.dbFilePath, json);
            return true;
        } catch (e) {
            logger.error(e);
            logger.error(`Error : ${e} in writing ${this.dbFilePath} `);
        }
        return false;
    }
}
