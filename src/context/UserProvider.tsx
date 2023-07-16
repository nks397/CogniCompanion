import { useState, useEffect, createContext, ReactNode } from "react"
import { setDoc, doc, query, collection, onSnapshot } from "firebase/firestore"
import { signInWithPopup, signOut, GoogleAuthProvider, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, User } from "firebase/auth";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import {db, auth, storage} from "../firebaseConfig.ts"

export const UserContext = createContext<any>(null)

interface UserProviderProps {
    // ReactNode is indicating that the component can accept any valid React node as its children
    children: ReactNode
}

interface AuthInputs {
    username: string,
    email: string,
    password: string,
    reEnterPassword: string,
    searchUsers: string
}

interface UserDocument {
    id: string,
    email: string,
    displayName: string,
    photoURL?: string
    // Add any additional properties based on your user document structure
  }

export default function UserProvider(props: UserProviderProps) {
    
    const provider = new GoogleAuthProvider();
    
    const initInputs: AuthInputs = {
        username: "",
        email: "",
        password: "",
        reEnterPassword: "",
        searchUsers: ""
    }
    
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [pending, setPending] = useState<boolean>(true)
    const [authInputs, setAuthInputs] = useState<AuthInputs>(initInputs)
    const [errMsg, setErrMsg] = useState<string | null>(null)
    const [allUsers, setAllUsers] = useState<UserDocument[]>([])
    const [isAuthToggled, setIsAuthToggled] = useState<boolean>(false)
    const [isPasswordForgotten, setIsPasswordForgotten] = useState<boolean>(false)
    const [image, setImage] = useState<File | null>(null)
    const [open, setOpen] = useState<boolean>(false)  
    const [photoURL, setPhotoURL] = useState<string | null>(null) //use current user state instead
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [showReEnterPassword, setShowReEnterPassword] = useState<boolean>(false)
    const capitalizedUsername = authInputs.username.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())
    
    useEffect(() => {
        onAuthStateChanged(auth, user => {
            setCurrentUser(user)
            setPending(false)
        })
        getUsers()
    },[])
    
    useEffect(() => {
        if(currentUser?.photoURL) {
            setPhotoURL(currentUser.photoURL)
        }
    },[currentUser, photoURL])
    
    if(pending) {
        return <>Loading...</>
    }
        
    function authHandleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const {name, value} = e.target
        console.log("is auth hit?")
        setAuthInputs(prevInput => ({
        ...prevInput,
        [name]:value
        }))
    }

    function togglePasswordForgotten() {
        setIsPasswordForgotten(prevToggle => !prevToggle) 
    }

    function toggleAuth() {
        setIsAuthToggled(prevToggle => !prevToggle)
        setAuthInputs(initInputs)
        setErrMsg("")
        setShowPassword(false)
        setShowReEnterPassword(false)
    }  

    function signUpWithEmail(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
      
        const userFound = allUsers.map(users => users.displayName.toLowerCase() === authInputs.username.toLowerCase())
        //if all are equal to false, this will return true
        const noUserFound = allUsers.every(users => users.displayName.toLowerCase().includes(authInputs.username.toLowerCase()) === false)

        if(authInputs.username === "" || authInputs.email === "" || authInputs.password === "" || authInputs.reEnterPassword === ""){
            setErrMsg("all fields are required")
        }
        if(authInputs.password.length < 6){
            setErrMsg("Password does not contain 6 or more characters.")
        }
        if(userFound.includes(true) && authInputs.username !== ""){
            setErrMsg("username already exists")
        }
        if(authInputs.password !== authInputs.reEnterPassword){
            setErrMsg("password and re-entered password does not match")
        }
        if(authInputs.password === authInputs.reEnterPassword && noUserFound) {
            setErrMsg("")
            createUserWithEmailAndPassword(auth, authInputs.email, authInputs.password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user

                if(!auth.currentUser) {
                    // If there is no current user, exit the function
                    return
                }

                //add display name value to user object
                updateProfile(auth.currentUser, {
                    displayName: capitalizedUsername,
                    photoURL: user.photoURL
                })
                
                //adds doc to firestore database
                setDoc(doc(db, "users", user.uid), {
                    email: user.email,
                    //uppercase first letters of words
                    displayName: capitalizedUsername,
                    photoURL: user.photoURL
                })
                
                setErrMsg("")
                // alert("Successful signUp!")
            })
            .catch((error) => {
                console.log(error, "error")
                const errorCode = error.code;
            
                setErrMsg(errorCode)
              
            })
        }  
    }
    console.log(errMsg, "errMsg test")
    
    function getUsers() {
        onAuthStateChanged(auth, () => {
            const q = query(collection(db, "users"))

            onSnapshot(q, (querySnapshot) => {
              let allUsersArr: UserDocument[] = []

              querySnapshot.forEach(doc => {
                // console.log(doc, "doc test")
                // allUsersArr.push({id: doc.id, ...doc.data()})
                const userDocument: UserDocument = {
                    id: doc.id,
                    // Omit excludes the id property from the type of doc.data(). This ensures that the spread operator does not override the id property that we set for the userDocument.
                    ...doc.data() as Omit<UserDocument, "id">,
                  }
          
                  allUsersArr.push(userDocument)
              })

              setAllUsers(allUsersArr)
              
            })
          })
    }

    function loginWithEmail(e: React.FormEvent<HTMLInputElement>) {
        e.preventDefault()

        signInWithEmailAndPassword(auth, authInputs.email, authInputs.password)
        .then((userCredential) => {
            // Signed in 
            setErrMsg("")

            const user = userCredential.user

            setCurrentUser(user)

            // alert("Successful login!")
        })
        .catch((error) => {
            console.log(error, "error")
            setErrMsg("username or password is incorrect")
        })
    }
    
    function signInWithGoogle() {
        signInWithPopup(auth, provider)
        .then(res => console.log(res, "res"))
      .catch(err => console.log(err, "err"))
    }
    
    function signOutOfAccount() {
        signOut(auth)
        .then(() => {
            console.log("signOut")
        })
        .catch(err => console.log(err, "signOut error"))
        setCurrentUser(null)
        setPhotoURL(null)
    }
    
    function createUserDocument() {
        //grabbing current user id
        onAuthStateChanged(auth, user => {
            if (user) {
                setDoc(doc(db, "users", user.uid), {
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL
                })
             
                setCurrentUser(user)
              
            } else {
                // User not logged in or has just logged out.
                if(!user) return;
            }
        })
    }

    function handleGoogleSubmit(e: React.FormEvent<HTMLInputElement>) {
        e.preventDefault()
        signInWithGoogle()
        createUserDocument()
    }

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        // checks if e.target.files exist and if it contains at least one element
        if(e.target.files && e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }

    function handleImageSubmit() {
        if(!currentUser) {
            //if there is no user, exit the current function
            return
        }

        if(!image) {
            //if there is no image, exit the current function
            return
        }
        
        const imageRef = ref(storage, currentUser.uid)

        uploadBytes(imageRef, image)
        .then(() => {
            getDownloadURL(imageRef)
            .then((url: string) => {
                setPhotoURL(url)
                updateProfile(currentUser, {photoURL: url})
                
                setDoc(doc(db, "users", currentUser.uid), 
                {
                    email: currentUser.email,
                    displayName: currentUser.displayName,
                    photoURL: url
                }
                )
            })
            .catch((error) => {
                console.log(error.message, "error getting the image url")
            })
        })
        .catch((error) => {
            console.log(error.message, "error uploading image")
        })
    }

    function onOpenModal() {
        setOpen(true)
      }
    
    function onCloseModal() {
        setOpen(false)
    }

    function handleClickShowPassword() {
        setShowPassword(prev => !prev)
    }

    function handleClickShowReEnterPassword() {
        setShowReEnterPassword(prev => !prev)
    }

    return(
        <UserContext.Provider
            value={{
                currentUser,
                signInWithGoogle,
                signOutOfAccount,
                loginWithEmail,
                createUserDocument,
                signUpWithEmail,
                authInputs,
                setAuthInputs,
                initInputs,
                authHandleChange,
                handleGoogleSubmit,
                errMsg,
                setErrMsg,
                getUsers,
                isAuthToggled,
                setIsAuthToggled,
                toggleAuth,
                isPasswordForgotten,
                setIsPasswordForgotten,
                togglePasswordForgotten,
                allUsers,
                handleImageChange,
                handleImageSubmit,
                onOpenModal,
                onCloseModal,
                open,
                photoURL,
                showPassword,
                setShowPassword,
                showReEnterPassword,
                setShowReEnterPassword,
                handleClickShowPassword,
                handleClickShowReEnterPassword
            }}
        >
            {props.children}
        </UserContext.Provider>
    )
}