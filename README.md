# docx-processor

Started as a Tech Friday project related to ticket EN-27 to extract the text from a docx file.

## DOCX files

Docx files are essentially zip files, if you copy and rename with extension .zip then you can open them as an archive and see the files that make up the docx.

The file that contains the document content is located in word/document.xml and as the name suggests it is an xml file.

The xml is in ooxml format, all text elements are stored within the hierachy in <w:t> tags.

## Initial design

The initial design does the following:
1. takes in a path to a local file
2. reads it (as a zip file) using node-stream-zip
3. finds the document.xml file
4. reads the contents of the document.xml file as a string of xml
5. uses xml-js to parse the xml into json format (cant' use an zml processor on the server side of things)
6. processes the element tree recusrsively looking for <w:t> and extracting the text value
7. logs the results to the console

## Running the project

To run the project use:

```
npm run start 'path-to-file' [keep-white-space]
```

where path-to-file is a valid document path
keep-white-space can be any of t, true, y, yes, 1

## TODOs

1. Add error handing for file not found
2. Add support for choosing files from S3
3. Add tests
4. Add ability to compare two documents
5. Wrap in a lambda function and return text