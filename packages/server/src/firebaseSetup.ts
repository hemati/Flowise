import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: 'AIzaSyA1I5HapCo9wqV2sF6ZDXmNtrbZ_8gOKSY',
    authDomain: 'flowtwice-3336e.firebaseapp.com',
    projectId: 'flowtwice-3336e',
    storageBucket: 'flowtwice-3336e.appspot.com',
    messagingSenderId: '6014580900',
    appId: '1:6014580900:web:43439ee80625740ef14e31',
    measurementId: 'G-RJXVX78LLH'
} //this is where your firebase app values you copied will go

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export default app
