import { useState } from 'react'
import Modal from '@mui/material/Modal'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import CloseIcon from '@mui/icons-material/Close'
import CheckCircle from '@mui/icons-material/CheckCircle'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import { collection, addDoc, onSnapshot } from 'firebase/firestore'
import { analytics, auth, firestore } from '../../firebaseSetup'
import PropTypes from 'prop-types'
import { logEvent } from 'firebase/analytics'

const CheckoutModal = ({ open, onClose }) => {
    const [loading, setLoading] = useState(false)

    const handleCheckout = async () => {
        setLoading(true)
        // Ensure you have a reference to the current user's UID here
        const currentUserUID = auth.currentUser ? auth.currentUser.uid : null

        if (!currentUserUID) {
            console.error('User is not authenticated!')
            return
        }
        logEvent(analytics, 'checkout_clicked')

        try {
            // Reference to the Firestore collection
            const checkoutSessionsCollection = collection(firestore, 'registrations', currentUserUID, 'checkout_sessions')

            // Add a new checkout session document (it will auto-generate an ID like .add() did)
            const docRef = await addDoc(checkoutSessionsCollection, {
                price: 'price_1O4pELGil3O4bErY1SdY2sOx',
                success_url: window.location.origin + '/success',
                cancel_url: window.location.origin + '/cancel'
            })

            // Listen to real-time changes on the document
            onSnapshot(docRef, (snap) => {
                const data = snap.data()
                console.log('Checkout session updated!', data)
                // Handle potential errors
                if (data && data.error) {
                    alert(`An error occurred: ${data.error.message}`)
                }
                // If a URL is provided, redirect the user
                if (data && data.url) {
                    window.location.assign(data.url)
                }
                logEvent(analytics, 'purchase')
            })
        } catch (error) {
            // Handle any errors that might occur during the Firestore operation
            console.error('Error during checkout:', error)
        }
    }

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    justifyContent: 'center',
                    height: '100vh',
                    overflowY: 'auto',
                    padding: {
                        xs: '1rem 0',
                        sm: '2rem 0',
                        md: '4rem 0'
                    }
                }}
            >
                <Card sx={{ width: '80%', maxWidth: 500, p: 3, boxShadow: '0 8px 40px -12px rgba(0,0,0,0.3)' }}>
                    <CardHeader
                        title={
                            <Typography variant='h5' component='div' fontWeight='bold'>
                                Upgrade to Premium
                            </Typography>
                        }
                        action={
                            <IconButton aria-label='close' onClick={onClose}>
                                <CloseIcon />
                            </IconButton>
                        }
                    />
                    <CardContent>
                        <Typography variant='body1' component='div' mb={3}>
                            You&apos;ve used up the free plan&apos;s limit with one flow. To get more flows and better features, think about
                            moving to our premium plan.
                        </Typography>
                        <Typography variant='body2' component='div' mb={3}>
                            <Box display='flex' alignItems='center' mb={2}>
                                <CheckCircle color='primary' sx={{ mr: 2 }} />
                                Ultimate access to all predefined flows
                            </Box>
                            <Box display='flex' alignItems='center' mb={2}>
                                <CheckCircle color='primary' sx={{ mr: 2 }} />
                                Access for all predefined tools.
                            </Box>
                            <Box display='flex' alignItems='center' mb={2}>
                                <CheckCircle color='primary' sx={{ mr: 2 }} />
                                Unlimited number of flows can be created
                            </Box>
                            <Box display='flex' alignItems='center' mb={2}>
                                <CheckCircle color='primary' sx={{ mr: 2 }} />
                                Premium support from our expert team
                            </Box>
                        </Typography>
                        <Typography variant='h6' component='div' sx={{ textDecoration: 'line-through', mt: 2, mb: 1 }}>
                            $9.99/month
                        </Typography>
                        <Typography variant='subtitle2' color='textSecondary' mb={3}>
                            First 7 days trial for FREE!
                        </Typography>
                        <Typography variant='subtitle2' color='textSecondary' mt={1}>
                            Flexible subscription: Cancel anytime.
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button fullWidth variant='contained' color='primary' onClick={handleCheckout} sx={{ mt: 3 }} disabled={loading}>
                            {loading ? <CircularProgress size={24} color='inherit' /> : 'Checkout with Stripe'}
                        </Button>
                    </CardActions>
                </Card>
            </Box>
        </Modal>
    )
}

CheckoutModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
}

export default CheckoutModal
