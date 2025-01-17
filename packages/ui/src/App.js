import { useEffect, useState } from 'react'
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
import { SET_MENU, setAuthenticated, toggleCheckoutModal } from './store/actions' // make sure path is correct

import { useNavigate } from 'react-router-dom'
import 'intro.js/introjs.css'
import { Steps } from 'intro.js-react'
import useTour from './hooks/useTour'
import CheckoutModal from './views/checkout'
import LoginForm from './views/loginform'

import { fetchPremiumStatus } from 'firebaseFunctions/functions'

function findClosestDivWithClassByText(text, className) {
    // return $(`p:contains("${text}")`).closest(`div.${className}`)[0]
    // Find all <p> elements
    let pElements = document.querySelectorAll('p')

    // Filter elements that contain the specified text
    let filteredElements = Array.from(pElements).filter((p) => p.textContent.includes(text))

    // For each filtered <p> element, traverse up the DOM to find the closest div with the given class name
    for (let p of filteredElements) {
        let parentNode = p.parentElement

        while (parentNode) {
            if (parentNode.tagName === 'DIV' && parentNode.classList.contains(className)) {
                return parentNode // Return the first matching div found
            }
            parentNode = parentNode.parentElement
        }
    }

    return null // Return null if no matching div is found
}
// ==============================|| APP ||============================== //

const App = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const customization = useSelector((state) => state.customization)
    const isAuthenticated = useSelector((state) => state.authentication.isAuthenticated)
    const isCheckoutModalOpen = useSelector((state) => state.checkout.isCheckoutModalOpen)

    // Add loading state
    const [loading, setLoading] = useState(true)
    const { isTourActive, isCanvasTourActive, handleTourExit, handleTourExitCanvas } = useTour()
    const handleToggleCheckoutModal = () => {
        dispatch(toggleCheckoutModal())
    }

    // Define the ref for intro.js
    const targetElement = findClosestDivWithClassByText('Simple Llama Conversation Chain', 'MuiPaper-root')
    if (targetElement) {
        targetElement.setAttribute('id', 'simpleLlamaConversationChainFlowItem')
    }

    // Define your steps here. This is just an example.
    const introSteps = [
        {
            title: 'Welcome to LangFlux Dashboard!',
            intro:
                'Start building Language Model apps with LangFlux! Here, making and managing your LLM ' +
                'flows is easy and fast. Explore custom components and see your apps come to life swiftly. Your path ' +
                'to simple, effective LLM app creation begins here. Dive in!'
        },
        {
            element: '#chatflowsitem',
            intro:
                'Step into Chatflows, where your crafted flows come alive! ' +
                "This is your personal space to view, manage, and refine all the LLM flows you've saved."
        },
        {
            element: '#marketplaces',
            intro:
                'Enter the Hub, a repository of predefined flows. ' +
                'Here, explore a curated selection of expertly crafted flows, ready for integration into your projects.'
        },
        {
            element: '#tools',
            intro:
                'Step into Tools, your gateway to enhanced interactions! Here lies a suite of functions empowering ' +
                "your agents to engage with the world. Whether it's generic utilities like search, leveraging other" +
                " chains, or interacting with different agents, Tools is engineered to broaden your agents' capabilities."
        },
        {
            element: '#docs',
            intro:
                'Explore Docs, your repository of in-depth information. Here, access detailed documentation ' +
                'tailored to facilitate a thorough understanding of functionalities and features.'
        },
        {
            title: 'Community Support',
            element: '#discord',
            intro: 'Join our Discord community for help and ' + 'support. Our channel is new, but we aim to build a strong community. '
        },
        {
            title: 'Begin Your Exploration Now!',
            element: '#simpleLlamaConversationChainFlowItem',
            intro:
                'Kickstart your journey by utilizing a predefined Simple Conversation Chain from the Hub. This ' +
                'hands-on start will guide you through key platform features, enriching your understanding swiftly.\n' +
                'To start, click on the tile and then on "Use Tempalte".'
        }
        // ... add more steps as required
    ]
    const introCanvasSteps = [
        {
            title: 'Canvas Flow Editor!',
            intro:
                "Here's where your creative journey begins. You've chosen a flow template, and now it's time to bring" +
                ' it to life. Think of this canvas as your personal workspace, where each node represents a unique ' +
                'step or action in your flow.'
        },
        {
            element: '#add_node_button',
            title: 'Drag & Drop to Add Nodes',
            intro:
                'Simply drag your desired node from the palette and drop it onto the canvas. Each node is a building ' +
                'block for your workflow. Craft your flow effortlessly using drag and drop. '
        },
        {
            element: '.react-flow__node:first-of-type',
            title: 'Configuring Your Node',
            intro: 'Dive into the settings of each node to modify configurations and add the necessary credentials.'
        },
        {
            element: '#save_chatflow_button',
            title: 'Save to Update',
            intro:
                'Before moving on, remember to save your flow. Not only does this preserve your configurations, but ' +
                "it's crucial for updating the functionality. Ensure every change you make takes effect by hitting the save button."
        },
        {
            element: '#chat_button',
            title: 'Chat with Your Flow',
            intro:
                'All set! Now, to see your flow in action, just hit the "Chat" button. Dive into a conversation and ' +
                "experience firsthand the functionality you've designed. Enjoy the interactive chat with your custom flow! "
        },
        {
            title: 'Join Discord',
            intro:
                'Join our Discord community for help and ' +
                'support. Our channel is new, but we aim to build a strong community. ' +
                '<br>💬 <a href="https://discord.gg/PTb8rEGzGz" target="_blank" rel="noopener noreferrer">Join us on Discord!</a>'
        }
    ]

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            dispatch(setAuthenticated(!!user))
            if (user) {
                localStorage.setItem('userid', user.uid)
                localStorage.setItem('username', user.displayName ?? user.email)
                navigate('/marketplaces')
                dispatch(fetchPremiumStatus(user.uid))
            } else {
                localStorage.removeItem('userid')
                localStorage.removeItem('username')
            }
            setLoading(false)
        })

        return () => unsubscribe()
    }, [dispatch])
    if (loading) {
        // Replace with a proper loading spinner or placeholder
        return <div>Loading...</div>
    }

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={themes(customization)}>
                <CssBaseline />
                {!isAuthenticated ? (
                    <>
                        <LoginForm />
                    </>
                ) : (
                    <>
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
                            onChange={(step) => {
                                if (step === introSteps.length - 1 && window.innerWidth <= 900) {
                                    dispatch({ type: SET_MENU, opened: false })
                                }
                            }}
                        />
                        <Steps
                            enabled={isCanvasTourActive}
                            steps={introCanvasSteps}
                            initialStep={0}
                            onComplete={handleTourExitCanvas}
                            options={{
                                hideNext: false,
                                exitOnOverlayClick: false, // Prevents closing the tour by clicking on the overlay
                                exitOnEsc: false, // Prevents closing the tour using the Esc key
                                showSkip: false, // Hides the "Skip" button
                                disableInteraction: true,
                                skipLabel: ''
                            }}
                            onExit={() => console.log('exit canvas')}
                        />
                        <NavigationScroll>
                            <Routes />
                        </NavigationScroll>
                    </>
                )}
            </ThemeProvider>
            <CheckoutModal open={isCheckoutModalOpen} onClose={handleToggleCheckoutModal} />
        </StyledEngineProvider>
    )
}
export default App
