'use client'
import React, { useEffect, useState } from 'react'

const Pixabay = () => {
    const [data, setData] = useState<any[]>([])
    const fetchData = async () => {
        try {
            const res = await fetch('https://pixabay.com/api/?key=39715218-ec8ed36342f42422bfe50cda1&q=yellow+flowers&image_type=photo')
            const resData = await res.json()
            setData(prevData => [...prevData, ...resData.hits])
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchData();
    }, [])

    return (
        <div>pixabay</div>
    )
}

export default Pixabay
