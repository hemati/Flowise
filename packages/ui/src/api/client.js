import axios from 'axios'
import { baseURL } from 'store/constant'

const apiClient = axios.create({
    baseURL: `${baseURL}/api/v1`,
    headers: {
        'Content-type': 'application/json'
    }
})

apiClient.interceptors.request.use(function (config) {
    console.log('config', config)
    console.log('localStorage', localStorage)
    const username = localStorage.getItem('username')
    const password = localStorage.getItem('password')
    const userid = localStorage.getItem('userid')

    if (username && password) {
        config.auth = {
            username,
            password
        }
    }

    config.headers['userid'] = userid

    return config
})

export default apiClient
