import {calculateDistance} from "@/utils/helpers"
import Image from 'next/image'

export const RouteDescriptor = ({route, currentLocation, setShowMap, routeSetter}) => {

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
      <ul className="mb-5 max-w-xs text-left mx-auto">
        {route?.data.map((routeItem, idx) => {
          return (
            <li
              className="mb-2 flex justify-between"
              key={routeItem.markerName}
            >
              <span>
                {`${idx+1} ) ${routeItem.markerName} - ${checkDistance(idx, routeItem)}m`}
              </span>
              {
                routeItem.reached
                &&
                <span>
                  <Image src="/check.png" alt="done" width={24} height={24} />
                </span>
              }
            </li>
          )
        })}
      </ul>
      <div className="text-center">
        <button 
          onClick={() => {setShowMap(prev => !prev)}} 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mb-4">
            ЗАПУСТИ КАРТУ
        </button>
      </div>
      {/* <div className="text-center">
        <button 
          onClick={() => {routeSetter()}} 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
            Atgal i marsruto sarasa
        </button>
      </div> */}
    </div>
  );
}
