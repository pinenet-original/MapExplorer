import { popupCloseManager } from "@/utils/helpers";
import { useRouter } from "next/router";

export const MapReachedMarkerDescriptor = ({setMarkerList, currentMarker, markerList, setShowMap}) => {
  const isMarkerLast = markerList[markerList.length - 1].markerName === currentMarker.markerName;

  const router = useRouter()

  const finalPageHandler = () => {
    setShowMap(prev => !prev)
    router.push('/final')
  }
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
      <h1 
        className="pt-4 mb-6 text-center text-xl sm:text-2xl md:text-4xl lg:text-6xl text-red-600">
          {currentMarker?.markerInfo?.descriptionTitle}
      </h1>
      {/* <p className='mb-5 '>{currentMarker?.markerInfo?.descriptionText}</p> */}
      {
        currentMarker?.markerInfo?.video
        &&
        <iframe 
        style={{margin: "0 auto 30px auto"}} 
        width="560" 
        height="315" 
        src={currentMarker.markerInfo.video}
        title="YouTube video player" 
        frameBorder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
      }
      {
        isMarkerLast
        ?
        <div className="flex justify-center">
          <button 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full text-5xl" 
            onClick={ finalPageHandler}>
            ЗАКОНЧИ ИГРУ
          </button>
        </div>
        :
        <div className="flex justify-center">
          <button 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full text-5xl" 
            onClick={() => popupCloseManager(setMarkerList, currentMarker)}>НАЙДИ СЛЕДУЮЩИЙ КЛАД
          </button>
        </div>
      }
    </div>
  );
};