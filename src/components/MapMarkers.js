import React, {useEffect} from 'react';
import  { Marker } from "react-map-gl";
import { MapReachedMarkerDescriptor } from "@/components/MapReachedMarkerDescriptor"


export const MapMarkers = ({markerList, setMarkerList, currentMarker, setShowMap}) => {
  useEffect(() => {}, [currentMarker])

  return (
    <>
    {
      currentMarker.reached
      &&
      <MapReachedMarkerDescriptor 
        setMarkerList={setMarkerList} 
        currentMarker={currentMarker}
        markerList={markerList}
        setShowMap={setShowMap}
      />
    }
      {markerList?.map((marker) => {
        if(marker.visible) return (
          <React.Fragment key={marker.markerName}>
          <Marker
            longitude={marker.longitude}
            latitude={marker.latitude}
            offsetTop={-20}
            offsetLeft={-10}
            draggable={false}
            color={marker.color}
          />
          </React.Fragment>
        )
      })}
    </>

  );
}
