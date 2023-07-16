import {useContext} from "react"
import { MedsContext } from "../../context/MedsProvider"
import {
    // Box,
    Typography,
    Container,
    FormControl,
    FormLabel,
    Button,
    TextField
  } from "@mui/material";

export default function AddMedsForm() {
    const {setIsMedForm, medFormInputs, medHandleChange} = useContext(MedsContext)
    const {userDrugList, setUserDrugList} = useContext(MedsContext)

    function addMedsToList() {
        setUserDrugList(prev => ([
            //add created search item to list
            ...prev,
           { 
            drugName: `${medFormInputs.dosage} [${medFormInputs.drugName}]`,
            showInput: false,
            howManyTimes: ""
            
            // drugName: `${medFormInputs.generic} ${medFormInputs.dosage} [${medFormInputs.brandName}]`,
            // dosage: "put dose here",
            // timeToTake: medFormInputs.timeToTake
            }
    
        ]))
    }

    return (
        <Container>
            {/* Meds Form */}
            <FormControl>
                {/* <FormLabel>Enter Name</FormLabel> */}
                <TextField 
                    type="text"
                    name="drugName"
                    label="Name of Medication"
                    value={medFormInputs.drugName}
                    onChange={medHandleChange}
                    fullWidth
                    required
                />
               
                <TextField 
                    type="text"
                    name="dosage"
                    label="Dosage (ex: 25 MG)"
                    value={medFormInputs.dosage}
                    onChange={medHandleChange}
                    fullWidth
                    required
                />

                
           <Button onClick={addMedsToList}>Add Medication</Button> 
            {/* <Button onClick={() => setIsMedForm(false)}>Close Med Form</Button>  */}
            </FormControl>
            {/* name of med/generic/brand, amount/mg, oral/chewable/ tablet/ capsule??*/}
               

        </Container>
    )
}