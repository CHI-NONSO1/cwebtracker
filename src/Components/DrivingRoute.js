import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./DrivingRoute.css";

export default function DrivingRoute() {
  const [dispatchLati, setDispatchLati] = useState(0);
  const [dispatchLongi, setDispatchLongi] = useState(0);
  const [destinationLati, setDestinationLati] = useState(0);
  const [destinationLongi, setDestinationLongi] = useState(0);
  const [sectionDirections, setSectionDirection] = useState("");
  const [travelDistance, setTravelDistance] = useState(0);
  const [travelTime, setTravelTime] = useState(0);
  const [travelLabels, setTravelLabels] = useState();

  // const [distance, setDistance] = useState();
  //const [arrivalTime, setArrivalTime] = useState(0);
  // const [movingDispatchLati, setMovingDispatchLati] = useState(0);
  // const [movingDispatchLongi, setMovingDispatchLongi] = useState(0);
  // const [movingDistance, setMovingDistance] = useState();
  // const [arrivalMovingTime, setArrivalMovingTime] = useState(0);
  // Create a reference to the HTML element we want to put the map on
  const mapRef = useRef(null);
  console.log(sectionDirections);
  useEffect(() => {
    const tracker = JSON.parse(localStorage.getItem("tracker"));
    if (tracker) {
      //setDistance(tracker.distan.Distance);
      //setArrivalTime(tracker.distan.Time);
      setDispatchLati(tracker.lat);
      setDispatchLongi(tracker.long);
    }
  }, []);

  useEffect(() => {
    const Destination = JSON.parse(localStorage.getItem("customerDestination"));

    if (Destination) {
      setDestinationLati(Destination.buyerlati);
      setDestinationLongi(Destination.buyerlongi);
    }
  }, []);

  /**
   * Create the map instance
   * While `useEffect` could also be used here, `useLayoutEffect` will render
   * the map sooner
   */
  useLayoutEffect(() => {
    // `mapRef.current` will be `undefined` when this hook first runs; edge case that
    if (!mapRef.current) return;
    const H = window.H;
    const platform = new H.service.Platform({
      apikey: "Laf8Qt2Exusbyk7XWsvKU7aa3c700cHRzfzysYbyFmo",
    });
    const defaultLayers = platform.createDefaultLayers();
    const hMap = new H.Map(mapRef.current, defaultLayers.vector.normal.map, {
      center: { lat: dispatchLati, lng: dispatchLongi },
      zoom: 2,
      pixelRatio: window.devicePixelRatio || 1,
    });

    // eslint-disable-next-line no-unused-vars
    const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(hMap));

    // eslint-disable-next-line no-unused-vars
    const ui = H.ui.UI.createDefault(hMap, defaultLayers);
    window.addEventListener("resize", () => hMap.getViewPort().resize());
    /**
     * Calculates and displays a car route from the Brandenburg Gate in the centre of Berlin
     * to Friedrichstraße Railway Station.
     *
     * A full list of available request parameters can be found in the Routing API documentation.
     * see: http://developer.here.com/rest-apis/documentation/routing/topics/resource-calculate-route.html
     *
     * @param {H.service.Platform} platform A stub class to access HERE services
     */
    function calculateRouteFromAtoB(platform) {
      var router = platform.getRoutingService(null, 8),
        routeRequestParams = {
          routingMode: "fast",
          transportMode: "car",
          origin: `${dispatchLati},${dispatchLongi}`,
          destination: `${destinationLati},${destinationLongi}`,
          return:
            "polyline,turnByTurnActions,actions,instructions,travelSummary",
        };

      router.calculateRoute(routeRequestParams, onSuccess, onError);
    }

    /**
     * This function will be called once the Routing REST API provides a response
     * @param {Object} result A JSONP object representing the calculated route
     *
     * see: http://developer.here.com/rest-apis/documentation/routing/topics/resource-type-calculate-route.html
     */
    function onSuccess(result) {
      var route = result.routes[0];
      setSectionDirection(route.sections);
      console.log(route);
      /*
       * The styling of the route response on the map is entirely under the developer's control.
       * A representative styling can be found the full JS + HTML code of this example
       * in the functions below:
       */
      addRouteShapeToMap(route);
      addManueversToMap(route);
      addWaypointsToPanel(route);
      addSummaryToPanel(route);
      // ... etc.
    }

    // ======================================================================

    // =======================UI TO BE ADJUSTED STARTS HERE===========================

    /**
     * Creates a series of H.map.Marker points from the route and adds them to the map.
     * @param {Object} route A route as received from the H.service.RoutingService
     */
    function addSummaryToPanel(sectionDirections) {
      let duration = 0,
        distance = 0;

      sectionDirections.sections.forEach((section) => {
        distance += section.travelSummary.length;
        duration += section.travelSummary.duration;
      });
      setTravelDistance(distance);
      setTravelTime(toMMSS(duration));
    }

    /**
     * Creates a series of H.map.Marker points from the route and adds them to the map.
     * @param {Object} route A route as received from the H.service.RoutingService
     */
    function addWaypointsToPanel(sectionDirections) {
      let labels = [];

      sectionDirections.sections.forEach((section) => {
        labels.push(section.turnByTurnActions[0].nextRoad.name[0].value);
        labels.push(
          section.turnByTurnActions[section.turnByTurnActions.length - 1]
            .currentRoad.name[0].value
        );
      });
      let joinLabels = labels.join(" - ");
      setTravelLabels(joinLabels);
    }

    function toMMSS(duration) {
      return (
        Math.floor(duration / 60) + " minutes " + (duration % 60) + " seconds."
      );
    }

    // =======================UI TO BE ADJUSTED ENDS HERE===========================
    /**
     * Creates a series of H.map.Marker points from the route and adds them to the map.
     * @param {Object} route A route as received from the H.service.RoutingService
     */
    function addManueversToMap(sectionDirections) {
      var svgMarkup =
          '<svg width="18" height="18" ' +
          'xmlns="http://www.w3.org/2000/svg">' +
          '<circle cx="8" cy="8" r="8" ' +
          'fill="#1b468d" stroke="white" stroke-width="1" />' +
          "</svg>",
        dotIcon = new H.map.Icon(svgMarkup, { anchor: { x: 8, y: 8 } }),
        group = new H.map.Group(),
        i,
        // eslint-disable-next-line no-unused-vars
        j;

      sectionDirections.sections.forEach((section) => {
        let poly = H.geo.LineString.fromFlexiblePolyline(
          section.polyline
        ).getLatLngAltArray();

        let actions = section.actions;
        // Add a marker for each maneuver
        for (i = 0; i < actions.length; i += 1) {
          let action = actions[i];
          var marker = new H.map.Marker(
            {
              lat: poly[action.offset * 3],
              lng: poly[action.offset * 3 + 1],
            },
            { icon: dotIcon }
          );
          marker.instruction = action.instruction;
          group.addObject(marker);
        }

        group.addEventListener(
          "tap",
          function (evt) {
            hMap.setCenter(evt.target.getGeometry());
            openBubble(evt.target.getGeometry(), evt.target.instruction);
          },
          false
        );

        // Add the maneuvers group to the map
        hMap.addObject(group);
      });
    }

    /**
     * Creates a H.map.Polyline from the shape of the route and adds it to the map.
     * @param {Object} route A route as received from the H.service.RoutingService
     */
    function addRouteShapeToMap(sectionDirections) {
      sectionDirections.sections.forEach((section) => {
        // decode LineString from the flexible polyline
        let linestring = H.geo.LineString.fromFlexiblePolyline(
          section.polyline
        );

        // Create a polyline to display the route:
        let polyline = new H.map.Polyline(linestring, {
          style: {
            lineWidth: 4,
            strokeColor: "rgba(0, 128, 255, 0.7)",
          },
        });

        // Add the polyline to the map
        hMap.addObject(polyline);
        // And zoom to its bounding rectangle
        hMap.getViewModel().setLookAtData({
          bounds: polyline.getBoundingBox(),
        });
      });
    }

    // Hold a reference to any infobubble opened
    var bubble;

    /**
     * Opens/Closes a infobubble
     * @param {H.geo.Point} position The location on the map.
     * @param {String} text          The contents of the infobubble.
     */
    function openBubble(position, text) {
      if (!bubble) {
        bubble = new H.ui.InfoBubble(
          position,
          // The FO property holds the province name.
          { content: text }
        );
        ui.addBubble(bubble);
      } else {
        bubble.setPosition(position);
        bubble.setContent(text);
        bubble.open();
      }
    }

    // ==============================================================
    /**
     * This function will be called if a communication error occurs during the JSON-P request
     * @param {Object} error The error message received.
     */
    function onError(error) {
      alert("Can't reach the remote server");
    }

    // Now use the map as required...
    calculateRouteFromAtoB(platform);

    // This will act as a cleanup to run once this hook runs again.
    // This includes when the component un-mounts
    return () => {
      hMap.dispose();
    };
  }, [mapRef, dispatchLati, dispatchLongi, destinationLati, destinationLongi]); // This will run this hook every time this ref is updated

  useEffect(() => {
    const timer = setTimeout(() => {
      var readDirection = document.getElementById("read__direction");
      var readtest = document.getElementById("read__test");
      readtest.addEventListener("click", showText);
      function showText() {
        // var btn = [];
        // Array.from(sectionDirections).map((section) =>
        //   section.actions.map((action, idx) =>
        //     btn.push(section.actions[idx].instruction)
        //   )
        // );
        // let i = -1;
        // (function f() {
        //   i = (i + 1) % btn.length;
        //   readDirection.innerHTML = btn[i];
        //   setTimeout(f, 5000);
        // })();
        var timer = null;
        var index = 0;
        function cont() {
          var bbn = [];

          Array.from(sectionDirections).map((section) =>
            section.actions.map((action, idx) =>
              bbn.push(section.actions[idx].instruction)
            )
          );
          //let interve = travelTime / bbn.length;
          //console.log(interve);
          bbn[index] === []
            ? (readDirection.innerHTML = "Instructions Loading . . .")
            : (readDirection.innerHTML = bbn[index]);

          if (index === bbn.length - 1) {
            clearInterval(timer);
          } else {
            index++;
          }
          if (!readtest) {
            clearInterval(timer);
            readDirection.innerHTML = "Welcome To Your Destination!!! ";
          }
        }

        timer = setInterval(cont, 200000);
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [sectionDirections]);

  return (
    <div className="route__container">
      {/* ========================= */}
      <div className="map__container">
        <div
          className="map"
          ref={mapRef}
          style={{
            width: `100%`,
            height: "300px",
          }}
        />
      </div>
      {/* ==================== */}
      <div className="symbols__container">
        <div className="direction__container">
          <div className="travel__labels">
            <h3>{travelLabels}</h3>
          </div>
          <div id="read__direction" className="read__labels">
            <h3>Tap The directions box</h3>
          </div>
          <ol className="directions">
            {!sectionDirections
              ? "Loading. . . "
              : sectionDirections.map((section) =>
                  section.actions.map((action, idx) => (
                    <li id="read__test" key={idx}>
                      <span
                        className={
                          "arrow" + (action.direction || "") + action.action
                        }
                      ></span>
                      <span>{section.actions[idx].instruction}</span>
                    </li>
                  ))
                )}
          </ol>
        </div>

        <div className="travel__summary">
          <div className="travel__summary-distance">
            <span>Total Distance:</span> {travelDistance} m.
          </div>
          <div className="travel__summary-time">
            <span>Travel Time:</span> {""}
            {travelTime} {""} in current traffic
          </div>
        </div>
      </div>
      {/* =========================== */}
    </div>
  );
}
