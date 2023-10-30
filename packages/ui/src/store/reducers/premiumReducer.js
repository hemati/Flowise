// action - state management
import { SET_PREMIUM } from '../actions'

export const initialState = {
    isPremium: false
}

// ==============================|| AUTH REDUCER ||============================== //

const premiumReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_PREMIUM:
            return {
                ...state,
                isPremium: action.payload
            }
        default:
            return state
    }
}

export default premiumReducer
