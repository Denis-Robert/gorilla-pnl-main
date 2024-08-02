# gorilla-pnl-main

# Backend Server

## Installing Necessary Libraries:
*requirements.txt*

1. flask (Python Web Server)
2. flask_cors (CORS Issues)
3. pymongo (Mongo DB)
4. psycopg2 (Postgres)
5. pdfkit (wkhtmltopdf to be installed seperately from web in the path '/usr/local/bin/wkhtmltopdf' for Ubuntu)

## Deal ID Generation
Temporary solution in *deal_id.py*, to be updated with proper internal ID generation logic

## DB Setup

PostgreSQL to be installed and user credentials to be setup. 
Dummy login credentials to be changed in *postgre.py*, *read_table.py*, *write_table.py*
*postgre.py* will initialize all the required tables for POSTGRES SQL

Download and Install local MongoDB (Ubuntu 20.04 and higher requires AVX/AVX 2.0 support to run Mongo 5.0+ - Might be unavailable on VM due to hypervisor software)
Note: Mongo 4.4 does not have this restriction but requires less than Ubuntu 18.04

## Running Web Server
*flask run* will start a development server

Production hosting requires a WSGI server (Eg. *Gunicorn*) and requires a reverse proxy like *nginx* to function properly


### All the commands given below are to be executed inside the project folder (i.e., *frontend*)

## Installing Libraries:
*npm i*

## Running on dev environment: 
*npm run dev*

## Creating build files:
*npm run build*

Creates *.dist* folder for the build files

## Running production version:
Serve the .dist files using *npm serve* or any other service 
