go-backend
==========

Installation
------------
```bash
# Install prerequisites
apt-get install golang mongodb
go get labix.org/v2/mgo

# Clone source
cd ~
git clone https://github.com/wtsi-hgi/hgi-web.git

# Configure
cd ~/hgi-web/go-backend
cp hgibackend.conf.tmpl hgibackend.conf
# now edit hgibackend.conf to configure
```

Running
-------

```bash
export GOPATH=$(echo ~/hgi-web/go-backend/go)
cd ~/hgi-web/go-backend
./hgi-web-backend-daemon.sh
```
