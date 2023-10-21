import { auth } from '../../firebaseSetup' // adjust the path according to your project structure
import { firestore } from '../../firebaseSetup' // adjust the path according to your project structure
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { useState } from 'react'
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    GithubAuthProvider,
    TwitterAuthProvider
} from 'firebase/auth'
import { TextField, Typography, Grid, Divider } from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google'
import GitHubIcon from '@mui/icons-material/GitHub'
import TwitterIcon from '@mui/icons-material/Twitter'
import { useTheme } from '@mui/material/styles'
import { StyledButton } from 'ui-component/button/StyledButton'
import MainCard from 'ui-component/cards/MainCard'
import { useSelector } from 'react-redux'

function LoginForm() {
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

    const handleOAuthSignIn = async (provider) => {
        try {
            const userCredential = await signInWithPopup(auth, provider)
            const userRef = doc(firestore, 'registrations', userCredential.user.uid)
            const userSnapshot = await getDoc(userRef)

            if (!userSnapshot.exists()) {
                let [firstName, ...lastNameParts] = (userCredential.user.displayName || '').split(' ')
                let lastName = lastNameParts.join(' ')

                await setDoc(userRef, {
                    emailAddress: userCredential.user.email,
                    firstName,
                    lastName,
                    subscriberEmail: userCredential.user.email
                })
            }
        } catch (err) {
            setError(err.message)
        }
    }

    const googleProvider = new GoogleAuthProvider()
    const githubProvider = new GithubAuthProvider()
    const twitterProvider = new TwitterAuthProvider()

    const handleSubmission = async (event) => {
        event.preventDefault()
        try {
            await signInWithEmailAndPassword(auth, email, password)
            // Once the user is logged in, you could do a redirect here
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                // If the user does not exist, attempt to create a new account
                try {
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password)

                    // Storing user details in Firestore for newly registered users
                    const userRef = doc(firestore, 'registrations', userCredential.user.uid)
                    const userSnapshot = await getDoc(userRef)

                    if (!userSnapshot.exists()) {
                        // Since we don't have first name and last name for email registrations (as of now),
                        // I'm leaving them blank. Modify this as needed.
                        await setDoc(userRef, {
                            emailAddress: userCredential.user.email,
                            subscriberEmail: userCredential.user.email
                        })
                    }
                } catch (error) {
                    setError(error.message)
                }
            } else {
                setError(error.message)
            }
        }
    }

    return (
        <MainCard sx={{ background: customization.isDarkMode ? theme.palette.common.black : '' }}>
            <Typography variant='h4' align='center'>
                Log In / Register
            </Typography>
            <form onSubmit={handleSubmission}>
                <TextField fullWidth margin='normal' label='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <TextField
                    fullWidth
                    margin='normal'
                    label='Password'
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Grid container justifyContent='center' spacing={2}>
                    <Grid item xs={12} sm={3}>
                        <StyledButton variant='contained' sx={{ color: 'white', width: '100%' }} type='submit'>
                            Log In / Register
                        </StyledButton>
                    </Grid>
                </Grid>
                {error && <p>{error}</p>}
            </form>
            <Divider sx={{ my: 2 }}>Or</Divider>
            <Grid container justifyContent='center' spacing={2}>
                <Grid item xs={12} sm={3}>
                    <StyledButton
                        variant='contained'
                        sx={{ color: 'white', backgroundColor: '#db4437', width: '100%' }}
                        startIcon={<GoogleIcon />}
                        onClick={() => handleOAuthSignIn(googleProvider)}
                    >
                        Sign in with Google
                    </StyledButton>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <StyledButton
                        variant='contained'
                        sx={{ color: 'white', backgroundColor: '#24292e', width: '100%' }}
                        startIcon={<GitHubIcon />}
                        onClick={() => handleOAuthSignIn(githubProvider)}
                    >
                        Sign in with GitHub
                    </StyledButton>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <StyledButton
                        variant='contained'
                        sx={{ color: 'white', backgroundColor: '#1DA1F2', width: '100%' }} // Twitter color
                        startIcon={<TwitterIcon />}
                        onClick={() => handleOAuthSignIn(twitterProvider)}
                    >
                        Sign in with Twitter
                    </StyledButton>
                </Grid>
            </Grid>
        </MainCard>
    )
}

export default LoginForm
