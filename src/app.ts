import * as express from 'express';
import { AddressInfo } from "net";
import * as path from 'path';
import routes from './routes/index';
import users from './routes/user';
import rates from './routes/rates';
import stocks from './routes/stocks';
import logger from './shared/logger';

const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/rates', rates);

app.use('/stocks', stocks);

app.use('/users', users);

//app.get('/gen', (req, res) => {
//	try {
//       const entities = genGo();
//        res.send(entities).end();
//	} catch (e) {
//        res.send({ error: e }).status(500).end();

//	}
//})


app.use('/', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err[ 'status' ] = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => { // eslint-disable-line @typescript-eslint/no-unused-vars
        res.status(err[ 'status' ] || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => { // eslint-disable-line @typescript-eslint/no-unused-vars
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


const PORT = process.env.PORT || 8080;
app.set('port', PORT);

const server = app.listen(app.get('port'), function () {
    logger.info(`Express server listening on port ${(server.address() as AddressInfo).port}`);
    
});

