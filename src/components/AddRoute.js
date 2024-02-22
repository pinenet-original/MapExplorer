import React, { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useTranslation } from "next-i18next";

const AddRoute = ({ routesList, setRouteList, userInfo }) => {
  const { t } = useTranslation("common", "routeForm");

  const [newRoute, setNewRoute] = useState({
    routeTitle: "",
    data: [
      {
        color: "",
        latitude: "",
        longitude: "",
        markerInfo: {
          name: "",
          video: "",
          descriptionTitle: "",
          descriptionText: "",
        },
        markerName: "",
        reached: false,
        visible: true,
      },
    ],
  });
  const [showForm, setShowForm] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const updateCollection = async (e) => {
    e.preventDefault();
    const docRef = doc(db, "clients", userInfo.uid);
    await updateDoc(docRef, {
      routes: routesList,
    });
  };

  const saveNewRoute = (e) => {
    e.preventDefault();
    const newRoutesList = [...routesList, newRoute];
    setRouteList(newRoutesList);
    setNewRoute(newRoute);
    updateCollection(e);
  };

  const showFormManager = () => {
    setShowForm(!showForm);
  };

  useEffect(() => {
    const routeTitle = Object.values(newRoute).every((field) => {
      if (field === "") {
        return false;
      }
      return true;
    });

    const allDataFieldsFilled = newRoute.data.every((data) => {
      return Object.values(data).every((field) => {
        if (field === "") {
          return false;
        }
        return true;
      });
    });

    setIsFormValid(routeTitle && allDataFieldsFilled);
  }, [newRoute]);

  return (
    <div className=" w-full">
      <div
        className="flex justify-center text-4xl mb-6 cursor-pointer"
        onClick={showFormManager}
      >
        {t("addNewRoute")}
      </div>

      <form
        className={`mb-4 bg-slate-100 rounded-lg flex flex-col  shadow-lg p-3 px-5 gap-3 transition-all duration-500 ease-in-out ${
          showForm ? "opacity-100" : "h-0 opacity-0   overflow-hidden"
        }`}
      >
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-[900px]">
          <div className="mb-4 flex flex-col items-center gap-3 ">
            <div className="mb-6 shadow-lg p-3 bg-slate-200 rounded-lg  gap-3">
              <div className="border-2 flex flex-row flex-wrap gap-3 max-w-[600px]">
                <input
                  type="text"
                  placeholder={t("routeForm:routeTitle")}
                  value={newRoute.routeTitle}
                  onChange={(e) =>
                    setNewRoute({ ...newRoute, routeTitle: e.target.value })
                  }
                  className="mb-5 w-[290px]"
                />

                <input
                  type="text"
                  placeholder={t("routeForm:color")}
                  value={newRoute.data[0].color}
                  onChange={(e) =>
                    setNewRoute({
                      ...newRoute,
                      data: [{ ...newRoute.data[0], color: e.target.value }],
                    })
                  }
                  className="mb-5 w-[290px]"
                />

                <input
                  type="text"
                  placeholder={t("routeForm:latitude")}
                  value={newRoute.data[0].latitude}
                  onChange={(e) =>
                    setNewRoute({
                      ...newRoute,
                      data: [{ ...newRoute.data[0], latitude: e.target.value }],
                    })
                  }
                  className="mb-5 w-[290px]"
                />

                <input
                  type="text"
                  placeholder={t("routeForm:longitude")}
                  value={newRoute.data[0].longitude}
                  onChange={(e) =>
                    setNewRoute({
                      ...newRoute,
                      data: [
                        { ...newRoute.data[0], longitude: e.target.value },
                      ],
                    })
                  }
                  className="mb-5 w-[290px]"
                />

                <input
                  type="text"
                  placeholder={t("routeForm:markerName")}
                  value={newRoute.data[0].markerName}
                  onChange={(e) =>
                    setNewRoute({
                      ...newRoute,
                      data: [
                        { ...newRoute.data[0], markerName: e.target.value },
                      ],
                    })
                  }
                  className="mb-5 w-[290px]"
                />

                <input
                  type="text"
                  placeholder={t("routeForm:name")}
                  value={newRoute.data[0].markerInfo.name}
                  onChange={(e) =>
                    setNewRoute({
                      ...newRoute,
                      data: [
                        {
                          ...newRoute.data[0],
                          markerInfo: {
                            ...newRoute.data[0].markerInfo,
                            name: e.target.value,
                          },
                        },
                      ],
                    })
                  }
                  className="mb-5 w-[290px]"
                />

                <input
                  type="text"
                  placeholder={t("routeForm:videoUrl")}
                  value={newRoute.data[0].markerInfo.video}
                  onChange={(e) =>
                    setNewRoute({
                      ...newRoute,
                      data: [
                        {
                          ...newRoute.data[0],
                          markerInfo: {
                            ...newRoute.data[0].markerInfo,
                            video: e.target.value,
                          },
                        },
                      ],
                    })
                  }
                  className="mb-5 w-[290px]"
                />

                <input
                  type="text"
                  placeholder={t("routeForm:descriptionTitle")}
                  value={newRoute.data[0].markerInfo.descriptionTitle}
                  onChange={(e) =>
                    setNewRoute({
                      ...newRoute,
                      data: [
                        {
                          ...newRoute.data[0],
                          markerInfo: {
                            ...newRoute.data[0].markerInfo,
                            descriptionTitle: e.target.value,
                          },
                        },
                      ],
                    })
                  }
                  className="mb-5 w-[290px]"
                />

                <input
                  type="text"
                  placeholder={t("routeForm:descriptionText")}
                  value={newRoute.data[0].markerInfo.descriptionText}
                  onChange={(e) =>
                    setNewRoute({
                      ...newRoute,
                      data: [
                        {
                          ...newRoute.data[0],
                          markerInfo: {
                            ...newRoute.data[0].markerInfo,
                            descriptionText: e.target.value,
                          },
                        },
                      ],
                    })
                  }
                  className=" w-[290px]"
                />
                <div className=" w-24 flex items-center justify-between mb-į ">
                  <label className="mr-3">{t("routeForm:reached")}</label>
                  <input
                    type="checkbox"
                    checked={newRoute.data[0].reached}
                    onChange={(e) =>
                      setNewRoute({
                        ...newRoute,
                        data: [
                          { ...newRoute.data[0], reached: e.target.checked },
                        ],
                      })
                    }
                  />
                </div>
                <div className=" w-24 flex items-center justify-between ">
                  <label className="mr-3">{t("routeForm:visible")}</label>
                  <input
                    type="checkbox"
                    checked={newRoute.data[0].visible}
                    onChange={(e) =>
                      setNewRoute({
                        ...newRoute,
                        data: [
                          { ...newRoute.data[0], visible: e.target.checked },
                        ],
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <button
            disabled={!isFormValid}
            onClick={saveNewRoute}
            className={`rounded w-[200px] text-white py-1 px-2 ${
              isFormValid
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {t("addNewRoute")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRoute;
