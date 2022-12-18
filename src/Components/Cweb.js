import React, { useEffect, useState } from "react";
//import styled from "styled-components";
//import TrackOrder from "./Customers/TrackOrder";
import "./Cweb.css";
import "./circle.css";
//import Icon from "./Icon";

import { Polyline } from "react-leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function Cweb() {
  const [dispatchLati, setDispatchLati] = useState(0);
  const [dispatchLongi, setDispatchLongi] = useState(0);
  const [distance, setDistance] = useState();
  const [arrivalTime, setArrivalTime] = useState(0);
  const [destinationLati, setDestinationLati] = useState(0);
  const [destinationLongi, setDestinationLongi] = useState(0);
  const [movingDispatchLati, setMovingDispatchLati] = useState(0);
  const [movingDispatchLongi, setMovingDispatchLongi] = useState(0);
  const [movingDistance, setMovingDistance] = useState();
  const [arrivalMovingTime, setArrivalMovingTime] = useState(0);

  useEffect(() => {
    const tracker = JSON.parse(localStorage.getItem("tracker"));
    if (tracker) {
      setDistance(tracker.distan.Distance);
      setArrivalTime(tracker.distan.Time);
      setDispatchLati(tracker.lat);
      setDispatchLongi(tracker.long);
    }
  }, []);

  useEffect(() => {
    const movingTracker = JSON.parse(localStorage.getItem("movingTracker"));
    console.log(movingTracker);
    if (movingTracker) {
      setMovingDistance(movingTracker.movingDistance.Distance);
      setArrivalMovingTime(movingTracker.movingDistance.Time);
      setMovingDispatchLati(movingTracker.movingLat);
      setMovingDispatchLongi(movingTracker.movingLong);
    }
  }, []);

  useEffect(() => {
    const Destination = JSON.parse(localStorage.getItem("customerDestination"));
    console.log(Destination);
    if (Destination) {
      setDestinationLati(Destination.buyerlati);
      setDestinationLongi(Destination.buyerlongi);
    }
  }, []);

  const dispatchPoint = [dispatchLati, dispatchLongi];
  const destinationPoint = [destinationLati, destinationLongi];

  let movingDispatchPoint;
  if (movingDispatchLati === 0) {
    movingDispatchPoint = [dispatchLati, dispatchLongi];
  } else {
    movingDispatchPoint = [movingDispatchLati, movingDispatchLongi];
  }

  const polyline = [
    [dispatchLati, dispatchLongi],
    [destinationLati, destinationLongi],
  ];
  const blueOptions = { color: "navy" };

  const movingPolyline = [
    [movingDispatchLati, movingDispatchLongi],
    [destinationLati, destinationLongi],
  ];

  const center = [dispatchLati, dispatchLongi];

  const movingBlueOptions = { color: "transparent" };
  console.log(movingDispatchPoint);
  return (
    <div className="watcher__box--container">
      <div className="tracker__box">
        <MapContainer
          center={center}
          zoom={4}
          scrollWheelZoom={false}
          style={{
            width: "100%",
            maxWidth: "100%",
            minWidth: "0%",
            height: "100%",
            minHeight: "0%",
            maxHeight: "100%",
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={dispatchPoint}>
            <Popup>Here is Your Starting Point!!</Popup>
          </Marker>

          <Marker position={movingDispatchPoint}>
            <Popup>Rider</Popup>
          </Marker>

          <Marker position={destinationPoint}>
            <Popup>Here is Your Destination!!</Popup>
          </Marker>

          <Polyline pathOptions={movingBlueOptions} positions={movingPolyline}>
            <Popup>Distance {movingDistance}KM!!</Popup>
          </Polyline>
          <Polyline pathOptions={blueOptions} positions={polyline}>
            <Popup>Distance {distance}KM!!</Popup>
          </Polyline>
        </MapContainer>
      </div>
      <div className="watcher__box">
        <div className="watcher__box-flex">
          <div className="starting__point">
            <div className="starting__distance">
              <span>Start Distance:</span>
              {distance}
              <span>KM</span>
            </div>
            <div className="starting__time">
              <span>Start Time :</span>
              {""} {arrivalTime}
              <span>Mins</span>
            </div>
          </div>
          <div className="moving__direction">
            <div className="remaining__distance">
              <span>Rem Distance:</span>
              {""} {movingDistance}
              <span>KM</span>
            </div>
            <div className="arrival__time">
              <span>Arrives In :</span> {arrivalMovingTime}
              <span>Mins</span>
            </div>
          </div>
        </div>
        <div className="circle__style">
          <div className="circle__container">
            <div className="line1"></div>
            <div className="line2">
              <div className="line2-line"></div>
              <div className="line2-line"></div>
              <div className="line2-line"></div>
              <div className="line2-line"></div>
              <div className="line2-line"></div>
              <div className="line2-line"></div>
              <div className="line2-line"></div>
              <div className="line2-line"></div>
              <div className="line2-line"></div>
              <div className="line2-line"></div>
              <div className="line2-line"></div>
              <div className="line2-line"></div>
              <div className="line2-line"></div>
              <div className="line2-line"></div>
              <div className="line2-line"></div>
              <div className="line2-line"></div>
              <div className="line2-line"></div>
              <div className="line2-line"></div>
              <div className="line2-line"></div>
              <div className="line2-line"></div>
              <div className="line2-line"></div>
              <div className="line2-line"></div>
              <div className="line2-line"></div>
              <div className="line2-line"></div>
              <div className="line2-line"></div>
              <div className="line2-line"></div>
              <div className="line2-line"></div>
              <div className="line2-line"></div>
              <div className="line2-line"></div>
              <div className="line2-line"></div>
              <div className="line2-line"></div>
              <div className="line2-line"></div>
              <div className="line2-line"></div>
              <div className="line2-line"></div>
              <div className="line2-line"></div>
              <div className="line2-line"></div>
              <div className="line2-line"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
