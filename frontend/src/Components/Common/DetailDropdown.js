import React, { useState, useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import "./css/Dropdown.css";
import { apiInstance } from "../../api/index";
import Datepicker from "./Datepicker";
import cityJson from "../Kakaomap/city.json";
import schoolJson from "../Kakaomap/school.json";
import Button from "@mui/material/Button";
import { Map, MapMarker, Polyline } from "react-kakao-maps-sdk";

const DetailDropdown = (props) => {
  const selected = props.selected;
  const setSelected = props.setSelected;
  const [schoolList, setSchoolList] = useState([]);
  const [driverList, setDriverList] = useState([]);
  const [hourList, setHourList] = useState([]);
  const [minList, setMinList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [state, setState] = useState({
    center: { lat: 35.19919101818564, lng: 126.87300478078876 },
    isPanto: false,
    level: 7,
  });
  const [preSchool, setPreSchool] = useState("");
  const [preCity, setPreCity] = useState("");
  useEffect(() => {
    console.log(selected);
    for (let i = 0; i < cityJson.length; i++) {
      if (cityJson[i].localCity == selected.localCity) {
        setState((prev) => {
          return {
            ...prev,
            center: {
              lat: cityJson[i].center.lat,
              lng: cityJson[i].center.lng,
            },
            level: cityJson[i].level,
          };
        });
        if (preSchool == selected.localSchool) {
          break;
        }
        for (let j = 0; j < schoolJson.length; j++) {
          if (schoolJson[j].localSchool == selected.localSchool) {
            console.log(selected.localSchool);
            setState((prev) => {
              return {
                ...prev,
                center: {
                  lat: schoolJson[j].center.lat,
                  lng: schoolJson[j].center.lng,
                },
                level: schoolJson[j].level,
              };
            });
            setPreSchool(selected.localSchool);
            setPreCity(selected.localCity);
            break;
          }
        }
        setPreSchool(selected.localSchool);
        setPreCity(selected.localCity);
        break;
      }
    }
  }, [selected]);

  useEffect(() => {
    let result = [];
    for (let i = 0; i < 24; i++) {
      result.push(i);
    }
    setHourList(result);
    result = [];
    for (let i = 0; i < 60; i++) {
      result.push(i);
    }
    setMinList(result);
    result = [];
    result.push("STORE");
    result.push("DESTINATION");
    result.push("HUB");
    setCategoryList(result);
  }, []);

  useEffect(() => {
    if (selected.localCity && selected.localSchool) {
      async function getUser() {
        const res = await apiInstance().post("spot/current", selected);
        let result = [];
        for (let i = 0; i < res.data.length; i++) {
          let item = res.data[i];
          if (item.userName != null) {
            result.push(item);
          }
        }
        setDriverList(result);
      }
      getUser();
    }
  }, [selected]);

  const onChange = (e) => {
    // console.log(e);

    const nextInfo = {
      ...selected,
      [e.target.name]: e.target.value,
    };
    setSelected(nextInfo);

    if (nextInfo.localCity === "??????") {
      setSchoolList(schoolSeoul);
    } else if (nextInfo.localCity === "??????") {
      setSchoolList(schoolGwangju);
    } else if (nextInfo.localCity === "??????") {
      setSchoolList(schoolSuwon);
    } else if (nextInfo.localCity === "??????") {
      setSchoolList(schoolIncheon);
    }
  };

  const schoolSeoul = [
    "???????????????",
    "???????????????",
    "????????????????????????",
    "?????????????????????",
    "???????????????",
    "?????????????????????",
    "???????????????",
    "?????????????????????",
    "????????????????????????",
    "????????????????????????",
    "???????????????",
  ];
  const schoolSuwon = ["??????????????????(?????????????????????)"];
  const schoolIncheon = ["?????? ??????????????????", "???????????????(??????)"];
  const schoolGwangju = ["?????????????????????", "???????????????", "SSAFY"];
  return (
    <div className="dropdown">
      <FormControl variant="standard" sx={{ m: 1, minWidth: 100 }}>
        <InputLabel id="demo-simple-select-standard-label">??????</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={selected.localCity}
          onChange={(e) => {
            onChange(e);
            setSelected((prev) => {
              return {
                ...prev,
                localSchool: "",
              };
            });
          }}
          label="??????"
          name="localCity"
        >
          <MenuItem value={"??????"}>??????</MenuItem>
          <MenuItem value={"??????"}>??????</MenuItem>
          <MenuItem value={"??????"}>??????</MenuItem>
          <MenuItem value={"??????"}>??????</MenuItem>
        </Select>
      </FormControl>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
        <InputLabel id="demo-simple-select-standard-label">??????</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={selected.localSchool}
          onChange={onChange}
          label="??????"
          name="localSchool"
        >
          {schoolList.map((localSchool) => (
            <MenuItem key={localSchool} value={localSchool}>
              {localSchool}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 100 }}>
        <InputLabel id="demo-simple-select-standard-label">????????????</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={selected.driver}
          onChange={(e) => {
            console.log(e);
            setSelected((prev) => {
              return {
                ...prev,
                driver: e.target.value,
              };
            });
            console.log(e.target.value);
          }}
          label="????????????"
          name="driver"
        >
          {driverList.map((d) => (
            <MenuItem key={d.userIdx} value={d.userName}>
              {d.userName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Datepicker selected={selected} setSelected={setSelected} />
      <FormControl size="small" variant="standard" sx={{ m: 1, minWidth: 100 }}>
        <InputLabel id="demo-simple-select-standard-label">??????</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={selected.hour}
          onChange={(e) => {
            setSelected((prev) => {
              return {
                ...prev,
                hour: e.target.value,
              };
            });
            console.log(e.target.value);
          }}
          label="??????"
          name="hour"
        >
          {hourList.map((hour) => (
            <MenuItem key={hour} value={hour}>
              {hour}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl
        className="label"
        variant="standard"
        size="small"
        sx={{ m: 1, minWidth: 100 }}
      >
        <InputLabel id="demo-simple-select-standard-label">???</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={selected.min}
          onChange={(e) => {
            setSelected((prev) => {
              return {
                ...prev,
                min: e.target.value,
              };
            });
            console.log(e.target.value);
          }}
          label="???"
          name="min"
          style={{ maxHeight: 300 }}
        >
          {minList.map((min) => (
            <MenuItem key={min} value={min}>
              {min}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl
        className="label1"
        variant="standard"
        size="small"
        sx={{ m: 1, minWidth: 100 }}
      >
        <InputLabel id="demo-simple-select-standard-label">??????</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={selected.category}
          onChange={(e) => {
            setSelected((prev) => {
              return {
                ...prev,
                category: e.target.value,
              };
            });
          }}
          label="??????"
          name="category"
          style={{ maxHeight: 300 }}
        >
          {categoryList.map((category, index) => (
            <MenuItem key={index} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div class="col-3">
        <input
          class="effect-1"
          type="text"
          placeholder="?????????"
          onChange={(e) => {
            setSelected((prev) => {
              return {
                ...prev,
                storename: e.target.value,
              };
            });
          }}
        />
        <span class="focus-border"></span>
      </div>
      <div class="col-3">
        <input
          class="effect-1"
          type="text"
          placeholder="??????"
          onChange={(e) => {
            setSelected((prev) => {
              return {
                ...prev,
                count: e.target.value,
              };
            });
          }}
        />
        <span class="focus-border"></span>
      </div>
      <div class="col-3">
        <input
          class="effect-1"
          type="text"
          placeholder="??????"
          value={selected.lat}
          onChange={(e) => {
            setSelected((prev) => {
              return {
                ...prev,
                lat: e.target.value,
              };
            });
          }}
        />
        <span class="focus-border"></span>
      </div>

      <div class="col-3">
        <input
          class="effect-1"
          type="text"
          placeholder="??????"
          value={selected.lng}
          onChange={(e) => {
            setSelected((prev) => {
              return {
                ...prev,
                lng: e.target.value,
              };
            });
          }}
        />
        <span class="focus-border"></span>
      </div>
      <Map
        center={state.center}
        level={state.level}
        style={{
          // ????????? ??????
          width: "100%",
          height: "450px",
        }}
        onClick={(_t, mouseEvent) =>
          setSelected((prev) => {
            return {
              ...prev,
              lat: mouseEvent.latLng.getLat(),
              lng: mouseEvent.latLng.getLng(),
            };
          })
        }
      >
        {selected && <MapMarker position={selected} />}
      </Map>
    </div>
  );
};
export default DetailDropdown;
