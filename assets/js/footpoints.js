(function () {
  var POINT_SOURCE_ID = "footprint-points";
  var POINT_LAYER_ID = "footprint-point-circles";
  var POINT_HALO_LAYER_ID = "footprint-point-halos";
  var ENGLISH_TEXT = {
    "亚洲": "Asia", "中国": "China", "海南": "Hainan", "福建": "Fujian",
    "上海": "Shanghai", "四川": "Sichuan", "重庆": "Chongqing", "湖南": "Hunan",
    "浙江": "Zhejiang", "广西": "Guangxi", "广东": "Guangdong", "三亚": "Sanya",
    "厦门": "Xiamen", "成都": "Chengdu", "长沙": "Changsha", "杭州": "Hangzhou",
    "桂林": "Guilin", "南宁": "Nanning", "崇左": "Chongzuo", "深圳": "Shenzhen",
    "心心念念的三亚，希望看到真实的大海--2026.8.2": "A long-awaited trip to Sanya to finally see the real ocean -- 2026.8.2",
    "过年期间带老爸老妈来厦大参观--2026.2.20": "Visiting Xiamen University with my parents during the Spring Festival -- 2026.2.20",
    "高二第一次来上海，感受大都市的繁华与现代，同时去了迪士尼--2019.7.20": "My first trip to Shanghai in high school, experiencing the modern metropolis and visiting Disneyland -- 2019.7.20",
    "参加电科夏令营，同时川大老哥带我逛一下IFS--2026.9.21": "Attending a summer camp and visiting IFS with a friend from Sichuan University -- 2026.9.21",
    "夏令营结束顺路去重庆，高中同学带这夜游重大--2026.9.23": "Stopping in Chongqing after summer camp and visiting Chongqing University at night with a high-school friend -- 2026.9.23",
    "大二暑假去长沙，感受湘江的魅力--2022.8.15": "A summer trip to Changsha to experience the Xiang River -- 2022.8.15",
    "高二去杭州参观浙大，顺便去西湖看看--2019.7.21": "Visiting Zhejiang University and West Lake during high school -- 2019.7.21",
    "桂林廿四田游玩--2026.7.19": "A trip to Nianshitian in Guilin -- 2026.7.19",
    "大四没课出去闲逛亭子码头--2025.11.3": "An afternoon walk around Tingzi Wharf during my senior year -- 2025.11.3",
    "大二期末考完试去崇左爬剑龙山--2024.7.11": "Climbing Jianlong Mountain in Chongzuo after sophomore final exams -- 2024.7.11",
    "参加深大夏令营、夜晚去逛深圳湾公园--2025.7.20": "Attending a summer camp at Shenzhen University and visiting Shenzhen Bay Park at night -- 2025.7.20"
  };

  function currentLanguage() {
    return document.documentElement.dataset.language === "zh" ? "zh" : "en";
  }

  function localize(value) {
    return currentLanguage() === "zh" ? value : (ENGLISH_TEXT[value] || value);
  }

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
    localizeFootprintList();
    document.addEventListener("site-language-change", localizeFootprintList);

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
              media: normalizeMedia(place),
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

  function normalizeMedia(place) {
    if (Array.isArray(place.media) && place.media.length) {
      return place.media.map(function (item) {
        return {
          type: item.type || getMediaType(item.src),
          src: item.src || "",
          caption: item.caption || place.caption || ""
        };
      });
    }

    if (place.photo) {
      return [
        {
          type: "image",
          src: place.photo,
          caption: place.caption || ""
        }
      ];
    }

    return [];
  }

  function getMediaType(src) {
    return /\.(mp4|webm|ogg|mov)$/i.test(src || "") ? "video" : "image";
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
    var video = modal.querySelector("[data-photo-video]");
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
    var activePlaceIndex = 0;
    var activeMediaIndex = 0;

    function show(placeIndex, mediaIndex) {
      var feature = features[placeIndex];

      if (!feature) {
        return;
      }

      var media = feature.properties.media || [];
      var item = media[mediaIndex] || media[0] || {
        type: "image",
        src: feature.properties.photo || "",
        caption: feature.properties.caption || ""
      };

      activePlaceIndex = placeIndex;
      activeMediaIndex = mediaIndex >= 0 && mediaIndex < media.length ? mediaIndex : 0;
      setActivePlace(feature.properties.name);

      title.textContent = localize(feature.properties.name);
      caption.textContent = localize(item.caption || feature.properties.caption || "");
      note.textContent = localize(feature.properties.note || "");
      country.textContent = localize(feature.properties.country);
      count.textContent = getMediaCountText(media);

      resetMedia(image, video, placeholder);
      placeholder.hidden = true;
      placeholderCity.textContent = "";
      placeholderPath.textContent = "";

      if (item.type === "video") {
        showVideo(video, image, placeholder, feature, item);
      } else {
        showImage(image, video, placeholder, feature, item);
      }
    }

    function open(placeName) {
      var index = features.findIndex(function (feature) {
        return feature.properties.name === placeName;
      });

      show(index === -1 ? 0 : index, 0);
      modal.hidden = false;
      document.body.classList.add("is-photo-modal-open");
      modal.scrollTop = 0;
      modal.focus();
    }

    function close() {
      modal.hidden = true;
      document.body.classList.remove("is-photo-modal-open");
      video.pause();
      video.removeAttribute("src");
      video.load();
      setActivePlace("");
    }

    function showPrevious() {
      var previous = getAdjacentMedia(-1);
      show(previous.placeIndex, previous.mediaIndex);
    }

    function showNext() {
      var next = getAdjacentMedia(1);
      show(next.placeIndex, next.mediaIndex);
    }

    function getAdjacentMedia(direction) {
      var feature = features[activePlaceIndex];
      var mediaLength = getMediaLength(feature);
      var nextMediaIndex = activeMediaIndex + direction;

      if (nextMediaIndex >= 0 && nextMediaIndex < mediaLength) {
        return {
          placeIndex: activePlaceIndex,
          mediaIndex: nextMediaIndex
        };
      }

      var nextPlaceIndex = (activePlaceIndex + direction + features.length) % features.length;
      var nextMediaLength = getMediaLength(features[nextPlaceIndex]);

      return {
        placeIndex: nextPlaceIndex,
        mediaIndex: direction > 0 ? 0 : nextMediaLength - 1
      };
    }

    function getMediaCountText(media) {
      var mediaLength = media && media.length ? media.length : 1;

      if (mediaLength > 1) {
        return activeMediaIndex + 1 + " / " + mediaLength;
      }

      return activePlaceIndex + 1 + " / " + features.length;
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

  function showImage(image, video, placeholder, feature, item) {
    image.alt = localize(feature.properties.name) + " travel photo";
    image.hidden = false;
    video.hidden = true;
    video.pause();
    video.removeAttribute("src");
    video.load();

    image.onerror = function () {
      showMissingMedia(image, video, placeholder, feature, item);
    };

    image.src = item.src || "";

    if (!item.src) {
      image.onerror();
    }
  }

  function showVideo(video, image, placeholder, feature, item) {
    image.hidden = true;
    image.removeAttribute("src");
    video.hidden = false;
    video.onerror = function () {
      showMissingMedia(image, video, placeholder, feature, item);
    };
    video.src = item.src || "";
    video.load();

    if (!item.src) {
      video.onerror();
    }
  }

  function showMissingMedia(image, video, placeholder, feature, item) {
    image.hidden = true;
    video.hidden = true;
    video.pause();
    placeholder.hidden = false;
    placeholder.querySelector("[data-photo-placeholder-city]").textContent =
      localize(feature.properties.name);
    placeholder.querySelector("[data-photo-placeholder-path]").textContent =
      item.src || "Media path is empty.";
  }

  function resetMedia(image, video, placeholder) {
    image.onerror = null;
    video.onerror = null;
    image.hidden = true;
    video.hidden = true;
    placeholder.hidden = true;
  }

  function getMediaLength(feature) {
    var media = feature && feature.properties.media;
    return media && media.length ? media.length : 1;
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
      escapeHtml(localize(properties.name)),
      "</strong>",
      "<span>",
      escapeHtml(localize(properties.country)),
      "</span>",
      "<p>",
      escapeHtml(localize(properties.note)),
      "</p>",
      "</div>"
    ].join("");
  }

  function localizeFootprintList() {
    document.querySelectorAll("[data-country-name]").forEach(function (button) {
      var name = button.dataset.countryName;
      var strong = button.querySelector("strong");
      var meta = button.querySelector("span");
      if (strong) strong.textContent = localize(name);
      if (meta) {
        if (!meta.dataset.zh) meta.dataset.zh = meta.textContent.trim();
        meta.textContent = currentLanguage() === "zh" ? meta.dataset.zh : "11 Cities / Places";
      }
    });

    document.querySelectorAll("[data-place-name]").forEach(function (button) {
      button.textContent = localize(button.dataset.placeName);
    });

    document.querySelectorAll(".footprint-region-title h3").forEach(function (heading) {
      if (!heading.dataset.zh) heading.dataset.zh = heading.textContent.trim();
      heading.textContent = currentLanguage() === "zh" ? heading.dataset.zh : localize(heading.dataset.zh);
    });
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
