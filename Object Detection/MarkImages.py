import numpy
import cv2

print "Executing ..."
print "Loading Image for Thresholding ..."
img = cv2.imread('Example1.png',0)
#cv2.imshow('image/png',img)
#cv2.waitKey(0)
#cv2.destroyAllWindows()
print "Median Filtering ..."
img_filt = cv2.medianBlur(img, 5)
#cv2.imshow('image',img_filt)
#cv2.waitKey(0)
#cv2.destroyAllWindows()
print "Adaptive Thresholding ..."
img_th = cv2.adaptiveThreshold(img_filt,255,cv2.ADAPTIVE_THRESH_GAUSSIAN_C,cv2.THRESH_BINARY,11,2)
#cv2.imshow('image',img_th)
#cv2.waitKey(0)
print "Finding Countours ..."
contours, hierarchy = cv2.findContours(img_th, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
print "Marking Countours ..."
input_img = cv2.imread('Example1.png')
for c in contours:
    rect = cv2.boundingRect(c)
    if rect[2] < 10 or rect[3] < 10: continue
    #print cv2.contourArea(c)
    x,y,w,h = rect
    cv2.rectangle(input_img,(x,y),(x+w, y+h),(255,255,0),3)
    #cv2.putText(img)
#print contours
#cv2.drawContours(img,contours, -1, (0,255,0), 3)
cv2.imwrite('Output_Example1.png',input_img)
print "Done"
#cv2.imshow('image/png',input_img)
#cv2.waitKey(0)
#cv2.waitKey(0)