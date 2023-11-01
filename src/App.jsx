import { useState } from 'react';
import togeojson from 'togeojson';
import Clipboard from 'clipboard';

function App() {
  const [conversionStatus, setConversionStatus] = useState('');
  const [geojsonData, setGeojsonData] = useState(null);

  const handleConvertClick = (event) => {
    event.preventDefault();
    const kmlFileInput = document.getElementById('kmlFile');
    const kmlFile = kmlFileInput.files[0];

    if (kmlFile) {
      const reader = new FileReader();

      reader.onload = async (event) => {
        try {
          const kmlContent = event.target.result;
          const kmlParser = new DOMParser();
          const kmlDoc = kmlParser.parseFromString(kmlContent, 'text/xml');
          const geojson = togeojson.kml(kmlDoc);
          setGeojsonData(geojson);
          setConversionStatus('Conversion completed.');
        } catch (error) {
          setGeojsonData(null);
          setConversionStatus('Error: ' + error.message);
        }
      };

      reader.readAsText(kmlFile);
    } else {
      setGeojsonData(null);
      setConversionStatus('Please select a KML file.');
    }
  };

  const handleCopyClick = () => {
    if (geojsonData) {
      const jsonString = JSON.stringify(geojsonData, null, 2);
      const textarea = document.createElement('textarea');
      textarea.value = jsonString;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert('GeoJSON copied to clipboard!');
    }
  };

  // Initialize clipboard.js
  new Clipboard('#copyButton');

  return (
    <div className="App">
      <h1>KML to GeoJSON Converter</h1>
      <form>
        <label htmlFor="kmlFile">Select a KML file:</label>
        <input type="file" id="kmlFile" accept=".kml" />
        <button type="button" onClick={handleConvertClick}>Convert</button>
      </form>
      <p>Conversion status: {conversionStatus}</p>
      {geojsonData && (
        <div>
          <p>Converted GeoJSON:</p>
          <button id="copyButton" onClick={handleCopyClick}>Copy GeoJSON</button>
          <pre>{JSON.stringify(geojsonData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;

