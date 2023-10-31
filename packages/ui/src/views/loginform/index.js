import { auth, firestore, analytics } from '../../firebaseSetup' // adjust the path according to your project structure
import { logEvent } from 'firebase/analytics'
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
import { useSelector } from 'react-redux'
import SimpleHub from '../simplehub'

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
                logEvent(analytics, 'registration_completed')

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
        <div style={{ display: 'flex', height: '100vh', margin: 0 }}>
            <div style={{ flex: '1', padding: '20px' }}>
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
                        <Grid item xs={12} sm={6}>
                            <StyledButton style={{ width: '100%', padding: '10px', marginTop: '20px', cursor: 'pointer' }}>
                                Log In / Register
                            </StyledButton>
                        </Grid>
                    </Grid>
                    {error && <p>{error}</p>}
                </form>
                <Divider sx={{ my: 2 }}>Or</Divider>
                <Grid container justifyContent='center' spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <StyledButton
                            style={{ backgroundColor: '#db4437', color: 'white', padding: '10px', width: '100%', cursor: 'pointer' }}
                            onClick={() => handleOAuthSignIn(googleProvider)}
                        >
                            <GoogleIcon /> Sign in with Google
                        </StyledButton>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <StyledButton
                            style={{ backgroundColor: '#24292e', color: 'white', padding: '10px', width: '100%', cursor: 'pointer' }}
                            onClick={() => handleOAuthSignIn(githubProvider)}
                        >
                            <GitHubIcon /> Sign in with GitHub
                        </StyledButton>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <StyledButton
                            style={{ backgroundColor: '#1DA1F2', color: 'white', padding: '10px', width: '100%', cursor: 'pointer' }}
                            onClick={() => handleOAuthSignIn(twitterProvider)}
                        >
                            <TwitterIcon /> Sign in with Twitter
                        </StyledButton>
                    </Grid>
                </Grid>
            </div>
            <div style={{ flex: '1', background: 'black' }}>
                <SimpleHub />
            </div>
        </div>
    )
}

export default LoginForm
