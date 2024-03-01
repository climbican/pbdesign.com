# Installation
```text
download / copy the project into the web server
to make it easy put the project in the root directory of the web server and set the root directory to ***/public  The public folder is in the root of the project.
if you do not set the root to public you will need to navigate to http://xxxxxx/public to see the content
within the root directory run php composer.phar install, this will install all the necessary framework packages.
navigate to the URL and it should all work, if not the first thing to check is the file permissions.  I was not able to find anything on windows permissions
but I'm assuming it's more automatic on windows and the web folder is owned by the web server user.

If this does not work, you can look at the web server log files or the laravel log for error under root/storage/logs/laravel.log

If that fails then email me with the issue.  michael@ledgedog.com

NOTE: keep in mind that this uses http, since the solarlog hardware is on http.
NOTE: Repository URL: https://github.com/climbican/pbdesign.com
```


1. Sometimes you will need to change the DocumentRoot to include the ****/public path depending on your setup
2. Use terminal to clone the folders to your server with: clone ***git@github.com:climbican/pbdesign.com.git ./***     NOTE: "the ./ at the end tells git to clone to current directory"
3. Make sure that all folder / file permissions are correct, it seems to be more complicated on Linux.  I found this link if there are any issues: https://learn.microsoft.com/en-us/answers/questions/696965/windows-11-folder-read-write-permissions-dont-work
4. Install Composer https://getcomposer.org/doc/00-intro.md  scroll down to the windows section.
5. in the html or htdocs folder where you have all the laravel files type: composer install (This will install all the vendor files)
6. Next set a cron job to execute every hour, see section >> **To run task on Windows**

***NOTE: The most common issue with laravel not working as expected is the folder and file permissions***


## BASIC NOTES ON HOW TO USE
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
## To run task on Windows
```text
Create batch file with these two lines

cd c:\laravel-project\
c:\php5\php.exe artisan schedule:run 1>> NUL 2>&1

Go to Windows 10 Task Scheduler

Click Create basic task, choose When I logon trigger and then choose Start a program -> your .bat file. 
Check Open properties dialog option and click Finish. In task properties click Triggers, 
then click New and add new trigger Repeat task every 1 minute
```
## Basic package to install for laravel
```text
sudo apt install openssl php-bcmath php-curl php-json php-mbstring php-mysql php-tokenizer php-xml php-zip

```

>**API token for the project permissions**
```text 
What you will need: 

In the root folder there is a .env file at the bottom there is an application ID 
value that needs to be set from the Windows Azure app permissions center.  I used the new MS Graph API to se tup the data.

tenant id -> This shouldn't change it's your customer id if I remember correctly
application -> this is the application identifier that I created for the app that accesses the calendar.  If they removed the app then they will have to
figure that out on their own.  I can't remember all the steps.  Hopefully it's still there and can be left as is.
certificate id -> Honestly I can't remember what this one was, I think it was part of the application id after verification

The important part is to give the app the specific permissions to access the calendar/s necessary to run the app.  Then give the user account the 
permissions access to the app.

Here is the MS Exchange Graph API info URL

https://learn.microsoft.com/en-us/graph/api/calendar-list-events?view=graph-rest-1.0&tabs=http
```
##Routes
```text
The routes you will need are as follows:
for the internal page use http://xxxxxxxx/  
this is the index page and will have both stats and the banner in it

for the website page use http://xxxxxx/site/chart
use this in a <i frame></i frame> or something similar

The bulk of the function is in the app/Http/Controllers/FetchCalendarEvents.php page
this has all the permissions and code to authenticate with MS, get a token and add it to the system and make the call.
```

##Example site_config.conf file
```text
<VirtualHost *:80>
    ServerName pbdesign.com
    DocumentRoot /var/www/pbdesign.com/htdocs
    <Directory /var/www/pbdesign.com/htdocs>
        Order allow,deny
        Allow from all
        AllowOverride All
    </Directory>
    SSLEngine On
    SSLCertificateFile /etc/ssl/certs/pbdesign_com.crt
    SSLCACertificateFile /etc/ssl/certs/pbdesign_com.ca-bundle
    SSLCertificateKeyFile /etc/ssl/private/pbdesign_com.key
    CustomLog ${APACHE_LOG_DIR}/pbdesign.com-access_log combined
    ErrorLog ${APACHE_LOG_DIR}/pbdesign.com-error_log
</VirtualHost>


```

