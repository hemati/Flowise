import { combineReducers } from 'redux'

// reducer import
import customizationReducer from './reducers/customizationReducer'
import canvasReducer from './reducers/canvasReducer'
import notifierReducer from './reducers/notifierReducer'
import dialogReducer from './reducers/dialogReducer'
import authenticationReducer from './reducers/authenticationReducer'
import premiumReducer from './reducers/premiumReducer'
import checkoutReducer from './reducers/checkoutReducer'

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
    customization: customizationReducer,
    canvas: canvasReducer,
    notifier: notifierReducer,
    dialog: dialogReducer,
    authentication: authenticationReducer,
    checkout: checkoutReducer,
    premium: premiumReducer
})

export default reducer
