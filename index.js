import StreamZip from 'node-stream-zip';
import xml2js from 'xml-js';

const [,, docPath, removeWhitespace] = process.argv;

const keepWhiteSpace = !removeWhitespace || ['t', 'true', '1', 'y', 'yes'].indexOf(removeWhitespace) < 0

function getTextForRun(textElement) {
  let textValue = '';
  const text = textElement.elements.find(e => e.type === 'element' && e.name === 'w:t');
  if (text && text.elements && text.elements.length) {
    textValue += keepWhiteSpace ? text.elements[0].text : text.elements[0].text.replace(/\s/g,'');
  }
  return textValue;
}

function processElement(element) {
  let textValue = '';
  if (element.type === 'element' && (element.name === 'w:r' || element.name === 'w:hyperlink')) {
    textValue += getTextForRun(element);
  } else if (element.elements && element.elements.length) {
    element.elements.forEach(subElement => {
      textValue += processElement(subElement)
    })
  }
  return textValue;
}

async function processFile () {
  // eslint-disable-next-line new-cap
  const zip = new StreamZip.async({ file: docPath });

  const data = await zip.entryData('word/document.xml');
  await zip.close();

  const jsonString = xml2js.xml2json(data.toString(), {compact: false});
  const jsonObj = JSON.parse(jsonString);
  const [ { elements: [ body ] }] = jsonObj.elements;
  const documentText = body.elements.reduce((result, ele) => result + processElement(ele), '');

  // TODO: Replace with sensible outcome!
  // eslint-disable-next-line no-console
  console.log(documentText)
}

(async () => processFile())();
;
