import { Controller } from "@hotwired/stimulus";
import mapboxgl from 'mapbox-gl';

export default class extends Controller {
  static values = {
    apiKey: String,
    markers: Array,
    query: String
  }

  connect() {
    mapboxgl.accessToken = this.apiKeyValue;

    this.map = new mapboxgl.Map({
      container: this.element,
      style: "mapbox://styles/mapbox/streets-v10"
    });

    this.#addMarkersToMap();
    this.#fitMapToMarkers();

    if (this.queryValue) {
      this.#centerMapOnQuery();
    }

    this.map.addControl(new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl
    }));
  }

  #addMarkersToMap() {
    this.markersValue.forEach((marker) => {
      const popup = new mapboxgl.Popup().setHTML(marker.info_window_html);

      const customMarker = document.createElement("div");
      customMarker.innerHTML = marker.marker_html;

      new mapboxgl.Marker(customMarker)
        .setLngLat([marker.lng, marker.lat])
        .setPopup(popup)
        .addTo(this.map);
    });
  }

  #fitMapToMarkers() {
    const bounds = new mapboxgl.LngLatBounds();
    this.markersValue.forEach(marker => bounds.extend([marker.lng, marker.lat]));
    this.map.fitBounds(bounds, { padding: 70, maxZoom: 15, duration: 0 });
  }

  #centerMapOnQuery() {
    if (this.markersValue.length > 0) {
      const firstMarker = this.markersValue[0];
      this.map.setCenter([firstMarker.lng, firstMarker.lat]);
      this.map.setZoom(12);  // Ajustez le zoom selon vos préférences
    }
  }
}
