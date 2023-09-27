import React from 'react'
import category from '../utils/category'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

interface CatProps {
    handleClick: (event: React.MouseEvent<HTMLLIElement>) => void;
}

const Cat: React.FC<CatProps> = ({ handleClick }) => {

    return (
        <span>
            <span className='quick_search'>Quick search <ArrowRightAltIcon /></span>
            <ul className='catList'>
                {category.map((item, index) =>
                    (<li onClick={handleClick} key={index} className='category'>{item.cat}</li>)
                )}
            </ul>
        </span>
    )
}

export default Cat
