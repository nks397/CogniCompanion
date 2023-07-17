import { Container, InputAdornment, TextField, Card, Typography } from "@mui/material";
import { useState, useEffect, useRef, useContext } from "react";
import SearchIcon from "@mui/icons-material/Search";
import AddMedsForm from "./Forms/AddMedsForm";
import { MedsContext } from "../context/MedsProvider";

interface SearchTermType {
    searchTerm: string,
    setSearchTerm: (term: string) => void,
    drugData: string,
    userDrugList,
    setUserDrugList
}

export default function SearchBar (props: SearchTermType) {
//   const [searchTerm, setSearchTerm] = useState<string>("");
const {medFormInputs, error, setError} = useContext(MedsContext)    
const {searchTerm, setSearchTerm, drugData} = props
    const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
   const {isMedForm, setIsMedForm, userDrugList, setUserDrugList} = useContext(MedsContext)
const handleChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
}

// give an option to add meds if meds are not found

useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        setShowResults(false);
        console.log(resultsRef, "RR")
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

//if the item that is being passed in matches the item from userDrug list, do not add
function handleClick(item: string) {
  //click on search item and add it to list
    console.log(item, "med click")
    const drugName = userDrugList.map(item => item.drugName)
    
    //prevents duplicate drugNames from being added to the list
    if(drugName.includes(item)) {
      setError(`${drugName} has already been added`)
      // alert(error)
      // return
    }
    else{
    setUserDrugList(prev => ([
        ...prev,
       { 
        drugName: item,
        // show input values
        showInputValues: false,
        howManyTimes: ""
        // dosage: "put dose here",
        // timeToTake: medFormInputs.timeToTake
        }

    ]))
    }
    setShowResults(false)
}

useEffect(() => {
  if(error) {
    alert(error)
  }
},[error])

console.log(userDrugList, "drug list")

console.log(searchTerm, "text")
console.log(drugData, "DD")
//if search term is true then return that data(input value and indicat. + use)
// if(searchTerm)

function medFormToggle() {
  setIsMedForm(prev => !prev)
}

  return (
    <Container maxWidth="md" sx={{ mt: 20 }}>
      <TextField
        id="search"
        type="search"
        label="Search Drug Name"
        value={searchTerm}
        onChange={handleChange}
        onFocus={() => setShowResults(true)}
        sx={{ width: 600 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      {
        drugData && drugData.length > 0 && searchTerm.length > 0  && showResults?

            <Card
                sx={{ width: 600 }}
                ref={resultsRef}
            >
                {/* every item should be clickable
                    when clicked add item to an array(state)
                */}
                {drugData.map((item, index) => (
                <Typography
                    key={index}
                    onClick={() => handleClick(item)}
                >{item}</Typography>
                ))}

            </Card>
            :
            null
      }
      {
        isMedForm ?
        <>
      <p>Can't find your medication? Click
        <span 
         onClick={medFormToggle}
         style={{color: "blue", cursor: "pointer"}}
        > here
        </span> to close form.
        </p>
        
        <AddMedsForm />
        </>
        :
        <p>Can't find your medication? Click
        <span 
         onClick={medFormToggle}
         style={{color: "blue", cursor: "pointer"}}
        > 
        {" "}
        here
        {" "}
        </span> to manually add medication.
        </p>
      }

    </Container>
  );
}