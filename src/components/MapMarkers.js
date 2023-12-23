import React from 'react';
import { popupCloseManager } from "@/utils/helpers";
import  { Marker,Popup } from "react-map-gl";


export const MapMarkers = ({markerList, setMarkerList, currentMarker}) => {
  return (
    markerList?.map((marker) => {
      if(marker.visible) return (
        <React.Fragment key={marker.markerName}>
        <Marker
          longitude={marker.longitude}
          latitude={marker.latitude}
          offsetTop={-20}
          offsetLeft={-10}
          draggable={true}
          color={marker.color}
        />
        {
          marker.reached && 
          <Popup
            key={marker.markerName}
            longitude={marker.longitude}
            latitude={marker.latitude}
            onClose={() => {popupCloseManager(setMarkerList, currentMarker)}}
          >
            <div key={marker.markerName}>
              <h3>{marker.markerInfo.descriptionTitle}</h3>
              <p>{marker.markerInfo.descriptionText}</p>
              <button onClick={() => popupCloseManager(setMarkerList, currentMarker)} className="Henry">SEE NEXT SIGHTSEEING</button>
            </div>
          </Popup>
        }
        </React.Fragment>
      )
    })
  );
}
