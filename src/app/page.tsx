'use client'
import { useEffect, useState } from "react";
import Loader from './components/Loader';

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
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const fetchData = async (s: any, p: number) => {
    try {
      setLoading(true);
      const res = await fetch(`https://api.unsplash.com/search/photos?page=${p}&query=${s}&per_page=30`, {
        headers: {
          'Authorization': 'Client-ID 0HStgGiTz9-_10dWeN0PD7IzWMp4qPHrxYBcC-IFIBE'
        }
      });
      const resData = await res.json()
      setData(resData.results)
      console.log(resData);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }
  useEffect(() => {
    if (timeoutId) clearTimeout(timeoutId);
    const id = setTimeout(() => {
      setLoading(true);
      search === '' ? fetchData('rose', page) : fetchData(search, page)
    }, 1000);
    setTimeoutId(id);
  }, [search, page])

  return (
    <>
      {loading ? <Loader /> : (
        <div className="container">
          <div className="logo"><a href="/">PIXHUB.</a></div>
          <input type="search" name="image-search" id="search" value={search} onChange={(e: any) => { setSearch(e.target.value) }} placeholder="Search images here..." />
          <>
            <div className="cards">
              {data.map((item: Image, index: number) => (
                <div key={index} className={`item item-${index}`}>
                  <a href={item.urls.raw} target="_blank"> <img src={item.urls.regular} alt={item.alt_description} /></a>
                  <a className="download_btn" href={`${item.links.download}&force=true`}>Download</a>
                </div>
              ))}
            </div>
            <div className="navigation">
              {page >= 2 && <button onClick={() => { setPage(prevPage => prevPage - 1) }}>Previous Page</button>}
              <button onClick={() => { setPage(nextPage => nextPage + 1) }}>Next Page</button>
            </div>
          </>
          <footer>
            <div className="credits">
              Designed & Developed by <a href='https://www.linkedin.com/in/ratnexh' target='_blank' rel="noreferrer">Ratnesh</a>.
            </div>
          </footer>
        </div>
      )}
    </>
  )
}