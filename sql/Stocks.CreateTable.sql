SET TRANSACTION READ WRITE; 
CREATE TABLE Stocks (
    code        	varchar(10) CONSTRAINT firstkey PRIMARY KEY,
    region        	varchar(10)  NULL,
    name       	varchar(30) NOT NULL,
	rate       		double NOT NULL,
	percent       	double NOT NULL,
 	bid        		double  NULL,
 	ask        		double  NULL,
    stored      	date,
    lastRefreshed   date
);
