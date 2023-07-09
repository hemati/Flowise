import { auth } from '../../firebaseSetup' // adjust the path according to your project structure
import { useState } from 'react'
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    GithubAuthProvider
} from 'firebase/auth'
import { TextField, Typography, Grid, Divider } from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google'
import GitHubIcon from '@mui/icons-material/GitHub'
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
                <StyledButton variant='contained' sx={{ color: 'white' }} type='submit'>
                    Log In / Register
                </StyledButton>
                {error && <p>{error}</p>}
            </form>
            <Divider sx={{ my: 2 }}>Or</Divider>
            <Grid container justifyContent='center' spacing={2}>
                <Grid item>
                    <StyledButton
                        variant='contained'
                        sx={{ color: 'white', backgroundColor: '#db4437' }}
                        startIcon={<GoogleIcon />}
                        onClick={handleGoogleSignIn}
                    >
                        Sign in with Google
                    </StyledButton>
                </Grid>
                <Grid item>
                    <StyledButton
                        variant='contained'
                        sx={{ color: 'white', backgroundColor: '#24292e' }}
                        startIcon={<GitHubIcon />}
                        onClick={handleGithubSignIn}
                    >
                        Sign in with GitHub
                    </StyledButton>
                </Grid>
            </Grid>
        </MainCard>
    )
}

export default LoginForm
