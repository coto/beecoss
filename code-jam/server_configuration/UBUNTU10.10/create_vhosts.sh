####################################################################
# VirtualHost configuration on Httpd
####################################################################
# UBUNTU 10.10

phpMyAdminVersion="3.3.8.1"

mkdir -p /var/www/logs
rm -f /etc/apache2/sites-available/00* /etc/apache2/sites-enabled/00*

echo -e "$cyan===========================   [1] Test setup @ apache  ===========================$endColor"

mkdir -p /var/www/html/test/
echo "
<html> 
<head><title>Test home</title></head>
<body>
	<h1>Test</h1>
	<?php phpinfo();?>
</body>
</html> 
" > /var/www/html/test/index.php
echo "
ServerAdmin contact@protoboard.cl
<VirtualHost *:80>
        ServerName redmine.localhost

	DocumentRoot /var/www/html/test/

	<Directory /var/www/html/test>
                DirectoryIndex index.php
                Options -Indexes Includes ExecCGI
                AllowOverride None
                Order deny,allow
                Allow from all
        </Directory>

        ErrorLog  /var/www/logs/001-test-error.log
        CustomLog /var/www/logs/001-test-access.log combined
</VirtualHost>

" > /etc/apache2/sites-available/001-redmine.conf
 rm -f /etc/apache2/sites-enabled/001-redmine.conf
 ln -s /etc/apache2/sites-available/001-redmine.conf /etc/apache2/sites-enabled/001-redmine.conf
 
echo "127.0.1.1	test.localhost" >> /etc/hosts

echo -e "$cyan==========================    [2] Downloading PhpMyAdmin ===========================$endColor"

pmaFile="/var/www/phpMyAdmin-$phpMyAdminVersion-english.tar.gz"
if [ ! -f $pmaFile ];
then
	echo ">>>>>>>>>  File $pmaFile does not exists <<<<<<<<<<"
	rm -rf /var/www/phpmyadmin
	cd /var/www
	wget "http://downloads.sourceforge.net/project/phpmyadmin/phpMyAdmin/$phpMyAdminVersion/phpMyAdmin-$phpMyAdminVersion-english.tar.gz?use_mirror=ufpr"
	if [ -f phpMyAdmin-$phpMyAdminVersion-english.tar.gz?use_mirror=ufpr ];
	then
		mv phpMyAdmin-$phpMyAdminVersion-english.tar.gz?use_mirror=ufpr phpMyAdmin-$phpMyAdminVersion-english.tar.gz
	fi
	tar zxf phpMyAdmin-$phpMyAdminVersion-english.tar.gz
	mv phpMyAdmin-$phpMyAdminVersion-english phpmyadmin
	secretKey=$(echo -n `date +%s` | sha1sum | md5sum | cut -c1-30)
	
	echo ">>>>>>>>>  Secret key to config.inc.php is $secretKey <<<<<<<<<<"
	sed "/^.*blowfish_secret.*/ s/''/'$secretKey'/" /var/www/phpmyadmin/config.sample.inc.php > tmp
	cat tmp > /var/www/phpmyadmin/config.inc.php
else
	echo ">>>>>>>>> File $pmaFile exists, nothing to do <<<<<<<<<<"
fi

echo -e "$cyan==========================    [3] PhpMyAdmin setup @ apache  ===========================$endColor"


echo "
<VirtualHost *:80>
        ServerName myadmin.localhost

        DocumentRoot /var/www/phpmyadmin

        <Directory /var/www/phpmyadmin>
                DirectoryIndex index.php
                Options -Indexes Includes ExecCGI
                AllowOverride None
                Order deny,allow
                Allow from all
        </Directory>

        ErrorLog  /var/www/logs/002-myadmin-error.log
        CustomLog /var/www/logs/002-myadmin-access.log combined
</VirtualHost>
" > /etc/apache2/sites-available/002-myadmin.conf
 rm -f /etc/apache2/sites-enabled/002-myadmin.conf
 ln -s /etc/apache2/sites-available/002-myadmin.conf /etc/apache2/sites-enabled/002-myadmin.conf
 
echo "127.0.1.1	myadmin.localhost" >> /etc/hosts

echo -e "$cyan==========================    [4] Redmine setup @ apache  ===========================$endColor"

sudo apt-get install redmine redmine-sqlite redmine-mysql subversion ruby1.8-dev
sudo apt-get install libcurl4-openssl-dev libssl-dev zlib1g-dev apache2-prefork-dev

#sudo gem install passenger

#cd /var/lib/gems/1.8/gems/passenger-3.0.2/
#sudo bin/passenger-install-apache2-module

echo "
LoadModule passenger_module /usr/lib/ruby/gems/1.8/gems/passenger-2.1.3/ext/apache2/mod_passenger.so
PassengerRoot /usr/lib/ruby/gems/1.8/gems/passenger-2.1.3
PassengerRuby /usr/bin/ruby1.8

<VirtualHost *:80>
        ServerName redmine.localhost

        DocumentRoot /var/www/redmine
        
        RailsEnv production

        <Directory /var/www/redmine>
			Options Indexes FollowSymLinks MultiViews
            AllowOverride None
            Order allow,deny
            allow from all
		</Directory>

        ErrorLog  /var/www/logs/003-redmine-error.log
        CustomLog /var/www/logs/003-redmine-access.log combined
</VirtualHost>


" > /etc/apache2/sites-available/003-redmine.conf
 rm -f /etc/apache2/sites-enabled/003-redmine.conf
 ln -s /etc/apache2/sites-available/003-redmine.conf /etc/apache2/sites-enabled/003-redmine.conf
 
echo "127.0.1.1	redmine.localhost" >> /etc/hosts
 
echo -e "$cyan==========================    [3] Restart apache  ===========================$endColor"
 
 service apache2 restart

