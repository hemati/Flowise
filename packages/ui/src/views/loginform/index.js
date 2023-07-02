import { auth } from '../../firebaseSetup' // adjust the path according to your project structure
import { useState } from 'react'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'

function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            await signInWithEmailAndPassword(auth, email, password)
            // Once the user is logged in, you could do a redirect here
        } catch (error) {
            setError(error.message)
        }
    }

    const handleRegistration = async (event) => {
        event.preventDefault()
        try {
            await createUserWithEmailAndPassword(auth, email, password)
            // Once the user is registered, you could do a redirect here
        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type='text' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type='submit'>Log In</button>
                {error && <p>{error}</p>}
            </form>
            <form onSubmit={handleRegistration}>
                <input type='text' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type='submit'>Register</button>
                {error && <p>{error}</p>}
            </form>
        </div>
    )
}

export default LoginForm
