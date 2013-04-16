hgi-web
=======

HGI-web is a web frontend/backend for management of HGI systems, built using 
brunch, node.js, chaplin.js, Go, and others.


Install (Ubuntu Linux example)
------------------------------

```bash
# Install prerequisites (node ~ 0.8.23, npm ~ 1.2.18, brunch)
sudo apt-get install python-software-properties python g++ make
sudo add-apt-repository ppa:chris-lea/node.js-legacy
sudo apt-get update
sudo apt-get install nodejs=0.8.23-1chl1~precise1
sudo apt-get install npm=1.2.18-1chl1~precise1
sudo npm install -g brunch

# Clone hgi-web source from git and configure
git clone https://github.com/wtsi-hgi/hgi-web.git
cd hgi-web/node-frontend/
cp app/settings.coffee.tmpl app/settings.coffee
# don't forget to edit app/settings.coffee if required
npm install .

# Run
brunch watch --server
```


Note: The usage of a range of years within a copyright statement contained within this distribution should be interpreted as being equivalent to a list of years including the first and last year specified and all consecutive years between them. For example, a copyright statement that reads 'Copyright (c) 2005, 2007- 2009, 2011-2012' should be interpreted as being identical to a statement that reads 'Copyright (c) 2005, 2007, 2008, 2009, 2011, 2012' and a copyright statement that reads "Copyright (c) 2005-2012' should be interpreted as being identical to a statement that reads 'Copyright (c) 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012'."

