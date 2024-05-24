import logowhite from '../../media/logowhite.png'
import { Link } from "react-router-dom";

function LogoWhite() {
    return (
        <Link to="#">
            <div className='h-auto cursor-pointer'>
                <img src={logowhite} alt="img" className='h-20 w-auto mx-10' />
            </div>
        </Link>
    )
}

export default LogoWhite;