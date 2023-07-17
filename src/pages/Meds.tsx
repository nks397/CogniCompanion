import { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import SearchBar from "../components/SearchMeds";
import {
  Button,
  Container,
  InputAdornment,
  TextField,
  Input,
  Card,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import { MedsContext } from "../context/MedsProvider";
import Reminder from "../components/Forms/Reminder";

export default function Meds() {
  const {
    userDrugList,
    setUserDrugList,
    handleOptionChange,
    handleTimesChange,
    times,
    setTimes,
    selectedOption,
  } = useContext(MedsContext);
  const [drugName, setDrugName] = useState<string>("");
  const [drugData, setDrugData] = useState<unknown[]>([]);
  const selectOptions = ["hour", "day", "week"];
  const [isAddToBtnClicked, setIsAddToBtnClicked] = useState(false);

  const {
    days,
    setDays,
    remindedTimes,
    handleTimeChange,
    handleAddTime,
    removeTime,
    formatTimeTo12Hour,
  } = useContext(MedsContext);

  function getMeds() {
    axios
      .get(`https://rxnav.nlm.nih.gov/REST/drugs.json?name=${drugName}`)
      .then((res) => {
        const drugNames = res.data.drugGroup.conceptGroup
          ?.filter((item) => item.tty === "SBD")
          .flatMap((item) =>
            item.conceptProperties.map((concept, index) => concept.name)
          );
        console.log(drugNames, "DNames");
        setDrugData(drugNames);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  useEffect(() => {
    getMeds();
  }, [drugName]);

  console.log(userDrugList, "LOOK");

  function addToMed(index) {
    setUserDrugList((prev) => {
      const updatedList = [...prev];
      const selectedCard = updatedList[index];
      selectedCard.howManyTimes = `Take ${times} per ${selectedOption}`;
      selectedCard.showInputValues = !selectedCard.showInputValues;
      selectedCard.timeToTake = remindedTimes.map((rt) => (
        <p>{`Take this medication on ${rt.day} at ${formatTimeTo12Hour(
          rt.time
        )}`}</p>
      ));
      return updatedList;
    });

    setTimes(0);
  }

  function handleDaysChange(e) {
    const { name, value } = e.target;
    setDays((prev) => {
      const updatedDays = [...prev];
      updatedDays[name] = value;
      return updatedDays;
    });
  }

  function validateForm() {
    const isTimesValid = times > 0;
    const isSelectedOptionValid = !!selectedOption;
    const isRemindedTimesValid =
      remindedTimes.length > 0 &&
      remindedTimes.every((time) => time.time && time.day.length > 0);

    return isTimesValid && isSelectedOptionValid && isRemindedTimesValid;
  }

  return (
    <div>
      <Navbar />
      <SearchBar
        searchTerm={drugName}
        setSearchTerm={setDrugName}
        drugData={drugData}
      />
      <br />
      <br />

      {userDrugList.map((item, index) => (
        <Card sx={{ margin: "20px" }}>
          <Button>Edit</Button>
          <h2 key={index}>{item?.drugName}</h2>

          <div style={{ display: item.showInputValues ? "none" : "block" }}>
            How many times?
            <Input
              type="number"
              value={times}
              onChange={handleTimesChange}
            />
            per
            <Select
              value={selectedOption}
              onChange={handleOptionChange}
            >
              {selectOptions.map((item) => (
                <MenuItem value={item}>{item}</MenuItem>
              ))}
            </Select>
            {remindedTimes.map((time, index) => (
              <>
                {days.map((day, dayIndex) => (
                  <div key={dayIndex}>
                    <label>
                      <input
                        type="checkbox"
                        checked={remindedTimes[index]?.day.includes(day.day)}
                        onChange={(e) => handleTimeChange(e, index, day.day)}
                      />
                      {day.day}
                    </label>
                  </div>
                ))}
                <input
                  key={index}
                  name="time"
                  type="time"
                  value={time.time}
                  onChange={(e) => handleTimeChange(e, index)}
                />
              </>
            ))}
            <button onClick={handleAddTime}>
              {remindedTimes.length === 0
                ? "Add A Reminder"
                : "Add Another Reminder"}
            </button>
            <button onClick={removeTime}>Remove Reminder</button>
          </div>
          <div>
            {item?.howManyTimes}
            {item.timeToTake?.length !== undefined ? (
              item.timeToTake?.length === 1 ? (
                <>
                  <h3>{`You have ${item.timeToTake?.length} reminder: `}</h3>
                </>
              ) : (
                <>
                  <h3>{`You have ${item.timeToTake?.length} reminders: `}</h3>
                </>
              )
            ) : null}
            {item?.timeToTake}
          </div>

          <Button
            sx={{ display: item.showInputValues ? "none" : "block" }}
            onClick={() => addToMed(index)}
            disabled={!validateForm()}
          >
            Add to Medicine
          </Button>
          <Button>Remove Medication from List</Button>
        </Card>
      ))}
    </div>
  );
}