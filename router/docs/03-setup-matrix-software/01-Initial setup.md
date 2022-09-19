# Matrix software

## Install the app

#Build:
```
git clone https://github.com/chanteblais/glaum_matrix.git
cd glaum_matrix
git checkout refactor-to-next

npm install
```


(it will likelly fail on rpi-ws281x)
`ld -lrt` doesn't work - workaround = change gyp python generator and remove LD flags from the LINUX command line
https://github.com/nodejs/node-gyp/blob/master/gyp/pylib/gyp/generator/make.py
vi ./usr/lib/node_modules/npm/node_modules/node-gyp/gyp/pylib/gyp/generator/make.py
change LINK_COMMANDS_LINUX
cmd_solink
cmd_solink_module