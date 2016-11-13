# WireframeTagging
This project will process an image or set of images and identify the properties of different User or Annotated Controls depicted in the Wireframe Image.  

# Dependency

### Currently the system is only tested in Ubuntu.

#### Setup Tesseract
To install Tesseract use :
```
sudo apt install tesseract-ocr
```
Set the Environment Variable in /etc/environment or ~ .bashrc
```
export TESSDATA_PREFIX=’/usr/share/tesseract-ocr/tessdata’
export NODE_ENV = "development"
```
To use tesseract independently:
```
tesseract <location of the input image> <location and file name of where the txt file will be created>
```
TODO: Need to see how to integrate with direct input from database and direct output to node
 for now use the bash shell way

#### Setup and install Tensorflow
Python 2.7 should be set as default python, check with
```
$ python -v
```
a. Install pip :
```
$ sudo apt-get install python-pip python-dev
```
b. Based on hardware select binary:
For Ubuntu/Linux 64-bit, CPU only, Python 2.7
```
$ export TF_BINARY_URL=https://storage.googleapis.com/tensorflow/linux/cpu/tensorflow-0.11.0rc1-cp27-none-linux_x86_64.whl
```
c. Install Tensor flow using pip
```
$ pip install --upgrade $TF_BINARY_URL
```
d. Check tensorflow is installed in location
   /usr/local/lib/python2.7/dist-packages/tensorflow

#### Setup and install Mongo DB
Ref : https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-16-04

a. Get Mongodb repo Key
```    
$ sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
```
b. Add to apt-get
```    
$ echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
$ sudo apt-get update
$ sudo apt-get install -y mongodb-org
```
c. Create a service for MongoDB
```
$ sudo nano /etc/systemd/system/mongodb.service
```
Paste the below
```	
[Unit]
Description=High-performance, schema-free document-oriented database
After=network.target

[Service]
User=mongodb
ExecStart=/usr/bin/mongod --quiet --config /etc/mongod.conf

[Install]
WantedBy=multi-user.target
```	
d. Start Service
```
$ start the newly created service with systemctl
```
e. Check Service Status
```    
$ sudo systemctl status mongodb
```
f. Enable MongoDB when System Starts
```    
$ sudo systemctl enable mongodb
```
#### Setup RoboMongo (for development)
Download Zip and Extract to use bin/robomongo
#### Install Node JS
Ref : http://tecadmin.net/install-latest-nodejs-npm-on-ubuntu/#
```	
$ sudo apt-get install python-software-properties
$ curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
$ sudo apt-get install nodejs
```	

#### Install Git
```
$ sudo apt-get install git
```

#### Install Global node packages
```	
$ sudo npm install -g bower
$ sudo npm install -g nodemon
$ sudo npm install -g forever
$ sudo npm install -g gulp
```

#### Start the Mongo DB Server as per setup and configure it in
[webapp/server/config/config.js](webapp/server/config/config.js)
    
### Setup and Start the Web App as per steps in 
[webapp/ReadMe.md](webapp/ReadMe.md)
