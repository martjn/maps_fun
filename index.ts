let map: google.maps.Map;
//@ts-ignore
let featureLayerType1;
let featureLayerType2;
let featureLayerType3;
let featureLayerType4;

async function initMap() {
  // Request needed libraries.
  const { Map } = (await google.maps.importLibrary(
    "maps"
  )) as google.maps.MapsLibrary;

  map = new Map(document.getElementById("map") as HTMLElement, {
    center: { lat: 58.3775648, lng: 26.7191469 }, // Tartu
    zoom: 12,
    mapId: "a3efe1c035bad51b", // <YOUR_MAP_ID_HERE>,
  });

  //@ts-ignore
  featureLayerType1 = map.getFeatureLayer("LOCALITY"); // väiksemad, spetsiifilisemad regioonid
  featureLayerType2 = map.getFeatureLayer("ADMINISTRATIVE_AREA_LEVEL_2"); // maakonnad ja suuremad regioonid

  // Define a style with purple fill and border.
  //@ts-ignore
  const paymentPerimeterStyle1: google.maps.FeatureStyleOptions = {
    strokeColor: "#810FCB",
    strokeOpacity: 1.0,
    strokeWeight: 1.0,
    fillColor: "#000000",
    fillOpacity: 0.1,
  };
  const paymentPerimeterStyle2: google.maps.FeatureStyleOptions = {
    strokeColor: "#810FCB",
    strokeOpacity: 1.0,
    strokeWeight: 1.0,
    fillColor: "#000000",
    fillOpacity: 0.2,
  };
  const paymentPerimeterStyle3: google.maps.FeatureStyleOptions = {
    strokeColor: "#810FCB",
    strokeOpacity: 1.0,
    strokeWeight: 1.0,
    fillColor: "#000000",
    fillOpacity: 0.4,
  };

  const provinceStylesType1 = {
    "ChIJ9z1d1dg260YREG38GG2zAAQ": paymentPerimeterStyle1, // Tartu vald
  };

  const provinceStylesType2 = {
    "ChIJJR1n1dg260YR9g9jAMx3CWs": paymentPerimeterStyle2, // Tartu linn
    "ChIJdfXUxu5B60YRF4eAN95oRpc": paymentPerimeterStyle2, // Elva vald
    "ChIJBzCKJB4_60YRoGz8GG2zAAQ": paymentPerimeterStyle2, // Nõo vald
    "ChIJ3YdOc-4860YRaToMFMMs4kc": paymentPerimeterStyle2, // Kambja
    "ChIJf_si080u60YRLz69d_DOz6w": paymentPerimeterStyle2, // Kastre
    "ChIJdx4_I8Ax60YRnh1Vw2YeEy4": paymentPerimeterStyle2, // Luunja
    "ChIJ5wYabg0160YRAG38GG2zAAQ": paymentPerimeterStyle2, // Põhja Tartu ??

    "ChIJWZT4sSER60YReZmwecfFGXU": paymentPerimeterStyle3, // Otepää
    "ChIJEw0d_FAc60YRE5OXrj5EAiE": paymentPerimeterStyle3, // Kanepi
    "ChIJL2PEuS_e6kYRgGj8GG2zAAQ": paymentPerimeterStyle3, // Põlva
    "ChIJCf4Y8MzE6kYRoGj8GG2zAAQ": paymentPerimeterStyle3, // Räpina
    "ChIJQ3FSNA2r7EYR0GT8GG2zAAQ": paymentPerimeterStyle3, // Põltsamaa
    "ChIJn0v2aXqolEYRYGT8GG2zAAQ": paymentPerimeterStyle3, // Jõgeva
    "ChIJG2RkXcK9lEYRljRsdObh0bA": paymentPerimeterStyle3, // Mustvee
    "ChIJVwMlPSjSlEYRsGz8GG2zAAQ": paymentPerimeterStyle3, // Peipsiääre
    
  };


  // Apply the style to a single boundary.
  //@ts-ignore
  featureLayerType1.style = (options: { feature: { placeId: string } }) => {
    const style = provinceStylesType1[options.feature.placeId];
    return style ? style : null; // Return style if found, otherwise null
  };

  featureLayerType2.style = (options: { feature: { placeId: string } }) => {
    const style = provinceStylesType2[options.feature.placeId];
    return style ? style : null; // Return style if found, otherwise null
  };
}

initMap();


let map2: google.maps.Map;
let featureLayer;
let infoWindow;
let lastInteractedFeatureIds = [];
let lastClickedFeatureIds = [];

function handleClick(/* MouseEvent */ e) {
  lastClickedFeatureIds = e.features.map(f => f.placeId);
  lastInteractedFeatureIds = [];
  featureLayer.style = applyStyle;
  createInfoWindow(e);
}

function handleMouseMove(/* MouseEvent */ e) {
  lastInteractedFeatureIds = e.features.map(f => f.placeId);
  featureLayer.style = applyStyle;
}

async function initMap2() {
  // Request needed libraries.
  const { Map, InfoWindow } = await google.maps.importLibrary('maps') as google.maps.MapsLibrary;

  map2 = new Map(document.getElementById('map2') as HTMLElement, {
    center: { lat: 58.3775648, lng: 26.7191469 }, // Tartu
    zoom: 11,
    // In the cloud console, configure your Map ID with a style that enables the
    // 'Administrative Area Level 2' Data Driven Styling type.
    mapId: 'a3efe1c035bad51b', // Substitute your own map ID.
    mapTypeControl: false,
  });

  // Add the feature layer.
  //@ts-ignore
  featureLayer = map2.getFeatureLayer('LOCALITY');

  // Add the event listeners for the feature layer.
  featureLayer.addListener('click', handleClick);
  featureLayer.addListener('mousemove', handleMouseMove);

  // Map event listener.
  map2.addListener('mousemove', () => {
    // If the map gets a mousemove, that means there are no feature layers
    // with listeners registered under the mouse, so we clear the last
    // interacted feature ids.
    if (lastInteractedFeatureIds?.length) {
      lastInteractedFeatureIds = [];
      featureLayer.style = applyStyle;
    }
  });

  // Create the infowindow.
  infoWindow = new InfoWindow({});
  // Apply style on load, to enable clicking.
  featureLayer.style = applyStyle;
}

// Helper function for the infowindow.
async function createInfoWindow(event) {
  let feature = event.features[0];
  if (!feature.placeId) return;

  // Update the infowindow.
  const place = await feature.fetchPlace();
  let content =
      '<span style="font-size:small">Display name: ' + place.displayName +
      '<br/> Place ID: ' + feature.placeId +
      '<br/> Feature type: ' + feature.featureType + '</span>';

  updateInfoWindow(content, event.latLng);
}

// Define styles.
// Stroke and fill with minimum opacity value.
const styleDefault = {
  strokeColor: '#810FCB',
  strokeOpacity: 1.0,
  strokeWeight: 2.0,
  fillColor: 'white',
  fillOpacity: 0.1,  // Polygons must be visible to receive events.
};
// Style for the clicked polygon.
const styleClicked = {
  ...styleDefault,
  fillColor: '#810FCB',
  fillOpacity: 0.5,
};
// Style for polygon on mouse move.
const styleMouseMove = {
  ...styleDefault,
  strokeWeight: 4.0,
};

// Apply styles using a feature style function.
function applyStyle(/* FeatureStyleFunctionOptions */ params) {
  const placeId = params.feature.placeId;
  //@ts-ignore
  if (lastClickedFeatureIds.includes(placeId)) {
    return styleClicked;
  }
  //@ts-ignore
  if (lastInteractedFeatureIds.includes(placeId)) {
    return styleMouseMove;
  }
  return styleDefault;
}

// Helper function to create an info window.
function updateInfoWindow(content, center) {
  infoWindow.setContent(content);
  infoWindow.setPosition(center);
  infoWindow.open({
    map2,
    shouldFocus: false,
  });
}

initMap2();