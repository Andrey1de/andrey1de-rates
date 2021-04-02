const jsonfile = require('jsonfile');

const fs = require('fs');
//import path from 'path';
import logger from '../shared/logger';


export class MockFileService<T> {

     public dbFilePath = '';
    public dir = '';

    public ready: boolean;

    constructor() {
  
    }
    async init(dir: string, dbFilePath: string , initArray:T[]): Promise<T[]>{
        let ret: T[] = [];
        this.ready = false;
		try {
            if (!this.ready) {
                this.dbFilePath = dbFilePath;
                this.dir = dir;
                let ft = await fs.exists(this.dir);
                if (!ft) {
                    if (! await fs.exists(this.dir)) {
                        await fs.mkdir(this.dir, {
                            recursive: true
                        });
                        await fs.chmod(this.dir, '777');
                        fs.jsonfile(this.dbFilePath, []);
                        await fs.chmod(this.dbFilePath, '777');


                    }
                    this.write( initArray);
  
                }
                return  this.read();
         
            }
		} catch (e) {
            logger.error(`Error : ${e} in reading ${this.dbFilePath} `);
		}
        this.ready = true;

        return ret;
    }

    
    public  read(): T[] {
        if (!this.init) return [];
        try {
            return  jsonfile.readFileSync(this.dbFilePath);
        } catch (e) {
            logger.error(e);
            logger.error(`Error : ${e} in reading ${this.dbFilePath} `);
            return [];

        }

    }
  
    
    public  write(db: T[]) : boolean {
    if (!this.init) return;
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
