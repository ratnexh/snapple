'use client'
import { useEffect, useState } from "react";
import Loader from './components/Loader';
import Cat from "./components/cat";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DownloadIcon from '@mui/icons-material/Download';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import VisibilityIcon from '@mui/icons-material/Visibility';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

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
  user: {
    name: string,
    portfolio_url: any,
    instagram_username: string,
    profile_image: {
      large: string,
      medium: string,
    }
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
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);

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
      search === '' ? fetchData('Yoda', page) : fetchData(search, page)
    }, 1000);
    setTimeoutId(id);
    const handleScroll = () => {
      setScrollTop(window.scrollY);
      setShowBackToTop(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [search, page])

  const handlePrevPage = () => {
    setLoading(true);
    setPage(prevPage => prevPage - 1)
  }
  const handleNextPage = () => {
    setLoading(true);
    setPage(nextPage => nextPage + 1)
  }

  const handleCatClick = (event: React.MouseEvent<HTMLLIElement>) => {
    const targetButton = event.target as HTMLLIElement;
    setSearch(targetButton.textContent || '');
  }
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (typeof document !== 'undefined') {
    const topbar = document.querySelector('.topbar')
    scrollTop > 100 ? topbar?.classList.add('fixed') : topbar?.classList.remove('fixed')
  }
  return (
    <>
      {loading ? <Loader /> : (
        <div className="container">
          <div className="logo"><a href="/">PIXHUB.</a></div>
          <div className="search__field">
            <input autoFocus type="search" name="image-search" id="search" value={search} onChange={(e: any) => { setSearch(e.target.value) }} placeholder="Search images here..." />
          </div>
          <Cat handleClick={handleCatClick} />
          <>
            <div className="cards">
              {data.map((item: Image, index: number) => (
                <div key={index} className={`item item-${index}`}>
                  <span className="view_full"><a href={item.urls.raw} target="_blank" rel="noreferrer"> <VisibilityIcon /></a></span>
                  <img src={item.urls.regular} alt={item.alt_description} />
                  <div className="overlays">
                    <div className="profile">
                      <a className="name" href={`https://www.instagram.com/${item.user.instagram_username}`} target="_blank" rel="noreferrer" title="Instagram">
                        <img src={item.user.profile_image.medium} alt={item.user.name} />
                        <p>{item.user.name}</p>
                      </a>
                    </div>
                    <span>
                      {item.user.portfolio_url &&
                        <a className="portfolio_url" href={item.user.portfolio_url} target="_blank" rel="noreferrer" title="Portfolio"><PersonSearchIcon /></a>}
                      <a className="download_btn" href={`${item.links.download}&force=true`} target="_blank" rel="noreferrer" title="Download"><DownloadIcon /></a>
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="navigation">
              {page >= 2 && <button onClick={handlePrevPage} className="prev"><NavigateNextIcon />Previous Page</button>}
              <button onClick={handleNextPage} className="next">Next Page<NavigateNextIcon /></button>
            </div>
          </>
          <footer>
            <div className="credits">
              Designed & Developed by <a href='https://www.linkedin.com/in/ratnexh' target='_blank' rel="noreferrer">Ratnesh</a>.
            </div>
          </footer>
          <div className="back_to_top" onClick={handleScrollTop} style={{ display: showBackToTop ? 'flex' : 'none' }}>
            <KeyboardArrowUpIcon />
          </div>
        </div>
      )}
    </>
  )
}
