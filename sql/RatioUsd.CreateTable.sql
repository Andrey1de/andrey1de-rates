SET TRANSACTION READ WRITE; 
CREATE TABLE RateUsd (
    code        	char(3) CONSTRAINT firstkey PRIMARY KEY,
    name       		varchar(30) NOT NULL,
	rate       		double NOT NULL,
 	bid        		double NOT NULL,
 	ask        		double NOT NULL,
    stored      	date,
    lastRefreshed   date,
 
);
