import React, { useEffect, useState } from "react";
import { HereProvider } from "leaflet-geosearch";
import "./Dashboard.css";
//import { addToTracker } from "../../features/products/trackerSlice";

//import styled from "styled-components";
//import { useSelector, useDispatch } from "react-redux";
import { useDispatch } from "react-redux";

//import Icon from "./Icon";

export default function Dashboard() {
  const [searchQ, setSearchQ] = useState("");
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [buyerlati, setBuyerlati] = useState(0);
  const [buyerlongi, setBuyerlongi] = useState(0);
  const [movingLat, setMovingLat] = useState(0);
  const [movingLong, setMovingLong] = useState(0);
  const [trackBuyerlati, setTrackBuyerlati] = useState(0);
  const [trackBuyerlongi, setTrackBuyerlongi] = useState(0);

  const dispatch = useDispatch();
  //const tracker = useSelector((state) => state.tracking);
  useEffect(() => {
    const Destination = JSON.parse(localStorage.getItem("customerDestination"));
    console.log(Destination);
    if (Destination) {
      setTrackBuyerlati(Destination.buyerlati);
      setTrackBuyerlongi(Destination.buyerlongi);
    }
  }, [trackBuyerlati, trackBuyerlongi]);

  const provider = new HereProvider({
    params: {
      apikey: "Laf8Qt2Exusbyk7XWsvKU7aa3c700cHRzfzysYbyFmo",
    },
  });

  function convertDegToRad(degree) {
    return (degree * Math.PI) / 180;
  }

  function getDinstance(
    transitDistLat,
    transitDistLong,
    buyersDistLat,
    buyersDistLong
  ) {
    const earthRadius = 6371;
    const distLat = convertDegToRad(buyersDistLat - transitDistLat);
    const distLong = convertDegToRad(buyersDistLong - transitDistLong);
    const squarehalfChordLength =
      Math.sin(distLat / 2) * Math.sin(distLat / 2) +
      Math.cos(convertDegToRad(transitDistLat)) *
        Math.cos(convertDegToRad(buyersDistLat)) *
        Math.sin(distLong / 2) *
        Math.sin(distLong / 2);
    const angularDist =
      2 *
      Math.atan2(
        Math.sqrt(squarehalfChordLength),
        Math.sqrt(1 - squarehalfChordLength)
      );
    const dist = earthRadius * angularDist;
    const fixDistan = dist.toFixed(4);
    const spiid = 50;
    const timer = (fixDistan / spiid) * 60;
    const time = timer.toFixed(2);
    const rest = { Distance: fixDistan, Time: time };
    return rest;
  }
  const distan = getDinstance(lat, long, buyerlati, buyerlongi);
  const trackingData = { lat, long, distan };
  const buyerDestination = { buyerlati, buyerlongi };
  localStorage.setItem("tracker", JSON.stringify(trackingData));
  localStorage.setItem("customerDestination", JSON.stringify(buyerDestination));

  function getMovingDinstance(
    iNTransitDistLat,
    iNTransitDistLong,
    trackBuyersDistLat,
    trackBuyersDistLong
  ) {
    const earthRadius = 6371;
    const distLat = convertDegToRad(trackBuyersDistLat - iNTransitDistLat);
    const distLong = convertDegToRad(trackBuyersDistLong - iNTransitDistLong);
    const squarehalfChordLength =
      Math.sin(distLat / 2) * Math.sin(distLat / 2) +
      Math.cos(convertDegToRad(iNTransitDistLat)) *
        Math.cos(convertDegToRad(trackBuyersDistLat)) *
        Math.sin(distLong / 2) *
        Math.sin(distLong / 2);
    const angularDist =
      2 *
      Math.atan2(
        Math.sqrt(squarehalfChordLength),
        Math.sqrt(1 - squarehalfChordLength)
      );
    const movingDist = earthRadius * angularDist;
    const fixDistan = movingDist.toFixed(4);
    const spiid = 50;
    const timer = (fixDistan / spiid) * 60;
    const time = timer.toFixed(2);
    const rest = { Distance: fixDistan, Time: time };
    return rest;
  }
  const movingDistance = getMovingDinstance(
    movingLat,
    movingLong,
    trackBuyerlati,
    trackBuyerlongi
  );

  console.log(movingDistance);
  const trackMovingData = { movingLat, movingLong, movingDistance };
  localStorage.setItem("movingTracker", JSON.stringify(trackMovingData));

  useEffect(() => {
    let options;

    const init = () => {
      if (navigator.geolocation) {
        let giveUp = 1000 * 30;
        let tooOld = 1000 * 60 * 60;
        options = {
          enableHighAccuracy: true,
          timeout: giveUp,
          maximumAge: tooOld,
        };
        navigator.geolocation.getCurrentPosition(gotpos, posfail, options);
      } else {
      }
    };

    function gotpos(position) {
      const positionLat = position.coords.latitude.toFixed(4);
      const positionLong = position.coords.longitude.toFixed(4);
      setLat(positionLat);
      setLong(positionLong);

      //dispatch(addToTracker(positionLat));
      //dispatch(addToTracker(positionLong));
      return { positionLat, positionLong };
    }

    function posfail(err) {
      let errors = {
        1: "No permission",
        2: "Unable to determine",
        3: "Took too long",
      };

      if (errors[err]) {
        console.log(errors[err]);
      }
    }

    const trackingData = { lat, long, distan };

    localStorage.setItem("tracker", JSON.stringify(trackingData));

    init();
  }, [dispatch, buyerlati, buyerlongi, distan, lat, long]);

  // =======================================
  useEffect(() => {
    let options;
    let target;
    let id;

    function success(posi) {
      const pts = posi.coords;
      const positionLat = pts.latitude.toFixed(4);
      const positionLong = pts.longitude.toFixed(4);
      setMovingLat(positionLat);
      setMovingLong(positionLong);
      if (
        target.latitude === pts.latitude &&
        target.longitude === pts.longitude
      ) {
        console.log("Destination Reached");
        navigator.geolocation.clearWatch(id);
        localStorage.removeItem("tracker");
        localStorage.removeItem("movingTracker");
        localStorage.removeItem("customerDestination");
      }
    }

    function error(err) {
      console.error(`ERROR(${err.code}):${err.message}`);
    }

    target = {
      latitude: trackBuyerlati,
      longitude: trackBuyerlongi,
    };

    options = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 0,
    };

    id = navigator.geolocation.watchPosition(success, error, options);

    const trackMovingData = { movingLat, movingLong, movingDistance };

    localStorage.setItem("movingTracker", JSON.stringify(trackMovingData));
  }, [trackBuyerlati, trackBuyerlongi, movingDistance, movingLat, movingLong]);
  // =======================================

  const handleSubmit = async (e) => {
    // prevent the form from refreshing the whole page
    e.preventDefault();
    //-----------------
    const searchQuery = searchQ.toLowerCase();
    console.log(searchQuery);
    const results = await provider.search({ query: searchQ });
    console.log(results);
    results.map((item) => setBuyerlati(item.y));
    results.map((item) => setBuyerlongi(item.x));
  };
  function clearEntry() {
    setSearchQ("");
  }
  //6c4849d7054d66eb438a7e26867a6390

  return (
    <div className="tracker__container">
      <div className="tracker__container-flex">
        {lat === null ? null : (
          <div className="result__items">
            <div className="result__items-flex">
              <div className="lat">
                <span>Latitude:</span>
                {""} {lat}
              </div>
              <div className="long">
                <span>Longitude:</span>
                {""} {long}
              </div>

              <div className="distance">
                <span>Distance:</span> {distan.Distance}
                <span>KM</span>
              </div>
              <div className="time">
                <span>Time:</span> {distan.Time}
                <span>Mins</span>
              </div>
            </div>
          </div>
        )}

        <div className="search__box-container">
          <form method="POST" encType="multipart/form-data">
            <div className="hdparent">
              <h2 className="search__header">Enter Destination Address</h2>
            </div>
            <div className="form-group ">{}</div>
            <div className="form-group ">{}</div>

            <div className="form__group-parent">
              <div className="search__input--parent">
                <input
                  type="text"
                  id="search"
                  name="search"
                  placeholder="Enter Address"
                  className="search__Box"
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                />
                <label htmlFor="search" className="lab-Text">
                  Enter Address
                </label>
              </div>
              <div className="help_parent">
                <span className="help-block"></span>
              </div>
            </div>

            <div className="form__group-submit-parent">
              <input
                type="submit"
                className="Btn__submit"
                onClick={(e) => handleSubmit(e)}
                value="Search"
              />

              <input
                type="reset"
                className="Btn__reset"
                onClick={(e) => clearEntry(e)}
                value="Reset"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
