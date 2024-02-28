import React, { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useTranslation } from "next-i18next";

const EditeRoutes = ({ routesList, setRouteList, userInfo }) => {
  const { t } = useTranslation("common", "routeForm");
  const [showFormAddNewMarker, setShowFormAddNewMarker] = useState(false);
  const [routeSelected, setRouteSelected] = useState();
  const [newMarker, setNewMarker] = useState({
    latitude: "",
    longitude: "",
    markerName: "",
    color: "",
    markerInfo: {
      name: "",
      video: "",
      descriptionTitle: "",
      descriptionText: "",
    },
    reached: false,
    visible: true,
  });
  const [showForm, setShowForm] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const selectedRouteIndex = routesList.findIndex(
    (route) => route.id === selectedRoute?.id
  );
  const selectedMarkerIndex = selectedRoute?.data.findIndex(
    (marker) => marker.id === selectedMarker?.id
  );
  const index = selectedRoute?.data.findIndex(
    (marker) => marker.id === selectedMarker?.id
  );

  const showMarkerListManager = (marker) => {
    setSelectedMarker(marker);
  };

  const showRoutesListManager = (route) => {
    setSelectedRoute(route);
  };

  const updateCollection = async (e) => {
    e.preventDefault();
    const docRef = doc(db, "clients", userInfo.uid);
    await updateDoc(docRef, {
      routes: routesList,
    });
  };

  const showFormAddNewMarkerHandler = (e) => {
    e.preventDefault();
    setShowFormAddNewMarker(!showFormAddNewMarker);
  };

  const saveNewMarker = (e, index) => {
    e.preventDefault();
    const newRoutes = [...routesList];
    newRoutes[index].data.push(newMarker);
    setRouteList(newRoutes);
    setNewMarker(newMarker);
    setShowFormAddNewMarker(false);
  };

  const showFormManager = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div
        className="flex justify-center text-4xl mb-6 cursor-pointer"
        onClick={showFormManager}
      >
        {t("editexistingRoute")}
      </div>
      {selectedMarker ? (
        <div className="w-full max-w-2xl flex flex-col items-center">
          <div className="mb-3">
            <button
              onClick={() => setSelectedMarker(null)}
              className="rounded bg-blue-500 hover:bg-blue-600 text-white py-1 px-2"
            >
              Back to markers
            </button>
          </div>
          <div className="bg-slate-100 rounded-lg  shadow-lg p-3 flex flex-col gap-2 w-96 mb-3">
            <div className="flex justify-between">
              <label className="font-bold">Marker Name: </label>
              <input
                className="w-[230px] rounded-lg pl-2"
                type="text"
                placeholder="Marker Name"
                value={selectedMarker.markerName}
                onChange={(e) => {
                  const newRoutes = [...routesList];
                  newRoutes[selectedRouteIndex].data[
                    selectedMarkerIndex
                  ].markerName = e.target.value;
                  setNewMarker(newRoutes);
                }}
              />
            </div>
            <div className="flex justify-between">
              <label className="font-bold">Color: </label>
              <input
                className="w-[230px] rounded-lg pl-2"
                type="text"
                placeholder="Color"
                value={selectedMarker.color}
                onChange={(e) => {
                  const newRoutes = [...routesList];
                  newRoutes[selectedRouteIndex].data[
                    selectedMarkerIndex
                  ].color = e.target.value;
                  setNewMarker(newRoutes);
                }}
              />
            </div>
            <div className="flex justify-between">
              <label className="font-bold">Latitude: </label>
              <input
                className="w-[230px] rounded-lg pl-2"
                type="text"
                placeholder="Latitude"
                value={selectedMarker.latitude}
                onChange={(e) => {
                  const newRoutes = [...routesList];
                  newRoutes[selectedRouteIndex].data[
                    selectedMarkerIndex
                  ].latitude = e.target.value;
                  setNewMarker(newRoutes);
                }}
              />
            </div>
            <div className="flex justify-between">
              <label className="font-bold">Longitude: </label>
              {selectedMarker.longitude}
            </div>
            <div className="flex flex-col gap-3">
              <h1 className="text-xl mb-2"> Marker Info</h1>
              <div className="flex justify-between">
                <label className="font-bold">Marker name: </label>
                {selectedMarker.markerInfo.name}
              </div>
              <div className="flex justify-between">
                <label className="font-bold">Video Url: </label>
                {selectedMarker.markerInfo.video}
              </div>
              <div className="flex justify-between">
                <label className="font-bold">Description Title: </label>
                {selectedMarker.markerInfo.descriptionTitle}
              </div>
              <div className="flex justify-between">
                <label className="font-bold">Description Text: </label>
                {selectedMarker.markerInfo.descriptionText}
              </div>
            </div>
          </div>
          <button
            className="rounded bg-blue-500 hover:bg-blue-600 text-white py-1 px-2"
            onClick={(e) => updateCollection(e, index)}
          >
            Save Marker
          </button>
        </div>
      ) : selectedRoute ? (
        <div className="">
          <button
            onClick={() => setSelectedRoute(null)}
            className="rounded bg-blue-500 hover:bg-blue-600 text-white py-1 px-2"
          >
            Back to routes
          </button>
          {selectedRoute?.data.map((marker, index) => (
            <div
              key={index}
              onClick={() => showMarkerListManager(marker)}
              className="border-2 w-[200px]  flex items-center justify-center bg-slate-100 rounded-lg shadow-lg m-4 cursor-pointer transition-all duration-300 ease-in-out hover:bg-slate-200 hover:shadow-xl"
            >
              {marker.markerName}
            </div>
          ))}
        </div>
      ) : (
        routesList.map((route, index) => (
          <div
            key={index}
            onClick={() => showRoutesListManager(route)}
            className="border-2 w-[200px]  flex items-center justify-center bg-slate-100 rounded-lg shadow-lg m-4 cursor-pointer transition-all duration-300 ease-in-out hover:bg-slate-200 hover:shadow-xl"
          >
            {route.routeTitle}
          </div>
        ))
      )}

      {/* <form
        className={`mb-4 bg-slate-100 rounded-lg flex flex-col  shadow-lg p-3 gap-3 transition-all duration-500 ease-in-out ${
          showForm ? "opacity-100" : "h-0 opacity-0   overflow-hidden"
        }`}
      >
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-[900px]">
          {routesList?.map((route, index) => {
            return (
              <div
                className="mb-4 flex flex-col items-center gap-3"
                key={`route-${index}`}
                onClick={() => setRouteSelected(index)}
              >
                <h1 className="mb-3 text-red-500">Route {index + 1}</h1>
                <input
                  type="text"
                  placeholder={t("routeForm:routeTitle")}
                  value={route.routeTitle}
                  onChange={(e) => {
                    const newRoutes = [...routesList];
                    newRoutes[index].routeTitle = e.target.value;
                    setRouteList(newRoutes);
                  }}
                  className="mb-5 w-[290px]"
                />

                {route.data.map((marker, markerIndex) => {
                  return (
                    <div
                      className="mb-6 shadow-lg p-3 bg-slate-200 rounded-lg  gap-3"
                      key={markerIndex}
                    >
                      <h2 className="mb-3">Marker {markerIndex + 1}</h2>
                      <div className="border-2 flex flex-row flex-wrap gap-3 max-w-[600px]">
                        <input
                          type="text"
                          placeholder={t("routeForm:latitude")}
                          value={marker.latitude}
                          onChange={(e) => {
                            const newRoutes = [...routesList];
                            newRoutes[index].data[markerIndex].latitude =
                              e.target.value;
                            setRouteList(newRoutes);
                          }}
                          className="mb-5 w-[290px]"
                        />
                        <input
                          type="text"
                          placeholder={t("routeForm:longitude")}
                          value={marker.longitude}
                          onChange={(e) => {
                            const newRoutes = [...routesList];
                            newRoutes[index].data[markerIndex].longitude =
                              e.target.value;
                            setRouteList(newRoutes);
                          }}
                          className="mb-5 w-[290px]"
                        />
                        <input
                          type="text"
                          placeholder={t("routeForm:markerName")}
                          value={marker.markerName}
                          onChange={(e) => {
                            const newRoutes = [...routesList];
                            newRoutes[index].data[markerIndex].markerName =
                              e.target.value;
                            setRouteList(newRoutes);
                          }}
                          className="mb-5 w-[290px]"
                        />
                        <input
                          type="text"
                          placeholder={t("routeForm:color")}
                          value={marker.color}
                          onChange={(e) => {
                            const newRoutes = [...routesList];
                            newRoutes[index].data[markerIndex].color =
                              e.target.value;
                            setRouteList(newRoutes);
                          }}
                          className="mb-5 w-[290px]"
                        />
                        <input
                          type="text"
                          placeholder={t("routeForm:name")}
                          value={marker.markerInfo.name}
                          onChange={(e) => {
                            const newRoutes = [...routesList];
                            newRoutes[index].data[markerIndex].markerInfo.name =
                              e.target.value;
                            setRouteList(newRoutes);
                          }}
                          className="mb-5 w-[290px]"
                        />
                        <input
                          type="text"
                          placeholder={t("routeForm:videoUrl")}
                          value={marker.markerInfo.video}
                          onChange={(e) => {
                            const newRoutes = [...routesList];
                            newRoutes[index].data[
                              markerIndex
                            ].markerInfo.video = e.target.value;
                            setRouteList(newRoutes);
                          }}
                          className="mb-5 w-[290px]"
                        />
                        <input
                          type="text"
                          placeholder={t("routeForm:descriptionTitle")}
                          value={marker.markerInfo.descriptionTitle}
                          onChange={(e) => {
                            const newRoutes = [...routesList];
                            newRoutes[index].data[
                              markerIndex
                            ].markerInfo.descriptionTitle = e.target.value;
                            setRouteList(newRoutes);
                          }}
                          className="mb-5 w-[290px]"
                        />
                        <input
                          type="text"
                          placeholder={t("routeForm:descriptionText")}
                          value={marker.markerInfo.descriptionText}
                          onChange={(e) => {
                            const newRoutes = [...routesList];
                            newRoutes[index].data[
                              markerIndex
                            ].markerInfo.descriptionText = e.target.value;
                            setRouteList(newRoutes);
                          }}
                          className="mb-5 w-[290px]"
                        />
                      </div>
                      <div className=" w-24 flex items-center justify-between ">
                        <label className="mr-3">Reached</label>
                        <input
                          type="checkbox"
                          checked={marker.reached}
                          onChange={(e) => {
                            const newRoutes = [...routesList];
                            newRoutes[index].data[markerIndex].reached =
                              e.target.checked;
                            setRouteList(newRoutes);
                          }}
                          className="w-4 h-4 text-white py-1 px-2 rounded-full"
                        />
                      </div>
                      <div className=" w-24 flex items-center justify-between ">
                        <label className="mr-3">Visible</label>
                        <input
                          type="checkbox"
                          checked={marker.visible}
                          onChange={(e) => {
                            const newRoutes = [...routesList];
                            newRoutes[index].data[markerIndex].visible =
                              e.target.checked;
                            setRouteList(newRoutes);
                          }}
                          className="w-4 h-4  text-white py-1 px-2 rounded-full"
                        />
                      </div>
                    </div>
                  );
                })}
                {routeSelected === index && showFormAddNewMarker && (
                  <div className="flex flex-col mb-6 shadow-lg p-3 bg-slate-200 rounded-lg w-[630px]">
                    <h2 className="mb-3">New Marker</h2>
                    <div className="border-2 flex flex-row flex-wrap gap-3 w-[600px]">
                      <input
                        type="text"
                        placeholder={t("routeForm:latitude")}
                        className="mb-5 w-[290px]"
                        value={newMarker.latitude}
                        onChange={(e) =>
                          setNewMarker({
                            ...newMarker,
                            latitude: e.target.value,
                          })
                        }
                      />
                      <input
                        type="text"
                        placeholder={t("routeForm:longitude")}
                        className="mb-5 w-[290px]"
                        value={newMarker.longitude}
                        onChange={(e) =>
                          setNewMarker({
                            ...newMarker,
                            longitude: e.target.value,
                          })
                        }
                      />
                      <input
                        type="text"
                        placeholder={t("routeForm:markerName")}
                        className="mb-5 w-[290px]"
                        value={newMarker.markerName}
                        onChange={(e) =>
                          setNewMarker({
                            ...newMarker,
                            markerName: e.target.value,
                          })
                        }
                      />
                      <input
                        type="text"
                        placeholder={t("routeForm:color")}
                        className="mb-5 w-[290px]"
                        value={newMarker.color}
                        onChange={(e) =>
                          setNewMarker({ ...newMarker, color: e.target.value })
                        }
                      />
                      <input
                        type="text"
                        placeholder={t("routeForm:name")}
                        className="mb-5 w-[290px]"
                        value={newMarker.markerInfo.name}
                        onChange={(e) =>
                          setNewMarker({
                            ...newMarker,
                            markerInfo: {
                              ...newMarker.markerInfo,
                              name: e.target.value,
                            },
                          })
                        }
                      />
                      <input
                        type="text"
                        placeholder={t("routeForm:videoUrl")}
                        className="mb-5 w-[290px]"
                        value={newMarker.markerInfo.video}
                        onChange={(e) =>
                          setNewMarker({
                            ...newMarker,
                            markerInfo: {
                              ...newMarker.markerInfo,
                              video: e.target.value,
                            },
                          })
                        }
                      />
                      <input
                        type="text"
                        placeholder={t("routeForm:descriptionTitle")}
                        className="mb-5 w-[290px]"
                        value={newMarker.markerInfo.descriptionTitle}
                        onChange={(e) =>
                          setNewMarker({
                            ...newMarker,
                            markerInfo: {
                              ...newMarker.markerInfo,
                              descriptionTitle: e.target.value,
                            },
                          })
                        }
                      />
                      <input
                        type="text"
                        placeholder={t("routeForm:descriptionText")}
                        className="mb-5 w-[290px]"
                        value={newMarker.markerInfo.descriptionText}
                        onChange={(e) =>
                          setNewMarker({
                            ...newMarker,
                            markerInfo: {
                              ...newMarker.markerInfo,
                              descriptionText: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className=" w-24 flex items-center justify-between ">
                      <label className="mr-3">Reached</label>
                      <input
                        type="checkbox"
                        checked={newMarker.reached}
                        onChange={(e) =>
                          setNewMarker({
                            ...newMarker,
                            reached: e.target.checked,
                          })
                        }
                        className="w-4 h-4  text-white py-1 px-2 rounded-full"
                      />
                    </div>
                    <div className=" w-24 flex items-center justify-between mb-4">
                      <label className="mr-3">Visible</label>
                      <input
                        type="checkbox"
                        checked={newMarker.visible}
                        onChange={(e) =>
                          setNewMarker({
                            ...newMarker,
                            visible: e.target.checked,
                          })
                        }
                        className="w-4 h-4  text-white py-1 px-2 rounded-full"
                      />
                    </div>
                    <button
                      className="rounded bg-blue-500 hover:bg-blue-600 text-white py-1 px-2"
                      onClick={(e) => saveNewMarker(e, index)}
                    >
                      Save Marker
                    </button>
                  </div>
                )}
                <button
                  className="rounded bg-blue-500 hover:bg-blue-600 text-white py-1 px-2"
                  onClick={showFormAddNewMarkerHandler}
                >
                  {routeSelected === index && showFormAddNewMarker
                    ? "Hide Form"
                    : "Add New Marker"}
                </button>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center">
          <button
            className="rounded bg-blue-500 hover:bg-blue-600 text-white py-1 px-2"
            onClick={updateCollection}
          >
            Update Collection
          </button>
        </div>
      </form> */}
    </div>
  );
};

export default EditeRoutes;
