SET TRANSACTION READ WRITE; 
CREATE TABLE Stocks (
    symbol        	varchar(8) CONSTRAINT firstkey PRIMARY KEY,
    region        	varchar(8)  NULL,
    shortname     varchar(20)  NULL,
    quoteType     	varchar(10) NOT NULL,
    index           	varchar(10) NOT NULL,
	score       		double NOT NULL,
    typeDisp       	varchar(80) NOT NULL,
	longname      varchar(20)  NULL,
	percent       	double NOT NULL,
    updated      	date
);
