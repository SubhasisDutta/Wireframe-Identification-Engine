

# Dependency

1. Currently the system is only tested in Ubuntu.
2. Need to have Tesseract installed.
   To install Tesseract use : sudo apt install tesseract-ocr
3. Set the Environment Variable in /etc/environment or ~ .bashrc
   export TESSDATA_PREFIX=’/usr/share/tesseract-ocr/tessdata’

	To use tesseract independently:
	tesseract <location of the input image> <location and file name of where the txt file will be created> // Need to see how to integrate with direct input from database and direct output to node
  // for now use the bash shell way




