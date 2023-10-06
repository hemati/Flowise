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
import $ from 'jquery'

function findClosestDivWithClassByText(text, className) {
    return $(`p:contains("${text}")`).closest(`div.${className}`)[0]
}
// ==============================|| APP ||============================== //

const App = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const customization = useSelector((state) => state.customization)
    const isAuthenticated = useSelector((state) => state.authentication.isAuthenticated)
    // Add loading state
    const [loading, setLoading] = useState(true)
    const [isTourActive, setTourActive] = useState(false)

    // Define the ref for intro.js
    console.log('test')
    const targetElement = findClosestDivWithClassByText('Simple Conversation Chain', 'MuiPaper-root')
    if (targetElement) {
        targetElement.setAttribute('id', 'simpleConversationChainFlowItem')
    }
    // Define your steps here. This is just an example.
    const introSteps = [
        {
            intro: 'Welcome to our app!'
        },
        {
            element: '#chatflowsitem',
            intro: 'This is a tooltip.'
        },
        {
            element: '#marketplaces',
            intro: 'This is a tooltip.'
        },
        {
            element: '#tools',
            intro: 'This is a tooltip.'
        },
        {
            element: '#docs',
            intro: 'This is a tooltip.'
        },
        {
            element: '#simpleConversationChainFlowItem',
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
    useEffect(() => {
        const tooltipShown = localStorage.getItem('tooltipShown')
        // eslint-disable-next-line no-constant-condition
        if ((!tooltipShown && isAuthenticated) || true) {
            const tourStartTimeout = setTimeout(() => {
                // Assuming you have a state to control whether the tour is shown or not
                // setTourEnabled(true);  // For this example, I'm assuming such a state exists.
                setTourActive(true)
            }, 1000) // Delay of 1 second
            return () => clearTimeout(tourStartTimeout)
        }
    }, [isAuthenticated]) // Empty dependency array means this useEffect will run once after the component mounts
    const handleTourExit = () => {
        console.log('complete')
        // Set the flag in localStorage when the tour is exited
        localStorage.setItem('tooltipShown', 'true')
    }
    if (loading) {
        // Replace with a proper loading spinner or placeholder
        console.log('test', 'Testttt')
        return <div>Loading...</div>
    }

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={themes(customization)}>
                <CssBaseline />
                <Steps
                    enabled={isTourActive}
                    steps={introSteps}
                    initialStep={0}
                    onComplete={handleTourExit}
                    options={{
                        hideNext: false,
                        exitOnOverlayClick: false, // Prevents closing the tour by clicking on the overlay
                        exitOnEsc: false, // Prevents closing the tour using the Esc key
                        showSkip: false, // Hides the "Skip" button
                        disableInteraction: true,
                        skipLabel: ''
                    }}
                    onExit={() => console.log('exit')}
                />
                {/* Add the Intro component and bind the ref and steps */}
                <NavigationScroll>
                    <Routes />
                </NavigationScroll>
            </ThemeProvider>
        </StyledEngineProvider>
    )
}

export default App
