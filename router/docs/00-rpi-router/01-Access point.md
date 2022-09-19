# Install Raspberry Pi OS Lite Aarm64

# Setup
```
sudo apt update
sudo apt upgrade
sudo apt install hostapd dnsmasq iptables
sudo systemctl stop hostapd
sudo systemctl stop dnsmasq
```

## DHCP
```
sudo nano /etc/dhcpcd.conf
```

Add the following to the end to disable wpa_supplicant:

`denyinterfaces wlan0`

## Access point
```
sudo nano /etc/hostapd/hostapd.conf
```

Add the content:
```
ssid=Glåüm Matrix
interface=wlan0
driver=nl80211

hw_mode=g
channel=6
ieee80211n=1
wmm_enabled=1
ht_capab=[HT40][SHORT-GI-20][DSSS_CCK-40]
macaddr_acl=0
ignore_broadcast_ssid=0

auth_algs=1

ctrl_interface=/var/run/hostapd
ctrl_interface_group=0
```

Make sure the config here:
```
sudo nano /etc/default/hostapd
```

Points to the file we've edited before:

`DAEMON_CONF="/etc/hostapd/hostapd.conf"`

## DNS Masq

```
sudo mv /etc/dnsmasq.conf /etc/dnsmasq.conf.orig
sudo nano /etc/dnsmasq.conf
```

Content:
```
interface=wlan0
listen-address=192.168.5.1
bind-interfaces
server=8.8.8.8
domain-needed
bogus-priv
dhcp-range=192.168.5.100,192.168.5.200,24h
```

## IP Forward

```
sudo nano /etc/sysctl.conf
```

Uncomment this line:

`net.ipv4.ip_forward=1`

Add the following rules:

```
sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE  
sudo iptables -A FORWARD -i eth0 -o wlan0 -m state --state RELATED,ESTABLISHED -j ACCEPT
sudo iptables -A FORWARD -i wlan0 -o eth0 -j ACCEPT
```

Save them:
```
sudo sh -c "iptables-save > /etc/iptables.ipv4.nat"
```

Load them at startup:
```
sudo nano /etc/rc.local
```

Add this before `exit 0`:

`iptables-restore < /etc/iptables.ipv4.nat`

## Done

You should have a network "pulling" internet from the LAN interface (via DHCP) and serving in the WLAN Network "Glåüm Matrix"