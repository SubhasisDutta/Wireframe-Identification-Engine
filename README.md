# WireframeTagging
This project is a concept demonstrator to semi-autonomously convert a wireframe design image to user interface code.  

# Demo

App Link : http://35.160.238.107:6060/
### Demo app to help extract UI Component's information for converting Image Page to Freestyle Page.

For most of the functions you will need to be logged in. 
You can either create a new account 
(During Sign Up Email is the username)

Currently the following functions have been implemented:

1. Upload an image and crop controls and label them. This will be used to build our training data.
         (Url: http://35.160.238.107:6060/contribute/upload) 
2. See the list of controls available as training data set.
         (URL: http://35.160.238.107:6060/contribute/list )
3. Upload an Image Page and crop the relevant part that needs to be considered as a Low-Fidelity Page. Currently please upload image with dimension less than 1500 px. (http://35.160.238.107:6060/process/upload)
4. After the Image is uploaded, the image can be annotated by marking the area from which we want controls to be identified. (http://35.160.238.107:6060/process/annotate/5829199cb7780122ecf8246f )
_Please refresh this page if the canvas does not load the image after some time._
5. Access all Image Pages Uploaded by a user. (http://35.160.238.107:6060/pages )
6. Access all Images Pages Marked as Public. (http://35.160.238.107:6060/public ) [No Login Required]
7. View the annotated Image Page along with Controls listed. After we have integrated the OCR and Object Detection process we will display it in this page.(http://35.160.238.107:6060/pagedetail/5829199cb7780122ecf8246f )

A Freestyle Page created in BUILD based on Image dimension obtained from this web App. (https://standard.build.me/api/projects/6f4f7e0f2acdb33d0cec176c/prototype/snapshot/latest/index.html#/14790995350785238_S1 ) 

In its current state this app can help in:

1. Collect training and testing data in the form of images and labels and store it in a database that can then be used for building training models.
2. Allow user to annotate an image of a User Interface Design and extract information like position, Width and height of the identified UI components.
3. Allow to run an Optical Character Recognition process on selected UI components and extract ant text information on them with Tesseract. 
4. Classify User Interface Components into their type using Deep Learning provided through IBM Watson.
5. Perform OCR using Google Vision API.

A sample of Image Classification to find the Text and the Control Type from an Image Page.
![image](https://cloud.githubusercontent.com/assets/1586038/21286110/bcfd0f58-c3ff-11e6-9397-3c5819ee6dfc.png)


# Dependency
```
NodeJs, MongoDB, Amazon S3
```

### Currently the system is only tested in Ubuntu.


#### Start the Mongo DB Server as per setup and configure it in
[webapp/server/config/config.js](webapp/server/config/config.js)
    
### Setup and Start the Web App as per steps in 
[webapp/ReadMe.md](webapp/ReadMe.md)
