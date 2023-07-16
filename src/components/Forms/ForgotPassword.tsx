import { FormEvent, useState } from "react";
import { passwordReset } from "../../firebase/firebase";
import { TextField, Button, Typography, Container } from '@mui/material'
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [emailMessage, setEmailMessage] = useState<boolean>(false)
 

  const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await passwordReset(email);
      setEmailMessage(true);
    } catch (error:any) {    
      if (error.code === 'auth/user-not-found') {
        alert('User not found, try again!')
        setEmail('')
      }
    }
  };
  
  return (
    <Container>
      {
        emailMessage ?
        <Typography>The Email has been sent; Check your Inbox!</Typography> 
        : 
          <Grid2 component="div" xs={12}>
                <TextField 
                    type="email" 
                    name="email" 
                    label="email@example.com"
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth 
                    required
                />
            <Button type="submit" fullWidth variant="contained" onClick={handleSubmit}>
                Reset Your Password
            </Button>
            </Grid2>
      }
    </Container>
  )
}