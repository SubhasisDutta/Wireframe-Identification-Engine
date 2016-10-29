

# Dependency

1. Currently the system is only tested in Ubuntu.
2. Need to have Tesseract installed.
   To install Tesseract use : sudo apt install tesseract-ocr
3. Set the Environment Variable in /etc/environment or ~ .bashrc
   export TESSDATA_PREFIX=’/usr/share/tesseract-ocr/tessdata’

	To use tesseract independently:
	tesseract <location of the input image> <location and file name of where the txt file will be created> // Need to see how to integrate with direct input from database and direct output to node
  // for now use the bash shell way

4. Need to Setup and install tensor flow
	- Make sure Python 2.7 is already installed
	a. Need to install pip : sudo apt-get install python-pip python-dev
        b. Based on hardware select binary
        # Ubuntu/Linux 64-bit, CPU only, Python 2.7
        $ export TF_BINARY_URL=https://storage.googleapis.com/tensorflow/linux/cpu/tensorflow-0.11.0rc1-cp27-none-linux_x86_64.whl
        c. Install Tensor flow using pip
           pip install --upgrade $TF_BINARY_URL
        d. Check tensorflow is installed in location 
           /usr/local/lib/python2.7/dist-packages/tensorflow

5. Setup and install Mongo DB
    Ref : https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-16-04
    Get Mongodb repo Key 
    $ sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
    Add to apt-get
    $ echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
    $ sudo apt-get update
    $ sudo apt-get install -y mongodb-org
    Create a service for MongoDB
    $ sudo nano /etc/systemd/system/mongodb.service 
    Paste the below
	[Unit]
	Description=High-performance, schema-free document-oriented database
	After=network.target
	
	[Service]
	User=mongodb
	ExecStart=/usr/bin/mongod --quiet --config /etc/mongod.conf
	
	[Install]
	WantedBy=multi-user.target
    Start Service 
    $ start the newly created service with systemctl
    Check Service Status 
    $ sudo systemctl status mongodb
    Enable MongoDB when System Starts 
    $ sudo systemctl enable mongodb
6. Install RoboMongo
   Download Zip and Extract to use bin/robomongo
7. Install Node JS
   Ref : http://tecadmin.net/install-latest-nodejs-npm-on-ubuntu/#
	$ sudo apt-get install python-software-properties
	$ curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
	$ sudo apt-get install nodejs
8. Install Global node packages
	$ sudo npm install -g bower
	$ sudo npm install -g nodemon
	$ sudo npm install -g forever 
7. Setup and Start the Web App
	To run this application, start your mongo server & 
	do the following from the command line:
	$ Webapp/bower install
	$ webapp/npm install
	$ webapp/nodemon server.js

