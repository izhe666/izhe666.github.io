(function () {
  var POINT_SOURCE_ID = "footprint-points";
  var POINT_LAYER_ID = "footprint-point-circles";
  var POINT_HALO_LAYER_ID = "footprint-point-halos";

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

    if (typeof maplibregl === "undefined") {
      window.addEventListener("load", function () {
        if (typeof maplibregl !== "undefined") {
          initMap(mapEl, dataEl);
          return;
        }

        setStatus(mapEl, "Map library failed to load.");
      });
      return;
    }

    initMap(mapEl, dataEl);
  });

  function initMap(mapEl, dataEl) {
    var regions;

    try {
      regions = JSON.parse(dataEl.textContent);
    } catch (error) {
      setStatus(mapEl, "Map data could not be read.");
      return;
    }

    var features = getPlaceFeatures(regions);

    if (!features.length) {
      setStatus(mapEl, "No map places yet.");
      return;
    }

    maplibregl.accessToken = "";

    var map = new maplibregl.Map({
      container: mapEl,
      attributionControl: true,
      dragRotate: true,
      pitchWithRotate: false,
      renderWorldCopies: false,
      center: [20, 24],
      zoom: 1.2,
      minZoom: 1,
      maxZoom: 12,
      style: {
        version: 8,
        sources: {
          carto: {
            type: "raster",
            tiles: [
              "https://a.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png",
              "https://b.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png",
              "https://c.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png",
              "https://d.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png"
            ],
            tileSize: 256,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          }
        },
        layers: [
          {
            id: "carto-basemap",
            type: "raster",
            source: "carto",
            minzoom: 0,
            maxzoom: 19
          }
        ]
      }
    });

    var initialBounds = getBounds(features);
    var photoModal = createPhotoModal(features);

    map.on("load", function () {
      map.addSource(POINT_SOURCE_ID, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: features
        }
      });

      map.addLayer({
        id: POINT_HALO_LAYER_ID,
        type: "circle",
        source: POINT_SOURCE_ID,
        paint: {
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            1,
            6,
            6,
            11
          ],
          "circle-color": "#ffffff",
          "circle-opacity": 0.92
        }
      });

      map.addLayer({
        id: POINT_LAYER_ID,
        type: "circle",
        source: POINT_SOURCE_ID,
        paint: {
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            1,
            4,
            6,
            8
          ],
          "circle-color": ["get", "color"],
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 1.4,
          "circle-opacity": 0.96
        }
      });

      fitToBounds(map, initialBounds, 0);
      bindMarkerPopup(map, photoModal);
      bindMapControls(map, mapEl, features, initialBounds);
      bindCountryCards(map, features);
      bindPlaceCards(map, features, photoModal);
      mapEl.classList.add("is-ready");
    });

    map.on("error", function () {
      if (!mapEl.classList.contains("is-ready")) {
        setStatus(mapEl, "Map failed to load.");
      }
    });
  }

  function getPlaceFeatures(regions) {
    var features = [];

    regions.forEach(function (region) {
      region.countries.forEach(function (country) {
        country.places.forEach(function (place) {
          features.push({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [Number(place.lng), Number(place.lat)]
            },
            properties: {
              name: place.name,
              note: place.note || "",
              caption: place.caption || "",
              photo: place.photo || "",
              country: country.name,
              region: region.name,
              color: region.color
            }
          });
        });
      });
    });

    return features;
  }

  function getBounds(features) {
    var bounds = new maplibregl.LngLatBounds();

    features.forEach(function (feature) {
      bounds.extend(feature.geometry.coordinates);
    });

    return bounds;
  }

  function fitToBounds(map, bounds, duration) {
    map.fitBounds(bounds, {
      padding: 56,
      maxZoom: 3.7,
      duration: duration
    });
  }

  function bindMarkerPopup(map, photoModal) {
    var popup = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: true,
      offset: 12
    });

    map.on("mouseenter", POINT_LAYER_ID, function () {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", POINT_LAYER_ID, function () {
      map.getCanvas().style.cursor = "";
    });

    map.on("click", POINT_LAYER_ID, function (event) {
      var feature = event.features && event.features[0];

      if (!feature) {
        return;
      }

      if (photoModal) {
        photoModal.open(feature.properties.name);
        return;
      }

      popup
        .setLngLat(feature.geometry.coordinates)
        .setHTML(getPopupHtml(feature.properties))
        .addTo(map);
    });
  }

  function bindMapControls(map, mapEl, features, initialBounds) {
    var shell = mapEl.closest("[data-footprint-map-shell]");
    var controls = shell && shell.querySelector("[data-map-action]");

    if (!shell || !controls) {
      return;
    }

    shell.addEventListener("click", function (event) {
      var button = event.target.closest("[data-map-action]");

      if (!button || !shell.contains(button)) {
        return;
      }

      var action = button.getAttribute("data-map-action");

      if (action === "zoom-in") {
        map.zoomIn();
      } else if (action === "zoom-out") {
        map.zoomOut();
      } else if (action === "reset") {
        map.rotateTo(0, { duration: 250 });
        fitToBounds(map, initialBounds, 350);
        setActiveCountry("");
      } else if (action === "rotate-left") {
        map.rotateTo(map.getBearing() - 20, { duration: 250 });
      } else if (action === "rotate-right") {
        map.rotateTo(map.getBearing() + 20, { duration: 250 });
      } else if (action === "fullscreen") {
        toggleFullscreen(shell, map);
      }
    });
  }

  function bindCountryCards(map, features) {
    var cards = document.querySelectorAll("[data-country-name]");

    cards.forEach(function (card) {
      card.addEventListener("click", function () {
        var country = card.getAttribute("data-country-name");
        var countryFeatures = features.filter(function (feature) {
          return feature.properties.country === country;
        });

        if (!countryFeatures.length) {
          return;
        }

        setActiveCountry(country);
        fitToBounds(map, getBounds(countryFeatures), 450);
      });
    });
  }

  function bindPlaceCards(map, features, photoModal) {
    var cards = document.querySelectorAll("[data-place-name]");

    cards.forEach(function (card) {
      card.addEventListener("click", function () {
        var placeName = card.getAttribute("data-place-name");
        var feature = features.find(function (item) {
          return item.properties.name === placeName;
        });

        if (!feature) {
          return;
        }

        map.flyTo({
          center: feature.geometry.coordinates,
          zoom: Math.max(map.getZoom(), 5),
          duration: 450
        });

        setActivePlace(placeName);

        if (photoModal) {
          photoModal.open(placeName);
        }
      });
    });
  }

  function setActiveCountry(country) {
    document.querySelectorAll("[data-country-name]").forEach(function (card) {
      card.classList.toggle(
        "is-active",
        card.getAttribute("data-country-name") === country
      );
    });
  }

  function setActivePlace(placeName) {
    document.querySelectorAll("[data-place-name]").forEach(function (card) {
      card.classList.toggle(
        "is-active",
        card.getAttribute("data-place-name") === placeName
      );
    });
  }

  function createPhotoModal(features) {
    var modal = document.querySelector("[data-photo-modal]");

    if (!modal) {
      return null;
    }

    var image = modal.querySelector("[data-photo-image]");
    var placeholder = modal.querySelector("[data-photo-placeholder]");
    var placeholderCity = modal.querySelector("[data-photo-placeholder-city]");
    var placeholderPath = modal.querySelector("[data-photo-placeholder-path]");
    var title = modal.querySelector("[data-photo-title]");
    var caption = modal.querySelector("[data-photo-caption]");
    var note = modal.querySelector("[data-photo-note]");
    var country = modal.querySelector("[data-photo-country]");
    var count = modal.querySelector("[data-photo-count]");
    var closeButton = modal.querySelector("[data-photo-close]");
    var prevButton = modal.querySelector("[data-photo-prev]");
    var nextButton = modal.querySelector("[data-photo-next]");
    var activeIndex = 0;

    function show(index) {
      var feature = features[index];

      if (!feature) {
        return;
      }

      activeIndex = index;
      setActivePlace(feature.properties.name);

      title.textContent = feature.properties.name;
      caption.textContent = feature.properties.caption || "";
      note.textContent = feature.properties.note || "";
      country.textContent = feature.properties.country;
      count.textContent = activeIndex + 1 + " / " + features.length;

      image.alt = feature.properties.name + " travel photo";
      image.hidden = false;
      placeholder.hidden = true;
      placeholderCity.textContent = "";
      placeholderPath.textContent = "";

      image.onerror = function () {
        image.hidden = true;
        placeholder.hidden = false;
        placeholderCity.textContent = feature.properties.name;
        placeholderPath.textContent = feature.properties.photo || "Photo path is empty.";
      };

      image.src = feature.properties.photo || "";

      if (!feature.properties.photo) {
        image.onerror();
      }
    }

    function open(placeName) {
      var index = features.findIndex(function (feature) {
        return feature.properties.name === placeName;
      });

      show(index === -1 ? 0 : index);
      modal.hidden = false;
      document.body.classList.add("is-photo-modal-open");
      closeButton.focus();
    }

    function close() {
      modal.hidden = true;
      document.body.classList.remove("is-photo-modal-open");
      setActivePlace("");
    }

    function showPrevious() {
      show((activeIndex - 1 + features.length) % features.length);
    }

    function showNext() {
      show((activeIndex + 1) % features.length);
    }

    closeButton.addEventListener("click", close);
    prevButton.addEventListener("click", showPrevious);
    nextButton.addEventListener("click", showNext);

    modal.addEventListener("click", function (event) {
      if (event.target === modal) {
        close();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (modal.hidden) {
        return;
      }

      if (event.key === "Escape") {
        close();
      } else if (event.key === "ArrowLeft") {
        showPrevious();
      } else if (event.key === "ArrowRight") {
        showNext();
      }
    });

    return {
      open: open
    };
  }

  function toggleFullscreen(shell, map) {
    if (!document.fullscreenElement && shell.requestFullscreen) {
      shell.requestFullscreen().then(function () {
        map.resize();
      }).catch(function () {
        map.resize();
      });
      return;
    }

    if (document.exitFullscreen) {
      document.exitFullscreen().then(function () {
        map.resize();
      }).catch(function () {
        map.resize();
      });
    }
  }

  function getPopupHtml(properties) {
    return [
      '<div class="footprint-popup">',
      "<strong>",
      escapeHtml(properties.name),
      "</strong>",
      "<span>",
      escapeHtml(properties.country),
      "</span>",
      "<p>",
      escapeHtml(properties.note),
      "</p>",
      "</div>"
    ].join("");
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function setStatus(mapEl, message) {
    var statusEl = mapEl.querySelector(".footprint-map-status");

    if (statusEl) {
      statusEl.textContent = message;
    }
  }
})();
