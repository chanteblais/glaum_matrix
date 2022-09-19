# Setup nodogsplash

```
sudo apt install git libmicrohttpd-dev
```

```
cd ~
git clone https://github.com/nodogsplash/nodogsplash.git
cd ~/nodogsplash
make
sudo make install
```

```
sudo nano /etc/nodogsplash/nodogsplash.conf
```

You might see this line, if so, comment it out:

`#GatewayInterface br-lan`

Add the followin after it:

```
GatewayInterface wlan0
GatewayAddress 192.168.5.1
MaxClients 250
AuthIdleTimeout 480
```

Now, add this one inside the `FirewallRuleSet users-to-router {` section:

`FirewallRule allow tcp port 3000`

There should be already other rules there for other ports, this will just allow access to NodeJS later.
You can technically run a different port, just adjust the above.

## Autodisconnect

To make sure users are deauthenticated from nodosplash when they disconnect from wifi, let's listen to the AP and disconnect the users:

```
sudo nano /etc/nodogsplash/autodisconnect.sh
```
With the content:
```
#!/bin/bash
if [[ $2 == "AP-STA-CONNECTED" ]]
then
  echo "someone has connected with mac id $3 on $1" >> /var/log/autodisconnect.log
fi

if [[ $2 == "AP-STA-DISCONNECTED" ]]
then
  echo "someone has disconnected with mac id $3 on $1" >> /var/log/autodisconnect.log;
  ndsctl deauth $3 >> /var/log/autodisconnect.log;
fi
```

Now, add the following to 

```
sudo nano /etc/rc.local
```

`hostapd_cli -a /etc/nodogsplash/autodisconnect.sh &` 

which should look like this now:

```
iptables-restore < /etc/iptables.ipv4.nat;
nodogsplash;
hostapd_cli -a /etc/nodogsplash/autodisconnect.sh &

exit 0
```

PS: You can see users connecting/disconnecting from: `/var/log/autodisconnect.log`:

> someone has connected with mac id 28:6a:ba:1e:32:85 on wlan0

> someone has disconnected with mac id 28:6a:ba:1e:32:85 on wlan0

> Client 28:6a:ba:1e:32:85 deauthenticated.


## Done

Now, after connecting to Wifi you'll see a Captive portal, click continue and you'll be able to access the internet and also a service running on port 3000.