// action - state management
import { SET_AUTHENTICATED } from '../actions'

export const initialState = {
    isAuthenticated: false
}

// ==============================|| AUTH REDUCER ||============================== //

const authenticationReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_AUTHENTICATED:
            return {
                ...state,
                isAuthenticated: action.payload
            }
        default:
            return state
    }
}

export default authenticationReducer
