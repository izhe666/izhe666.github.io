(function () {
    function ready(fn) {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", fn);
        return;
      }
      fn();
    }
  
    ready(function () {
      var mapEl = document.querySelector("[data-footprint-map]");
      var dataEl = document.getElementById("footprint-data");
  
      if (!mapEl || !dataEl) {
        return;
      }
  
      if (typeof L === "undefined") {
        window.addEventListener("load", function () {
          if (typeof L !== "undefined") {
            initMap(mapEl, dataEl);
          }
        });
        return;
      }
  
      initMap(mapEl, dataEl);
    });
  
    function initMap(mapEl, dataEl) {
      var regions = JSON.parse(dataEl.textContent);
      var map = L.map(mapEl, {
        scrollWheelZoom: false,
        worldCopyJump: true
      }).setView([24, 20], 2);
  
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "&copy; OpenStreetMap contributors"
      }).addTo(map);
  
      var bounds = [];
  
      regions.forEach(function (region) {
        region.countries.forEach(function (country) {
          country.places.forEach(function (place) {
            var marker = L.circleMarker([place.lat, place.lng], {
              radius: 5,
              color: "#ffffff",
              weight: 1.5,
              fillColor: region.color,
              fillOpacity: 0.95
            }).addTo(map);
  
            marker.bindPopup(
              "<strong>" + place.name + "</strong><br>" +
              country.name + "<br>" +
              "<span>" + place.note + "</span>"
            );
  
            bounds.push([place.lat, place.lng]);
          });
        });
      });
  
      if (bounds.length > 1) {
        map.fitBounds(bounds, { padding: [28, 28], maxZoom: 4 });
      }
    }
  })();
  