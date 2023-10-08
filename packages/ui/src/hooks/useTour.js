import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

const useTour = () => {
    const dispatch = useDispatch()
    const location = useLocation()
    const isAuthenticated = useSelector((state) => state.authentication.isAuthenticated)
    const [isTourActive, setTourActive] = useState(false)
    const [isCanvasTourActive, setCanvasTourActive] = useState(false)

    const handleTourExit = () => {
        localStorage.setItem('tooltipShown', 'true')
        setTourActive(false)
    }

    const handleTourExitCanvas = () => {
        localStorage.setItem('tooltipCanvasShown', 'true')
        setCanvasTourActive(false)
    }

    useEffect(() => {
        const pathSegments = location.pathname.split('/').filter(Boolean)
        const tooltipShown = localStorage.getItem('tooltipShown')
        const tooltipCanvasShown = localStorage.getItem('tooltipCanvasShown')
        if (!tooltipShown && isAuthenticated && pathSegments[pathSegments.length - 1] === 'marketplaces') {
            const tourStartTimeout = setTimeout(() => {
                dispatch({ type: 'SET_MENU', opened: true })
                setTourActive(true)
            }, 2000)
            return () => clearTimeout(tourStartTimeout)
        } else {
            setTourActive(false)
        }
        if (!tooltipCanvasShown && pathSegments[pathSegments.length - 1] === 'canvas') {
            const checkForElement = () => document.querySelector('#chat_button')
            const intervalId = setInterval(() => {
                if (checkForElement()) {
                    setCanvasTourActive(true)
                    clearInterval(intervalId)
                }
            }, 500)
            return () => clearInterval(intervalId)
        } else {
            setCanvasTourActive(false)
        }
    }, [isAuthenticated, location.pathname, dispatch])

    return {
        isTourActive,
        isCanvasTourActive,
        handleTourExit,
        handleTourExitCanvas
    }
}

export default useTour
