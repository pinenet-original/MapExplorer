const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c * 1000;
  return distance.toFixed(0);
};


const showReachedMarkerPopup = (setMarkerList, currentMarker) => {
  setMarkerList(prev => {
    const temp = [...prev]
    temp[currentMarker.idx].reached = true;
    return temp
  })
}

const popupCloseManager = (setMarkerList, currentMarker) => {
  setMarkerList(prev => {
    const temp = [...prev]
    temp.forEach((marker, idx) => {
      marker.reached = false
      if (idx === currentMarker.idx + 1) marker.visible = true;
      else marker.visible = false
    })
    return temp
  })
}


export { calculateDistance, showReachedMarkerPopup, popupCloseManager };
