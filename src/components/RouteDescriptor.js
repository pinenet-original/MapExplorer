import {calculateDistance} from "@/utils/helpers"

export const RouteDescriptor = ({route, currentLocation, setShowMap}) => {

  const checkDistance = (idx, routeItem) => {
    if (idx === 0) {
      return calculateDistance(currentLocation.latitude, currentLocation.longitude, routeItem.latitude, routeItem.longitude)
    }
     else {
       return calculateDistance(route.data[(idx - 1)].latitude, route.data[(idx - 1)].longitude, route.data[idx].latitude, route.data[idx].longitude)
     }
  }

  return (
    <div className="text-center px-4">
      <h1 className="text-4xl mb-5">
        {route.routeTitle}
      </h1>
      <div className="mb-5">
        {route?.data.map((routeItem, idx) => {
          return (
            <div key={routeItem.markerName}>{`${idx+1} ) ${routeItem.markerName} - ${checkDistance(idx, routeItem)}m`}</div>
          )
        })}
      </div>
      <div className="text-center">
        <button onClick={() => {setShowMap(prev => !prev)}} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">Pradeti Marsruta</button>
      </div>
    </div>
  );
}
