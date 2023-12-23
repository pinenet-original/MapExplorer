import { popupCloseManager } from "@/utils/helpers";

export const MapReachedMarkerDescriptor = ({setMarkerList, currentMarker, markerList, setShowMap}) => {
  const isMarkerLast = markerList[markerList.length - 1].markerName === currentMarker.markerName;

  return (
    <div 
      style={{
        width: '100%',
        height: "100%",
        background: 'lavender',
        position: 'absolute',
        bottom: '0',
        zIndex: '99',
        padding: '10px'
      }} 
      key={currentMarker?.markerName}>
      <h3>{currentMarker?.markerInfo?.descriptionTitle}</h3>
      <p className='mb-5 '>{currentMarker?.markerInfo?.descriptionText}</p>
      {
        isMarkerLast
        ?
          <button 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" 
            onClick={ () => {setShowMap(prev => !prev)} }>
            Back to Route description
          </button>
        :
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" 
          onClick={() => popupCloseManager(setMarkerList, currentMarker)}>SEE NEXT SIGHTSEEING
        </button>
      }
    </div>
  );
};