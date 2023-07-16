import { auth } from '../firebaseConfig';
import {
    // connectAuthEmulator,
    sendPasswordResetEmail,
    confirmPasswordReset
  } from 'firebase/auth';

//   if (process.env.NODE_ENV === 'development') {
//     connectAuthEmulator(auth, "http://localhost:9099");
//   }

  export const passwordReset = async (email: string) => {
    return await sendPasswordResetEmail(auth, email)
  }

  export const confirmThePasswordReset = async (
    oobCode:string, newPassword:string
  ) => {
    if(!oobCode && !newPassword) return;
    
    return await confirmPasswordReset(auth, oobCode, newPassword)
  }
  