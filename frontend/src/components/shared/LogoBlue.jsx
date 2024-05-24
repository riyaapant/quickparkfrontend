import logoblue from '../../media/logoblue.png'
import { Link } from 'react-router-dom'

function LogoBlue() {
    return (
        <Link to="#">
            <div className='h-auto cursor-pointer'>
                <img src={logoblue} alt="img" className='h-20 w-auto mx-10' />
            </div>
        </Link>
    )
}

export default LogoBlue