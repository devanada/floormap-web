import React, { Component } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Map, ImageOverlay, Marker, Popup } from "react-leaflet";
// import Control from "react-leaflet-control";
import util from "../util/date.js";
import booth from "../image/icon/booth.png";
import f1 from "../image/floormap/1f.png";
import test from "../image/floormap/test.jpeg";
import marker from "./marker";

class Floor extends Component {
  customPin = L.divIcon({
    className: "location-pin",
    html: `<img src=${booth}><div class="pin"></div><div class="pulse"></div>`,
    iconSize: [40, 40],
    iconAnchor: [24, 40],
  });

  constructor(props) {
    super(props);

    const iniBounds = L.latLngBounds(null, null);

    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      currentZoomLevel: 1,
      bounds: iniBounds,
      targetFloor: "delta_f1",
      floors: {
        name: "F1",
        image: test,
        markers: marker.markerArray,
      },
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions.bind(this));
    const map = this.map.leafletElement;

    map.on("zoomend", () => {
      const updatedZoomLevel = map.getZoom();
      this.handleZoomLevelChange(updatedZoomLevel);
    });

    map.on("click", (e) => {
      // this.handleAddMarker(e, map);
      // this.handleChangeFloor();
    });

    const w = 1920 * 2,
      h = 1080 * 2;

    const southWest = map.unproject([0, h], map.getMaxZoom() - 1);
    const northEast = map.unproject([w, 0], map.getMaxZoom() - 1);

    const bounds = new L.LatLngBounds(southWest, northEast);
    this.setState({ bounds: bounds });
    map.setMaxBounds(bounds);
  }

  componentWillUnmount() {
    window.removeEventListener(
      "resize",
      this.updateWindowDimensions.bind(this)
    );
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  handleZoomLevelChange(newZoomLevel) {
    this.setState({ currentZoomLevel: newZoomLevel });
  }

  //   handleChangeFloor(e) {
  //     this.setState({ targetFloor: e.target.dataset.floor });
  //   }

  handleAddMarker(e, map) {
    const cid = util.datetick();

    var _marker = {
      id: cid,
      lat: e.latlng.lat,
      lng: e.latlng.lng,
    };

    // add Marker to state
    let _floors = Object.assign({}, this.state.floors);
    _floors.markers = [..._floors.markers, _marker];

    this.setState({
      floors: _floors,
    });
    console.log(e.latlng);
  }

  updateMarkerPosition(e) {
    const { lat, lng } = e.target.getLatLng();

    let updatedMarkers = this.state.floors.markers.map((m) => {
      if (m.id === e.target.options.id) {
        m.lat = lat;
        m.lng = lng;
      }
      return m;
    });

    // update Marker to state
    this.setState({ markers: updatedMarkers });
  }

  render() {
    // window.console.log(
    //   "this.state.currentZoomLevel ->",
    //   this.state.currentZoomLevel
    // );

    return (
      <div className="App">
        <Map
          ref={(m) => {
            this.map = m;
          }}
          center={[0, 0]}
          zoom={1}
          minZoom={1}
          maxZoom={4}
          crs={L.CRS.Simple}
          attributionControl={false}
        >
          <ImageOverlay
            url={this.state.floors.image}
            bounds={this.state.bounds}
          >
            {this.state.floors.markers.map((m) => (
              <Marker
                key={m.id}
                id={m.id}
                draggable={false}
                onDragend={this.updateMarkerPosition.bind(this)}
                position={[m.lat, m.lng]}
                icon={this.customPin}
              >
                <Popup minWidth={90}>
                  <span>
                    {" "}
                    Lat:{m.lat}, Lng:{m.lng}{" "}
                  </span>
                </Popup>
              </Marker>
            ))}
          </ImageOverlay>

          {/* <Control position="topright">
                        <div style={{ backgroundColor: 'black', padding: '5px', }}>
                            <button onClick={this.handleChangeFloor.bind(this)} data-floor="delta_f1">F1</button>
                            <button onClick={this.handleChangeFloor.bind(this)} data-floor="delta_b1">B1</button>
                        </div>
                    </Control> */}
        </Map>
        {/* <ol>
          {this.state.floors.markers.map((m) => (
            <li key={m.id}>{`[${m.id}] (${m.lat},${m.lng})`}</li>
          ))}
        </ol> */}
      </div>
    );
  }
}

export default Floor;
