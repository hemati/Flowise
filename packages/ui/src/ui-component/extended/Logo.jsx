import logo from '@/assets/images/logo.png'
import logoDark from '@/assets/images/logo.png'

import { useSelector } from 'react-redux'

// ==============================|| LOGO ||============================== //

const Logo = () => {
    const customization = useSelector((state) => state.customization)

    return (
        <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'row' }}>
            <img
                style={{ objectFit: 'contain', height: 'auto', width: 50 }}
                src={customization.isDarkMode ? logoDark : logo}
                alt='Flowise'
            />
            LangFlux
        </div>
    )
}

export default Logo
