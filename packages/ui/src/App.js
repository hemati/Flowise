import React, { useEffect, useState } from 'react'
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
import useApi from './hooks/useApi'
import chatflowsApi from './api/chatflows'
// ==============================|| APP ||============================== //

const App = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const customization = useSelector((state) => state.customization)
    const isAuthenticated = useSelector((state) => state.authentication.isAuthenticated)
    // Add loading state
    const [loading, setLoading] = useState(true)
    const getAllChatflowsApi = useApi(chatflowsApi.getAllChatflows)

    useEffect(() => {
        if (isAuthenticated) {
            getAllChatflowsApi.request()
        }
    }, [isAuthenticated])

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            dispatch(setAuthenticated(!!user))
            if (user) {
                localStorage.setItem('userid', user.uid)
                localStorage.setItem('username', user.displayName ?? user.email)
                if (getAllChatflowsApi.data) {
                    navigate('/chatflows')
                } else {
                    navigate('/marketplaces')
                }
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
        return <div>Loading...</div>
    }
    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={themes(customization)}>
                <CssBaseline />
                <NavigationScroll>
                    <Routes />
                </NavigationScroll>
            </ThemeProvider>
        </StyledEngineProvider>
    )
}

export default App
