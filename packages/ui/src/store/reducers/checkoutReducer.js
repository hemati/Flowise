import { TOGGLE_CHECKOUT_MODAL } from '../actions'

const initialState = {
    isCheckoutModalOpen: false
}

const checkoutReducer = (state = initialState, action) => {
    switch (action.type) {
        case TOGGLE_CHECKOUT_MODAL:
            return {
                ...state,
                isCheckoutModalOpen: !state.isCheckoutModalOpen
            }
        default:
            return state
    }
}

export default checkoutReducer
