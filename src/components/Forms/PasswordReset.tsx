
import { ChangeEvent, FormEvent, useState, useContext } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { confirmThePasswordReset } from "../../firebase/firebase"
import { TextField, Button, Typography, Container} from '@mui/material'
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import { UserContext } from "../../context/UserProvider"
import { InputAdornment, IconButton } from '@mui/material';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

interface DefaultFormFields {
    password: string,
    confirmPassword: string
}

const defaultFormFields: DefaultFormFields = {
  password: "",
  confirmPassword: "",
}

export default function PasswordReset() {
  /**
   * Extract oobCode from the URL.
   * Delete console.log in production.
   */
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [successMessage, setSuccessMessage] = useState<boolean>(false)
  const [formFields, setFormFields] = useState(defaultFormFields)
  const { password, confirmPassword } = formFields

  const { 
    showPassword,
    handleClickShowPassword,
} = useContext(UserContext)

  let oobCode:string | null = searchParams.get("oobCode")
  
  async function resetFormFields() {
    return (
      setFormFields(defaultFormFields)
    )
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    
    if (password !== confirmPassword) {
      alert("Passwords did not match.")
      return;
    }

    try {
      if (oobCode) {
        await confirmThePasswordReset(oobCode, confirmPassword)
        resetFormFields()
        setSuccessMessage(true)
      } else {
        alert("Something is wrong; try again later!")
        console.log("missing oobCode")
      }
    } catch (error:any) {
      if (error.code === "auth/invalid-action-code") {
        alert("Something is wrong; try again later.")
      }
      console.log(error.message)        
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormFields({...formFields, [name]: value })
  }

  return(
    <div>
      {
        successMessage ?
        <Container>
          <Typography>Success! Your Password change successfully</Typography>
          <Button 
            onClick={() => navigate('/registration')}
          >
            Go to the Login page
          </Button>
        </Container> :
         <Grid2  component="div" xs={12}>
         {/* maybe implement autocomplete for passwords */}
         <TextField 
             type={showPassword ? "text" : "password"}
             name="password"
             label="Password" 
             value={password} 
             onChange={handleChange} 
             fullWidth 
             required
             InputProps={{
                 endAdornment: (
                   <InputAdornment position="start" >
                     <IconButton
                         aria-label="toggle password visibility"
                         onClick={handleClickShowPassword}
                     >
                         {showPassword ? <Visibility /> : <VisibilityOff />}
                         {/* <EmojiEmotionsIcon  onClick={() => setShowPicker(true)}/> */}
                     </IconButton>
                   </InputAdornment>
                 )
             }}
         />
         <TextField 
             type={showPassword ? "text" : "password"}
             name="confirmPassword"
             label="confirmPassword" 
             value={confirmPassword} 
             onChange={handleChange} 
             fullWidth 
             required
             InputProps={{
                 endAdornment: (
                   <InputAdornment position="start" >
                     <IconButton
                         aria-label="toggle password visibility"
                         onClick={handleClickShowPassword}
                     >
                         {showPassword ? <Visibility /> : <VisibilityOff />}
                         {/* <EmojiEmotionsIcon  onClick={() => setShowPicker(true)}/> */}
                     </IconButton>
                   </InputAdornment>
                 )
             }}
         />
        <Button onClick={handleSubmit}>Submit</Button>
         </Grid2>
        
      }
    </div>
  )
}
