Media Goo
==============
An interactive Audio performance visualization using:

* [Goo Engine](http://www.gootechnologies.com/)
* [Web Audio API](http://www.w3.org/TR/webaudio/)
* [Node.js](http://nodejs.org/)
* [Socket.IO](http://socket.io/)

By:

* Koen Boncquet
* Robby Wauters
* Stefan Borghys (from [Villa Borghese](http://en.wikipedia.org/wiki/Villa_Borghese_gardens))

A project made in the 24 hour [Media Hackathon 2014](http://mediahackathon.be/).

## Description
At a live performance, every visitor can use the Client app on its smartphone to take pictures and let them appear on stage in a 3D point cloud that is reacting to the live music.

![](https://raw.github.com/RobbyWauters/MediaGoo/master/server/viz.jpg)

## Server
The Node.js server hosts the Visualization and Client app and resizes and converts the taken pictures.
The converted, cropped and resized images (via ImageMagick) are send to the Visualization app through Websockets.

### How To Run
#### Installing ImageMagick
* [install brew](http://brew.sh/)
* ```brew upgrade```
* ```brew update```
* ```brew install imagemagick```
* test it: eg run ```convert``` or run ```montage```

#### Install Dependencies
* ```npm install```

#### Run Node.js Server
* ```node app.js```


## Visualization (on stage)
* Connect your sound output to the line-in of your computer
* ```http://IP-ADDRESS/viz```

## Client
* ```http://IP-ADDRESS/```

## Config
Edit ```app/config.js``` 'till you're happy.




