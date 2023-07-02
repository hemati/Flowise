import { lazy } from 'react'

// project imports
import Loadable from 'ui-component/loading/Loadable'
import MinimalLayout from 'layout/MinimalLayout'

// login routing
const LoginForm = Loadable(lazy(() => import('views/loginform')))

// ==============================|| LOGIN ROUTING ||============================== //

const LoginRoutes = {
    path: '/',
    element: <MinimalLayout />,
    children: [
        {
            path: '/login',
            element: <LoginForm />
        }
    ]
}

export default LoginRoutes
