import React, { Component } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Map, ImageOverlay, Popup, Polygon } from "react-leaflet";
// import Control from "react-leaflet-control";
// import util from "../util/date.js";
import booth from "../image/icon/booth.png";
// import f1 from "../image/floormap/1f.png";
import floormap from "../image/floormap/MapKosongBBAF.png";
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
      pathColor: "purple",
      currentZoomLevel: 1,
      bounds: iniBounds,
      targetFloor: "delta_f1",
      floors: {
        name: "F1",
        image: floormap,
        markers: marker.markerArray,
      },
      disable: false,
    };
  }

  componentDidMount() {
    const map = this.map.leafletElement;

    map.on("zoomend", () => {
      const updatedZoomLevel = map.getZoom();
      this.handleZoomLevelChange(updatedZoomLevel);
    });

    map.on("click", (e) => {
      // this.handleAddMarker(e, map);
      // this.handleChangeFloor();
    });

    const w = 3522,
      h = 2507;

    const southWest = map.unproject([0, h], map.getMaxZoom() - 1);
    const northEast = map.unproject([w, 0], map.getMaxZoom() - 1);

    const bounds = new L.LatLngBounds(southWest, northEast);
    this.setState({ bounds: bounds });
    map.setMaxBounds(bounds);
  }

  handleZoomLevelChange(newZoomLevel) {
    this.setState({ currentZoomLevel: newZoomLevel });
  }

  handleChangeFloor(e) {
    this.setState({ targetFloor: e.target.dataset.floor });
  }

  handleAddMarker(e, map) {
    // const cid = util.datetick();

    // add Marker to state
    // let _floors = Object.assign({}, this.state.floors);
    // _floors.markers = [..._floors.markers, _marker];

    // this.setState({
    //   floors: _floors,
    // });
    console.log(e.latlng);
  }

  updatePolygonColor1(e) {
    let updatedMarkers = this.state.floors.markers.map((m) => {
      if (!m.active) {
        e.target.openPopup();
      }
      if (m.id === e.target.options.id) {
        m.active = true;
      }
      return m;
    });
    this.setState({ markers: updatedMarkers });
  }

  updatePolygonColor2(e) {
    let updatedMarkers = this.state.floors.markers.map((m) => {
      if (!m.active) {
        e.target.closePopup();
      }
      if (m.id === e.target.options.id) {
        m.active = false;
      }
      return m;
    });
    this.setState({ markers: updatedMarkers });
  }

  onClickPolygon1(e) {
    let updatedMarkers = this.state.floors.markers.map((m) => {
      if (m.id === e.target.options.id) {
        m.active = true;
      }
      return m;
    });
    this.setState({ markers: updatedMarkers, disable: true });
  }

  onClickPolygon2(e) {
    let updatedMarkers = this.state.floors.markers.map((m) => {
      if (m.id === e.target.options.id) {
        m.active = false;
      }
      return m;
    });
    this.setState({ markers: updatedMarkers, disable: false });
  }

  render() {
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
              <Polygon
                key={m.id}
                id={m.id}
                fillColor={m.active ? "blue" : "#fcf803"}
                fillOpacity={0.5}
                weight={0}
                color={"white"}
                positions={m.polygon}
                onclick={this.onClickPolygon1.bind(this)}
                onpopupclose={this.onClickPolygon2.bind(this)}
                onMouseOver={
                  this.state.disable
                    ? null
                    : this.updatePolygonColor1.bind(this)
                }
                onMouseOut={
                  this.state.disable
                    ? null
                    : this.updatePolygonColor2.bind(this)
                }
              >
                <Popup minWidth={90}>
                  <span style={{ fontWeight: "bold" }}>
                    {m.number} <br />
                    {m.name}
                  </span>
                </Popup>
              </Polygon>
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
