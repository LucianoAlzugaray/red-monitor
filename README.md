COMO CONVERTIR LOS DATOS DE SQLITE A CSV

$ sqlite3 database.sqlite 
SQLite version 3.22.0 2018-01-22 18:45:57
Enter ".help" for usage hints.

sqlite> .headers on
sqlite> .mode csv
sqlite> .output data.csv
sqlite> SELECT * FROM registers;
sqlite> .quit
