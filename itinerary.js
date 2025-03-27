// Scroll to Map
function scrollToMap() {
  document.getElementById("map-section").scrollIntoView({ behavior: "smooth" });
}

// Initialize Map with Custom Markers and Animated Arrows
function initMap() {
  const mapLoading = document.getElementById("map-loading");
  mapLoading.classList.add("active");

  const map = L.map("map").setView([20.5937, 78.9629], 5); // Center of India

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 15,
    tileSize: 256,
    zoomOffset: 0,
  }).addTo(map);

  // Custom Icons
  const trainIcon = L.divIcon({
    html: "🚂",
    className: "custom-icon",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

  const mountainIcon = L.divIcon({
    html: "🏔️",
    className: "custom-icon",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

  const templeIcon = L.divIcon({
    html: "🕉️",
    className: "custom-icon",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

  const monumentIcon = L.divIcon({
    html: "🏰",
    className: "custom-icon",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

  const cityIcon = L.divIcon({
    html: "🏙️",
    className: "custom-icon",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

  // Locations in journey order with custom icons
  const locations = [
    {
      name: "Pune",
      coords: [18.5204, 73.8567],
      popup: "28th March: Start journey to Bandra Terminus",
      icon: cityIcon,
    },
    {
      name: "Bandra Terminus",
      coords: [19.062, 72.8409],
      popup: "28th March: Train to Pathankot (Swaraj Express)",
      icon: trainIcon,
    },
    {
      name: "Pathankot",
      coords: [32.2733, 75.6522],
      popup: "29th March: Arrive and head to Dalhousie",
      icon: trainIcon,
    },
    {
      name: "Dalhousie",
      coords: [32.5326, 75.9786],
      popup: "29th-31st March: Visit Khajjiar, Kalatop",
      icon: mountainIcon,
    },
    {
      name: "Dharamshala",
      coords: [32.219, 76.3234],
      popup: "31st March-2nd April: Tea Gardens, Dul Lake, Dalai Lama",
      icon: mountainIcon,
    },
    {
      name: "Pathankot",
      coords: [32.2733, 75.6522],
      popup: "2nd April: Return to Pathankot",
      icon: trainIcon,
    },
    {
      name: "Delhi",
      coords: [28.7041, 77.1025],
      popup: "2nd-4th April: Sarojini Nagar, Meena Bazaar, Chandi Chowk",
      icon: cityIcon,
    },
    {
      name: "Mathura",
      coords: [27.4924, 77.6737],
      popup: "4th-6th April: Prem Mandir Vrindavan, Krishna Janam Bhumi",
      icon: templeIcon,
    },
    {
      name: "Agra",
      coords: [27.1767, 78.0081],
      popup: "5th April: Taj Mahal, Red Fort, Etmad-ud-Daula",
      icon: monumentIcon,
    },
    {
      name: "Mathura",
      coords: [27.4924, 77.6737],
      popup: "5th April: Return to Mathura",
      icon: templeIcon,
    },
    {
      name: "Mumbai",
      coords: [19.076, 72.8777],
      popup: "6th-7th April: Return to Mumbai",
      icon: cityIcon,
    },
  ];

  // Add markers with bounce animation
  locations.forEach((location) => {
    const marker = L.marker(location.coords, { icon: location.icon }).addTo(
      map
    );
    marker.bindPopup(location.popup);
    marker.on("mouseover", function () {
      this.openPopup();
    });
    marker.on("mouseout", function () {
      this.closePopup();
    });
    marker.on("add", function () {
      this.bounce({ duration: 500, height: 50 });
    });
  });

  // Draw journey route with arrows
  const routeCoords = locations.map((loc) => loc.coords);
  const polyline = L.polyline(routeCoords, {
    color: "#FF6F61",
    weight: 4,
    opacity: 0.7,
    dashArray: "10, 10",
  }).addTo(map);

  // Add arrows to the polyline
  polyline.decorate({
    patterns: [
      {
        offset: 25,
        repeat: 50,
        symbol: L.Symbol.arrowHead({
          pixelSize: 10,
          polygon: false,
          pathOptions: { stroke: true, color: "#FF6F61", weight: 2 },
        }),
      },
    ],
  });

  // Fit map to show all markers
  const group = new L.featureGroup(
    locations.map((loc) => L.marker(loc.coords))
  );
  map.fitBounds(group.getBounds().pad(0.5));

  // Hide loading spinner once map is loaded
  map.on("load", () => {
    mapLoading.classList.remove("active");
  });
}

// Load map after page content
document.addEventListener("DOMContentLoaded", () => {
  initMap();
});
