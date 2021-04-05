import { getRenderTableStyle } from "../shared/render.Table.style";
import { Rate } from "./rate.entities";

export  function ratesRenderTable( data : Rate[]) : string {
    var style = getRenderTableStyle();
    var strHtml0 =
        `
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8" />
    <title>RatesTab</title>
     ${style}
</head>
<body>
    <h2> Rates Table </h2>
   
            <table>
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Rate</th>
                        <th>Bid</th>
                        <th>Ask</th>
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
            const date: Date = (d.lastRefreshed) ? new Date(d.lastRefreshed) :
                new Date;
            const strDate = date.toISOString().split('.')[0];

            htmlMid += `
					<tr >
							<td>${d?.code} </td>
							<td>${d?.name}</td>
							<td>${d?.rate}</td>
							<td>${d?.bid}</td>
							<td>${d?.ask}</td>
							<td>${strDate}</td>
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
