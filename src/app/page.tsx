'use client'
import { useEffect, useState } from "react";
interface Image {
  id: string,
  color: string,
  description: string,
  alt_description: string,
  urls: {
    raw: string,
    full: string,
    regular: string,
    small: string,
    thumb: string,
  },
  links: {
    self: string,
    html: string,
    download: string,
    download_location: string,
  },
}
export default function Home() {
  const [data, setData] = useState<Image[]>([]);
  const [page, setPage] = useState(1);
  const fetchData = async (s: any, p: number) => {
    try {

      const res = await fetch(`https://api.unsplash.com/search/photos?page=${p}&query=${s}&per_page=30`, {
        headers: {
          'Authorization': 'Client-ID 0HStgGiTz9-_10dWeN0PD7IzWMp4qPHrxYBcC-IFIBE'
        }
      });
      const resData = await res.json()
      setData(resData.results)
    } catch (error) {
      console.log(error);
    }
  }

  const [search, setSearch] = useState('');
  const handleSearch = (e: any) => {
    e.preventDefault();
    setSearch(e.target.value)
    setTimeout(() => {
      fetchData(search, page)
    }, 2000)
  }

  useEffect(() => {
    fetchData('grey', page);
  }, [])

  return (
    <div className="container">
      <input type="search" name="image-search" id="search" value={search} onChange={handleSearch} placeholder="Write keyword to search..." />
      <div className="cards">
        {data.map((item: Image, index: number) => (
          <div key={index} className={`item item-${index}`}>
            <a href={item.urls.full} target="_blank"> <img src={item.urls.small} alt={item.alt_description} /></a>
          </div>
        ))}
      </div>
    </div>
  )
}

