import { Stock } from "stoks/stock.entities";
import { GlobalQuoteAlpha } from "./alphaVantage/stock.alpha.entities";
import { getRenderTableStyle } from "../shared/render.Table.style";

export function globalQuotesRenderTable(data: Stock[] ) : string {
    var style = getRenderTableStyle();
    var strHtml0 =
 `<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8" />
    <title>StocksTab</title>
        ${style}
  </head>
<body>
    <h2> Stocks Table </h2>
   
            <table>
                <thead>
                    <tr>
                        <th>symbol</th>
                        <th>open</th>
                        <th>high</th>
                        <th>low</th>
                        <th>price</th>
                         <th>latestTradingDay</th>
                        <th>previousClose</th>
                        <th>change</th>
                        <th>changePercent</th>
                        <th>Updated</th>
                    </tr>
                </thead>	
                <tbody>
` ;	 //-----------------------------------
    let htmlMid = strHtml0;
    const perc = '%';
    if (Array.isArray(data)) {
        data.forEach(d => {
            //const price = (200.0 + (Math.floor(Math.random() * 8000.0))) / 100.0;
            //const percent = Math.floor((Math.random() - 0.5) * 200) / 40.0;
            //const color = (percent > 0) ? "green" : "red";
            //const date: Date = (d.lastRefreshed) ? new Date(d.lastRefreshed) :
            //    new Date;
            //const strDate = date.toISOString().split('.')[0];

            htmlMid += `
					<tr >
                        <td>${d.symbol}</td>
                        <td>${d.open}</td>
                        <td>${d.high}</td>
                        <td>${d.low}</td>
                        <td>${d.price}</td>
                        <td>${d.latestTradingDay}</td>
                        <td>${d.previousClose}</td>
                        <td>${d.change}</td>
                        <td>${d.changePercent}</td>
                        <td>${d.updated}</td>
					</tr>
`; //-----------------------------------

        });
    }

    var strHtmlEnd = htmlMid +
        `
               </tbody>	 
            </table>
 </body>
</html>
`  ;


    //res.send(strHtmlEnd).status(200).end();
    return strHtmlEnd;


    //var __dirname = path.resolve(path.dirname(''));

    //// view engine setup
    //router.set('views', path.join(__dirname, 'views'));

    //res.render('stocks-table', { title: 'Stocks Table', stocks: data });
};
