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
  // consist of the name of the drug, how many times a day, schedule and reminder
  //name, dosage, time

  // ****maybe have the reminder reflect how many times per
  const {
    days,
    setDays,
    remindedTimes,
    handleTimeChange,
    handleAddTime,
    removeTime,
    formatTimeTo12Hour,
  } = useContext(MedsContext);

  //search med, click on it to have it appear on page click to add it (btn) to med list

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

  function addToMed(index) {
    setUserDrugList((prev) => {
      const updatedList = [...prev];
      const selectedCard = updatedList[index];
      selectedCard.howManyTimes = `Take ${times} per ${selectedOption}`;
      selectedCard.showInputValues = !selectedCard.showInputValues;
      // convert time
      selectedCard.timeToTake = remindedTimes.map((rt) => (
        <p>{`Take this medication on ${rt.day} at ${formatTimeTo12Hour(
          rt.time
        )}`}</p>
      ));
      return updatedList;
    });

    setTimes(0);
  }

  console.log(userDrugList, "UDL 2.0");

  function handleDaysChange(e) {
    const { name, value } = e.target;
    setDays((prev) => {
      const updatedDays = [...prev];
      updatedDays[name] = value;
      return updatedDays;
    });
  };
  // remove time button for each time created

  return (
    <div>
      <Navbar />
      <SearchBar
        searchTerm={drugName}
        setSearchTerm={setDrugName}
        drugData={drugData}
        // userDrugList={userDrugList}
        // setUserDrugList={setUserDrugList}
      />
      <br />
      <br />
      {/* dont add the same meds */}
      {userDrugList.map((item, index) => (
        <Card sx={{ margin: "20px" }}>
          {/* title and edit will be side by side 
                        title on the left and edit on the right
                      */}
          <Button>Edit</Button>
          <h2 key={index}>{item?.drugName}</h2>
          {
            //if add btn is hit, hide div
            //we want to capture the value of the input and option and save it to a state
          }

          {/* ****all items are being triggered when updating times per day *** */}
          <div style={{ display: item.showInputValues ? "none" : "block" }}>
            How many times?
            {/* requires select options */}
            <Input
              type="number"
              value={times}
              onChange={handleTimesChange}
            />{" "}
            per
            <Select
              value={selectedOption}
              // label="Age"
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
                      {console.log(
                        remindedTimes[index]?.day.includes(day.day),
                        "WHAT?"
                      )}
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
            {console.log(remindedTimes, "RemindMan")}
            {/* not working like i want it */}
            <button onClick={handleAddTime}>
              {remindedTimes.length === 0
                ? "Add A Reminder"
                : "Add Another Reminder"}
            </button>
            <button onClick={removeTime}>Remove Reminder</button>
            {/* <Reminder {...item}/> */}
          </div>
          <div>
            {item?.howManyTimes}
            {console.log(item, "item")}
            {item.timeToTake?.length !== undefined ? (
              <>
                <h3>{`You have ${item.timeToTake?.length} reminders: `}</h3>
              </>
            ) : null}
            {item?.timeToTake}
          </div>

          <Button
            sx={{ display: item.showInputValues ? "none" : "block" }}
            onClick={() => addToMed(index)}
          >
            Add to Medicine
          </Button>
          <Button>Remove Medication from List</Button>
        </Card>
      ))}
    </div>
  );
}