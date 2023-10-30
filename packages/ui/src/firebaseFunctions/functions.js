import { query, collection, orderBy, getDocs } from 'firebase/firestore'
import { firestore } from '../firebaseSetup'
import { setPremium } from '../store/actions'

export const fetchPremiumStatus = (userId) => {
    return async (dispatch) => {
        try {
            const q = query(
                collection(firestore, `registrations/${userId}/subscriptions`),
                orderBy('canceled_at', 'desc') // Assuming you have a timestamp field for each subscription
            )

            const querySnapshot = await getDocs(q)
            let userIsPremium = false

            querySnapshot.forEach((doc) => {
                if (doc.data().status === 'active') {
                    userIsPremium = true
                }
            })

            dispatch(setPremium(userIsPremium))
        } catch (error) {
            console.error('Error fetching subscription status: ', error)
        }
    }
}
