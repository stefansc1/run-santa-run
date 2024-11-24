var svgDoc;
fetch('/level1/')
  .then(response => response.text()) // Convert the response to text
  .then(xmlString => {
    // Parse XML string into a DOM Document
    const parser = new DOMParser();
    svgDoc = parser.parseFromString(xmlString, "application/xml");
    console.log(svgDoc); // Use the XML data
  })
  .catch(error => console.error('Error fetching XML:', error));


document.getElementById("fileInput").addEventListener("change", function(event) {
  const file = event.target.files[0];
  if (file && file.type === "image/svg+xml") {
    const reader = new FileReader();

    reader.onload = function(e) {
      const parser = new DOMParser();
      svgDoc = parser.parseFromString(e.target.result, "image/svg+xml");
      console.log(svgDoc); // Now you can work with svgDoc as XML
    };

    reader.readAsText(file);
  } else {
    console.log("Please select a valid SVG file.");
  }
});

function generateXmlLevel(svgDoc) {
  const rectangles = svgDoc.getElementsByTagName("rect");
  const rectangleData = [];

  // Extract the geometric data for each rectangle
  for (const rect of rectangles) {
    const x = parseInt(rect.getAttribute("x"));
    const y = parseInt(rect.getAttribute("y"));
    const width = parseInt(rect.getAttribute("width"));
    const height = parseInt(rect.getAttribute("height"));

    rectangleData.push({ x, y, width, height });
  }
  return rectangleData;
}
