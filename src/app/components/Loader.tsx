import React from 'react'
import loaderImage from '@/app/assets/images/whale.gif'

const Loader = () => {
    return (
        <div className="loader">
            {/* <h1> Loading...</h1> */}
            <img src={loaderImage.src} alt="Loader image" />
        </div>
    )
}

export default Loader