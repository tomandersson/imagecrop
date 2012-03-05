# Simple ImageCrop-prototype
This is a prototype/PoC for a dynamic, on-the-fly image-cropper, written in nodejs. Being a prototype, it doesn't contain any error handling or tests or anything, and is generally pretty stupid, but it allows you to:

 * Edit an image in your browser, choosing a crop for some predetermined sizes
 * Save the crop metadata in mongo
 * Access the crop-variants in the browser as images, with cropping done on-the-fly, like http://localhost:3000/image/1.23456/580x326

For it to work, you need 

 * mongo installed and mongod running
 * A pre-filled entry in your mongo-db, in the database 'imageHandler' and the collection 'images', i.e.:
    db.images.save({'id':'1.23456', 'image':'SNC11127.JPG', 'dimensions':{})
 * imagemagick installed

And that should be it.

To edit the image, simply start nodejs using 'node app.js' from the imagecrop directory, then navigate to http://localhost:3000.
