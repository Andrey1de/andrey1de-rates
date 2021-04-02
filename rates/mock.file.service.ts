const  jsonfile = require( 'jsonfile');
const fs = require('fs');
//import path from 'path';
import logger from './logger';


export class MockFileService<T> {

  
    public dbFilePath = '';
    public dir = '';

    public ready: boolean;

    constructor() {
  
    }
    async  init(dir: string, dbFilePath: string,) : Promise<boolean>{
		try {
            if (!this.ready) {
                this.dbFilePath = dbFilePath;
                this.dir = dir;
                let ft = fs.existsSync(this.dir);

                if (!fs.existsSync(this.dir)) {
                    fs.mkdirSync(this.dir, {
                        recursive: true
                    });
                }
                if (!fs.existsSync(this.dbFilePath)) {
                    fs.writeFileSync(this.dbFilePath, '[]');
                }
            }
            this.ready = true;
		} catch (e) {

		}
     
        return this.ready;
    }

    public readSync(): T[]{
        if (!this.init)  return [];
        try {
            return jsonfile.readFileSync(this.dbFilePath);
        } catch (e) {
            logger.error(e);
            return  [];

        }
      
    }
    public async read(): Promise<T[]> {
        if (!this.init) return [];
        try {
            return await jsonfile.readFile(this.dbFilePath);
        } catch (e) {
            logger.error(e);
            return [];

        }

    }
  
    public writeSync(db: T[]) {
        if (!this.init) return;
        try {
            const json = JSON.stringify(db, null, 2);
            fs.writeFileSync(this.dbFilePath, json);
        } catch (e) {
            logger.error(e);

        }
    }

    public async write(db: T[]) : Promise<boolean> {
    if (!this.init) return;
        try {
            const json = JSON.stringify(db, null, 2);
            fs.writeFileSync(this.dbFilePath, json);
            return true;
        } catch (e) {
            logger.error(e);

        }
        return false;
    }
}
