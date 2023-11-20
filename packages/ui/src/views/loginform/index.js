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
    TwitterAuthProvider,
    FacebookAuthProvider
} from 'firebase/auth'
import { TextField, Typography, Grid, Divider } from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google'
import GitHubIcon from '@mui/icons-material/GitHub'
import TwitterIcon from '@mui/icons-material/Twitter'
import FacebookIcon from '@mui/icons-material/Facebook'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'

import { useTheme } from '@mui/material/styles'
import { StyledButton } from 'ui-component/button/StyledButton'
import SimpleHub from '../simplehub'
import logoPath from '../../assets/images/logo.png'

const styles = {
    buttonBase: {
        width: '100%',
        padding: '10px',
        marginTop: 16,
        cursor: 'pointer',
        maxWidth: '308px',
        backgroundColor: '#374151',
        color: 'white'
    },
    dividerContainer: {
        paddingTop: 24,
        paddingBottom: 16,
        maxWidth: '324px',
        color: '#eaf2f7'
    },
    mainContainer: {
        display: 'flex',
        flexDirection: 'row',
        margin: 0
    },
    sideContainer: {
        flex: '2',
        backgroundColor: '#EEEEEE',
        padding: 24
    }
}

function LoginForm() {
    const theme = useTheme()
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))

    const formContainerStyles = {
        flex: '1',
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#13192b',
        ...(!isSmallScreen
            ? {
                  top: 0,
                  position: 'sticky',
                  height: '100vh'
              }
            : {})
    }
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
    const facebookProvider = new FacebookAuthProvider()

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
        <Box display='flex' flexDirection={{ xs: 'column', md: 'row' }} margin={0}>
            <div style={formContainerStyles}>
                <div style={{ width: 308 }}>
                    <img src={logoPath} alt='LangFlux.Space' style={{ width: 48, height: 48 }} />
                    <Typography variant='body1' align='left' style={{ color: '#eaf2f7' }}>
                        Sign in /<br /> Sign up for <span style={{ fontWeight: 'bold' }}>free</span>
                    </Typography>
                </div>
                <StyledButton style={{ ...styles.buttonBase }} onClick={() => handleOAuthSignIn(googleProvider)}>
                    <GoogleIcon style={{ marginRight: 8, color: '#db4437' }} /> with Google
                </StyledButton>
                <StyledButton style={{ ...styles.buttonBase }} onClick={() => handleOAuthSignIn(facebookProvider)}>
                    <FacebookIcon style={{ marginRight: 8, color: '#3b5998' }} /> with Facebook
                </StyledButton>
                <StyledButton style={{ ...styles.buttonBase }} onClick={() => handleOAuthSignIn(githubProvider)}>
                    <GitHubIcon style={{ marginRight: 8, color: 'white' }} /> with GitHub
                </StyledButton>
                <StyledButton style={{ ...styles.buttonBase }} onClick={() => handleOAuthSignIn(twitterProvider)}>
                    <TwitterIcon style={{ marginRight: 8, color: '#1DA1F2' }} /> with Twitter
                </StyledButton>
                <Grid container alignItems='center' spacing={3} style={styles.dividerContainer}>
                    <Grid item xs>
                        <Divider />
                    </Grid>
                    <Grid item>
                        <Typography variant='caption' component='span' color='textSecondary'>
                            Or
                        </Typography>
                    </Grid>
                    <Grid item xs>
                        <Divider />
                    </Grid>
                </Grid>
                <form onSubmit={handleSubmission} style={{ width: '100%', maxWidth: '308px' }}>
                    <TextField fullWidth margin='normal' label='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                    <TextField
                        fullWidth
                        margin='normal'
                        label='Password'
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <StyledButton style={{ ...styles.buttonBase }} type='submit'>
                        Continue with Email
                    </StyledButton>
                    {error && <p>{error}</p>}
                </form>
            </div>
            <div style={styles.sideContainer}>
                <div style={{ marginBottom: 24 }}>
                    <Typography variant='h2' gutterBottom>
                        Hub
                    </Typography>
                    <Typography variant='body1' color='textSecondary'>
                        Explore our handpicked examples or create your own tailor-made solution. Begin your journey today, and start for
                        free! See the examples below. Register to get started!
                    </Typography>
                </div>
                <SimpleHub />
            </div>
        </Box>
    )
}

export default LoginForm
