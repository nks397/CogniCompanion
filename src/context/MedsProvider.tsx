//add/move state and crud functions here

import { useState, useEffect, createContext, ReactNode } from "react"
// import { setDoc, doc, query, collection, onSnapshot } from "firebase/firestore"
// import { signInWithPopup, signOut, GoogleAuthProvider, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, User } from "firebase/auth";
// import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
// import {db, auth, storage} from "../firebaseConfig.ts"

export const MedsContext = createContext<any>(null)

interface MedsProviderProps {
    // ReactNode is indicating that the component can accept any valid React node as its children
    children: ReactNode
}

interface FormInputs {
    genericName: string,
    dosage: string,
    brandName: string,
   
}

// interface UserDocument {
//     id: string,
//     email: string,
//     displayName: string,
//     photoURL?: string
//     // Add any additional properties based on your user document structure
//   }

export default function MedsProvider(props: MedsProviderProps) {
    
    // const provider = new GoogleAuthProvider();
    
    const initInputs: FormInputs = {
        drugName: "",
        dosage: "",
        // timeToTake: ""
        // genericName: "",
        // dosage: "",
        // brandName: "",
    }
    
    // const [currentUser, setCurrentUser] = useState<User | null>(null)
    // const [pending, setPending] = useState<boolean>(true)
     const [medFormInputs, setMedFormInputs] = useState<FormInputs>(initInputs)
     const [userDrugList, setUserDrugList] = useState([])
     const [times, setTimes] = useState(0);
     const [selectedOption, setSelectedOption] = useState("");
    const [error, setError] = useState("")
     // const [errMsg, setErrMsg] = useState<string | null>(null)
    // const [allUsers, setAllUsers] = useState<UserDocument[]>([])
    // const [isAuthToggled, setIsAuthToggled] = useState<boolean>(false)
    // const [isPasswordForgotten, setIsPasswordForgotten] = useState<boolean>(false)
    // const [image, setImage] = useState<File | null>(null)
    // const [open, setOpen] = useState<boolean>(false)  
    // const [photoURL, setPhotoURL] = useState<string | null>(null) //use current user state instead
    // const [showPassword, setShowPassword] = useState<boolean>(false)
    // const [showReEnterPassword, setShowReEnterPassword] = useState<boolean>(false)
    // const capitalizedUsername = authInputs.username.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())
    const [isMedForm, setIsMedForm] = useState(false)
    
    function medHandleChange(e) {
        const {name, value} = e.target
        setMedFormInputs(prev => ({
            ...prev,
            [name]: value
        }))
    }

    function handleTimesChange(event) {
        setTimes(event.target.value);
      };
    
      function handleOptionChange(event) {
        setSelectedOption(event.target.value);
      };

      const initDays = [
        {id: 1, day: "Sunday", checked: false},
        {id: 2, day: "Monday", checked: false},
        {id: 3, day: "Tuesday", checked: false},
        {id: 4, day: "Wednesday", checked: false},
        {id: 5, day: "Thursday", checked: false},
        {id: 6, day: "Friday", checked: false},
        {id: 7, day: "Saturday", checked: false}
      ]

      const [days, setDays] = useState(initDays)
    const [remindedTimes, setRemindedTimes] = useState([])

    function formatTimeTo12Hour(time) {
      const [hours, minutes] = time.split(":");
      let formattedTime = "";
    
      // Convert hours to a number
      // specifying a radix of 10, parseInt ensures that the string is interpreted as a decimal number regardlesss of leading zeros
      const parsedHours = parseInt(hours, 10);
    
      // Determine if it's AM or PM
      const period = parsedHours >= 12 ? "PM" : "AM";
    
      // Convert hours to 12-hour format
      const formattedHours = parsedHours % 12 || 12;
    
      // Construct the formatted time string
      formattedTime = `${formattedHours}:${minutes} ${period}`;
    
      return formattedTime;
    }

    const handleAddTime = () => {
        // setRemindedTimes([...remindedTimes, ""]);
        setRemindedTimes([...remindedTimes, { day: [], time: '' }]);
      };
    
      function handleTimeChange(event: ChangeEvent<HTMLInputElement>, index, nameOfDay) {
      const { name, checked, value } = event.target;

      setRemindedTimes((prev) => {
        //makes a copy of reminded times to ensure we are working with a new array and not mutating state
        const updatedTimes = [...prev];
        //this is allowing us to modify the specific object at this index
        const updatedTime = { ...updatedTimes[index] };
        
        //if true, the event is triggered by the time input element
        if (name === "time") {
          //value of the time input is assigned to the time property in the remindedTimes state
          updatedTime.time = value;

          //the event is triggered by one of the checkboxes for the days of the week
        } else {

          const updatedDay = [...updatedTime.day];
    
          //if checked the name of the day is pushed to the updatedDay array
          if (checked) {
            updatedDay.push(nameOfDay);

            //if unchecked, the name of the day is found in the updatedDay array and removed
          } else {
            const dayIndex = updatedDay.indexOf(nameOfDay);
            if (dayIndex !== -1) {
              updatedDay.splice(dayIndex, 1);
            }
          }
           // sort the days array in the natural order(ascending order) of the week
            updatedDay.sort((a, b) => {
              const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
              console.log("sort a:", a, "b:", b)
              return daysOfWeek.indexOf(a) - daysOfWeek.indexOf(b);
            });


            updatedTime.day = updatedDay;

          //updatedDay array is assigned back to updatedTime.day to update the days array
          updatedTime.day = updatedDay;
        }
        //updatedTime object is assigned back to the updatedTimes[index] position in updatedTimes array
        updatedTimes[index] = updatedTime;
        
        //return updatedTimes to update the state
        return updatedTimes;
      });
       
      };
      
    console.log(remindedTimes, "RT")  
    
    //   const handleTimeChange = (e) => {
    //     // const updatedTimes = [...times];
    //     // updatedTimes[index] = value;
    //     // setRemindedTimes(updatedTimes);
    //     const {name, value} = e.target
    //     setReminderInputs(prev => ({
    //         ...prev,
    //         [name]: value
    //     }))
    //   };
      

      function removeTime() {
        setRemindedTimes(prev => 
            prev.slice(0, prev.length - 1) 
        )
      }
   

    return(
        <MedsContext.Provider
            value={{
               isMedForm,
               setIsMedForm,
               medFormInputs,
               medHandleChange,
               userDrugList,
               setUserDrugList,
               handleOptionChange,
               handleTimesChange,
               times,
               setTimes,
               selectedOption,
               days,
               setDays,
               remindedTimes,
               handleAddTime,
               handleTimeChange,
               removeTime,
               formatTimeTo12Hour,
              error,
              setError
            }}
        >
            {props.children}
        </MedsContext.Provider>
    )
}