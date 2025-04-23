import React, { useState } from "react";
import { MapContainer, ImageOverlay, Marker, Popup, Polyline, LayersControl, LayerGroup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const bounds = [[0, 0], [1000, 1000]];

// מקומות עיקריים
const locations = {
  "!כניסה ראשית": [900, 500],
  "מעבר מקורה": [800, 500],
  "רחבת אידה קראון": [700, 500],
  "אגף הארכאולוגיה": [600, 500],
  "אגף האמנויות": [600, 300],
  "אגף אמנות ותרבות יהודית": [500, 500],
  "אגף הנוער והחינוך לאמנות": [500, 300],
  "היכל הספר": [200, 800],
  "גן האמנות": [150, 400],
  "דגם ירושלים": [300, 800],
  "חנות המוזיאון": [850, 600],
  "מסעדה ובית קפה": [850, 400],
  "שירותים": [650, 550],
  "מלתחה": [850, 450],
  "מודיעין": [880, 480],
};

// גרף קשרים – כמו כבישים פנימיים
const museumGraph = {
  "כניסה ראשית": ["מעבר מקורה", "מודיעין"],
  "מודיעין": ["מלתחה"],
  "מלתחה": ["חנות המוזיאון", "מסעדה ובית קפה"],
  "מעבר מקורה": ["רחבת אידה קראון"],
  "רחבת אידה קראון": ["אגף הארכאולוגיה", "אגף האמנויות", "אגף אמנות ותרבות יהודית"],
  "אגף הארכאולוגיה": [],
  "אגף האמנויות": [],
  "אגף אמנות ותרבות יהודית": ["אגף הנוער והחינוך לאמנות"],
  "אגף הנוער והחינוך לאמנות": [],
  "היכל הספר": ["דגם ירושלים"],
  "גן האמנות": [],
  "דגם ירושלים": [],
  "חנות המוזיאון": [],
  "מסעדה ובית קפה": [],
  "שירותים": [],
};

function findShortestPath(graph, start, end) {
  let queue = [[start]];
  let visited = new Set();
  
  while (queue.length > 0) {
    const path = queue.shift();
    const node = path[path.length - 1];

    if (node === end) {
      return path;
    }

    if (!visited.has(node)) {
      visited.add(node);
      const neighbors = graph[node] || [];
      for (const neighbor of neighbors) {
        queue.push([...path, neighbor]);
      }
    }
  }
  return null;
}

const MuseumMap = () => {
  const [target, setTarget] = useState(null);

  const path = target ? findShortestPath(museumGraph, "כניסה ראשית", target) : null;
  const polylinePoints = path ? path.map((place) => locations[place]) : [];

  return (
    <div>
      <h2>מפת מוזיאון ישראל</h2>
      <select onChange={(e) => setTarget(e.target.value)} defaultValue="">
        <option value="" disabled>בחר יעד</option>
        {Object.keys(locations).map((loc) => (
          <option key={loc} value={loc}>{loc}</option>
        ))}
      </select>

      <MapContainer
        crs={L.CRS.Simple}
        bounds={bounds}
        style={{ height: "600px", marginTop: "1rem" }}
        maxZoom={2}
        minZoom={-1}
        zoom={-1}
        center={[500, 500]}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="מפת המוזיאון">
            <ImageOverlay url="/images/museum_layout_leaflet.png" bounds={bounds} />
          </LayersControl.BaseLayer>

          <LayersControl.Overlay name="תערוכות">
            <LayerGroup>
              {["אגף הארכאולוגיה", "אגף האמנויות", "אגף אמנות ותרבות יהודית", "אגף הנוער והחינוך לאמנות"].map((place) => (
                <Marker key={place} position={locations[place]}>
                  <Popup>{place}</Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          <LayersControl.Overlay name="מתקנים ושירותים">
            <LayerGroup>
              {["חנות המוזיאון", "מסעדה ובית קפה", "שירותים", "מלתחה", "מודיעין"].map((place) => (
                <Marker key={place} position={locations[place]}>
                  <Popup>{place}</Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          {polylinePoints.length > 1 && (
            <Polyline positions={polylinePoints} color="blue" />
          )}
        </LayersControl>
      </MapContainer>
    </div>
  );
};

export default MuseumMap;
