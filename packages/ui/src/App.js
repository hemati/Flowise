import { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline, StyledEngineProvider } from '@mui/material'

// routing
import Routes from 'routes'

// defaultTheme
import themes from 'themes'

// project imports
import NavigationScroll from 'layout/NavigationScroll'

import { onAuthStateChanged } from 'firebase/auth'
import { auth } from 'firebaseSetup'
import { setAuthenticated } from './store/actions' // make sure path is correct
import { useNavigate } from 'react-router-dom'
import 'intro.js/introjs.css'
import { Steps, Hints } from 'intro.js-react'

// ==============================|| APP ||============================== //

const App = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const customization = useSelector((state) => state.customization)
    const isAuthenticated = useSelector((state) => state.authentication.isAuthenticated)
    // Add loading state
    const [loading, setLoading] = useState(true)

    // Define the ref for intro.js
    console.log('test')

    // Define your steps here. This is just an example.
    const introSteps = [
        {
            intro: 'Welcome to our app!'
        },
        {
            element: '#chatflowsitem',
            intro: 'This is a tooltip.'
        }
        // ... add more steps as required
    ]

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            dispatch(setAuthenticated(!!user))
            if (user) {
                localStorage.setItem('userid', user.uid)
                localStorage.setItem('username', user.displayName ?? user.email)
                navigate('/marketplaces')
            } else {
                localStorage.removeItem('userid')
                localStorage.removeItem('username')
            }
            setLoading(false)
        })

        return () => unsubscribe()
    }, [dispatch])

    useEffect(() => {
        if (!isAuthenticated && !loading) {
            navigate('/login')
        }
    }, [isAuthenticated, navigate, loading])
    if (loading) {
        // Replace with a proper loading spinner or placeholder
        console.log('test', 'Testttt')
        return <div>Loading...</div>
    }
    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={themes(customization)}>
                <CssBaseline />
                <Steps enabled={true} steps={introSteps} initialStep={0} onExit={() => console.log('Exit')} />
                {/* Add the Intro component and bind the ref and steps */}
                <NavigationScroll>
                    <Routes />
                </NavigationScroll>
            </ThemeProvider>
        </StyledEngineProvider>
    )
}

export default App
