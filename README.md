### BASIC NOTES ON HOW TO USE
```text
Remember this requires that a cron job or scheduled event is implemented on the server.  This is required because there are NO hourly stats available on the hardware
so it wa necessary to write a scheduled job / event that would run every nine minutes to get the stats after the full hour and create an array object.

!!IMPORTANT, THE ARRAY FOR HOURLY STATS IS WIPED CLEAR AT MIDNIGHT SO THAT ONLY THE PRESENT DAYS STATS WILL BE AVAILABLE.
```

## To run scheduled commands
```text
On Linux type > crontab -e
> change path-to-your-project to where it lives on the server, absolute path.
* * * * * cd /var/www/html  && php artisan schedule:run >> /dev/null 2>&1
```
### To run task on Windows
```text
1

Create batch file with these two lines

cd c:\laravel-project\
c:\php5\php.exe artisan schedule:run 1>> NUL 2>&1
Go to Windows 10 Task Scheduler

Click Create basic task, choose When I logon trigger and then choose Start a program -> your .bat file. 
Check Open properties dialog option and click Finish. In task properties click Triggers, 
then click New and add new trigger Repeat task every 1 minute
```
### Basic package to install for laravel
```text
sudo apt install openssl php-bcmath php-curl php-json php-mbstring php-mysql php-tokenizer php-xml php-zip

```
