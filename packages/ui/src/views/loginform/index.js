import { auth } from '../../firebaseSetup' // adjust the path according to your project structure
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
                    await createUserWithEmailAndPassword(auth, email, password)
                    // Once the user is registered, you could do a redirect here
                } catch (error) {
                    setError(error.message)
                }
            } else {
                setError(error.message)
            }
        }
    }

    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, googleProvider)
            // Once the user is logged in, you could do a redirect here
        } catch (error) {
            setError(error.message)
        }
    }

    const handleGithubSignIn = async () => {
        try {
            await signInWithPopup(auth, githubProvider)
            // Once the user is logged in, you could do a redirect here
        } catch (error) {
            setError(error.message)
        }
    }

    const handleTwitterSignIn = async () => {
        try {
            await signInWithPopup(auth, twitterProvider)
            // Once the user is logged in, you could do a redirect here
        } catch (error) {
            console.log(error)
            setError(error.message)
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
                        onClick={handleGoogleSignIn}
                    >
                        Sign in with Google
                    </StyledButton>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <StyledButton
                        variant='contained'
                        sx={{ color: 'white', backgroundColor: '#24292e', width: '100%' }}
                        startIcon={<GitHubIcon />}
                        onClick={handleGithubSignIn}
                    >
                        Sign in with GitHub
                    </StyledButton>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <StyledButton
                        variant='contained'
                        sx={{ color: 'white', backgroundColor: '#1DA1F2', width: '100%' }} // Twitter color
                        startIcon={<TwitterIcon />}
                        onClick={handleTwitterSignIn}
                    >
                        Sign in with Twitter
                    </StyledButton>
                </Grid>
            </Grid>
        </MainCard>
    )
}

export default LoginForm
