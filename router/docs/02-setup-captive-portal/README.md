# Software

With the networking done, let's do the software parte:

SSH into the PI

## Install required software:

```shell
opkg update
opkg remove wpad-basic-wolfssl
opkg install wpad-wolfssl git git-http coova-chilli nano php8-cgi unzip freeradius3 freeradius3-common freeradius3-mod-pap freeradius3-mod-preprocess freeradius3-mod-files freeradius3-mod-radutmp freeradius3-mod-attr-filter hostapd-utils node node-npm python3
```

# Setup the Captive Portal

## Stop and disable coova-chilli
```shell
/etc/init.d/chilli stop
/etc/init.d/chilli disable
```

The final configuration will be made later

## Check PHP7

```shell
root@OpenWrt:~# ls /usr/bin/php*
/usr/bin/php-cgi    /usr/bin/php8-cgi   /usr/bin/php8-fcgi
```

## Configure uhttpd
Edit the main configuration file of the web server

```shell
nano /etc/config/uhttpd
```

Add the PHP interpreter under `config uhttpd 'main'` and save file

```text
list interpreter ".php=/usr/bin/php-cgi"
```

Restart uhttpd
```shell
service uhttpd restart
```

## Check if php is working

To check if php is running, we will create a test page in the /www directory

```shell
nano /www/test.php
```

Paste the following code into the newly created file

```html
<html lang="en">
    <head>
        <title>PHP Test</title>
    </head>
    <body>
        <?php
            echo '<p>Hello World</p>';
            echo 'Current PHP version: ' . phpversion();
            echo phpversion('tidy');
        ?>
    </body>
</html>
```

- Navigate to http://&lt;IP OF THE LAN INTERFACE>/test.php and make sure you see somenthing like:

```text
Hello World
Current PHP version: 8.1.9
```

### Install sample login page

```shell
cd /www
wget https://github.com/mongramosjr/hotspot-login/archive/refs/heads/master.zip
unzip master && rm master
```

Edit hotspotlogin.php to allow http and have a look to $uamsecret

```shell
nano hotspot-login-master/hotspotlogin.php
```

Change the variable `uamsecret` to your needs and comment out the SSL part to allow HTTP requests

```text
# Shared secret used to encrypt challenge with. Prevents dictionary attacks.
# You should change this to your own shared secret.
$uamsecret = "UzlcS2RmUCAkNFRUI19RUmJVcSk=";

…

# /* if SSL was not used show an error */
# if (!($_SERVER['HTTPS'] == 'on')) {
#    include('hotspotlogin-nonssl.php');
#    exit(0);
# }
```

Restart uhttpd

```shell
service uhttpd restart
```

- Navigate to http://&lt;IP OF THE LAN INTERFACE>/hotspot-login-master/hotspotlogin.php

![](1-hotspot-login-test.png)

## Coova chili

Save original config file and recreate one

```shell
mv /etc/config/chilli /etc/config/chilli-orig
nano /etc/config/chilli
```

```text
config chilli

option interval 3600
option swapoctets 1

######## TUN and DHCP Parameters ########

option tundev 'tun0'
option dhcpif 'wlan0'
option net 10.1.1.0/24
option lease 600
option dns1 10.0.1.30
option dns2 10.0.1.30
option ipup '/etc/chilli/up.sh'
option ipdown '/etc/chilli/down.sh'

######## Radius parameters ########

option radiusserver1 '127.0.0.1'
option radiusserver2 ''
option radiusauthport 1812
option radiusacctport 1813
option radiussecret 'testing123'
option radiusnasid 'ap001'
option ssid 'ACME-company'

######## Universal access method (UAM) parameters ########

option uamlisten 10.1.1.1
option uamserver 'http://10.0.1.30/hotspot-login-master/hotspotlogin.php'
option uamsecret 'UzlcS2RmUCAkNFRUI19RUmJVcSk='
option uamallowed ''
option uamdomain ''
option uamanydns 1
option uamaliasname 'login'
option nouamsuccess 1
```

Note that:
- The NET Range is the same as the Rpi's WAN interface
- The DNS IP is the IP of the Rpi's LAN interface
- Make sure the uamsecret is the same as the one defined in the PHP page
- Make sure the IP in the uamserver is the RPi's LAN

## Freradius

Create a new site in directory /etc/freeradius3/sites-available

`nano /etc/freeradius3/sites-available/lede`

```text
server lede {
    listen {
        type = auth
        ipaddr = *
        port = 1812
        limit {
            max_connections = 16
            lifetime = 0
            idle_timeout = 30
        }
    }
    listen {
        type = auth
        ipv6addr = ::    # any. ::1 == localhost
        port = 0
        limit {
            max_connections = 16
            lifetime = 0
            idle_timeout = 30
        }
    }
    authorize {
        #preprocess
        files
        pap
    }
    authenticate {
        Auth-Type PAP {
           pap
       }
    }
}
```
Create a new inner tunnel in directory /etc/freeradius3/sites-available

`nano /etc/freeradius3/sites-available/lede-inner-tunnel`

```text
server inner-tunnel {
    listen {
        ipaddr = 127.0.0.1
        port = 18120
        type = auth
    }
    authorize {
        files
        pap
    }
    authenticate {
        Auth-Type PAP {
            pap
        }
    }
    session {
        radutmp
    }
    post-auth {
        Post-Auth-Type REJECT {
            attr_filter.access_reject
        }
    }
}
```

Delete the default symlinks and create new ones in directory /etc/freeradius3/sites-enabled

```shell
rm /etc/freeradius3/sites-enabled/*
ln -s /etc/freeradius3/sites-available/lede /etc/freeradius3/sites-enabled/
ln -s /etc/freeradius3/sites-available/lede-inner-tunnel /etc/freeradius3/sites-enabled/
```

Add your visitor name/passwords by editing following file

`nano /etc/freeradius3/mods-config/files/authorize`

```
bob     Cleartext-Password := "hello"
        Reply-Message := "Hello, %{User-Name}"
```

```shell
/etc/init.d/radiusd enable
/etc/init.d/radiusd start
```
# DNSMasq

To use this without internet (not real DNS server available), configure DNSMasq to return a known address for any query:

`nano /etc/dnsmasq.conf`

Add the following:
```text
address=/#/142.250.72.132
```

# Auto-disconnect users

Users' sessions are active for certain amount of time in CoovaChilli. This daemon will ensure the sessions are logged out uppon disconnecting from the AP.

`nano /autodisconnect.sh`

```text
#!/bin/sh
if [[ $2 == "AP-STA-CONNECTED" ]]
then
  echo "someone has connected with mac id $3 on $1" >> /tmp/autodisconnect.log
fi

if [[ $2 == "AP-STA-DISCONNECTED" ]]
then
  echo "someone has disconnected with mac id $3 on $1" >> /tmp/autodisconnect.log;
  chilli_query dhcp-release $3;
fi
```

