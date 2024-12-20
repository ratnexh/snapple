"use client";
import { useEffect, useState } from "react";
import Loader from "./components/Loader";
import Cat from "./components/cat";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DownloadIcon from "@mui/icons-material/Download";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import VisibilityIcon from "@mui/icons-material/Visibility";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import CloseIcon from "@mui/icons-material/Close";

export default function Home() {
  const [data, setData] = useState<Image[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [likedImages, setLikedImages] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [modalImage, setModalImage] = useState<string | null>(null);

  const fetchData = async (s: any, p: number, append: boolean = false) => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://api.unsplash.com/search/photos?page=${p}&query=${s}&per_page=30`,
        {
          headers: {
            Authorization:
              "Client-ID KEY_HERE",
          },
        }
      );
      const resData = await res.json();
      setData((prev) =>
        append ? [...prev, ...resData.results] : resData.results
      );
      setHasMore(resData.results.length === 30);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (timeoutId) clearTimeout(timeoutId);
    const id = setTimeout(() => {
      setLoading(true);
      search === "" ? fetchData("Yoda", page) : fetchData(search, page);
    }, 1000);
    setTimeoutId(id);
    const handleScroll = () => {
      setScrollTop(window.scrollY);
      setShowBackToTop(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [search, page]);

  const handlePrevPage = () => {
    setLoading(true);
    setPage((prevPage) => prevPage - 1);
  };
  const handleNextPage = () => {
    setLoading(true);
    setPage((nextPage) => nextPage + 1);
  };

  const handleCatClick = (event: React.MouseEvent<HTMLLIElement>) => {
    const targetButton = event.target as HTMLLIElement;
    setSearch(targetButton.textContent || "");
  };
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLikeImage = (imageId: string) => {
    setLikedImages((prev) =>
      prev.includes(imageId)
        ? prev.filter((id) => id !== imageId)
        : [...prev, imageId]
    );
    // Here you could also integrate with a backend to persist likes
  };

  if (typeof document !== "undefined") {
    const topbar = document.querySelector(".topbar");
    scrollTop > 100
      ? topbar?.classList.add("fixed")
      : topbar?.classList.remove("fixed");
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="container">
          <div className="logo">
            <a href="/">Snapple.</a>
          </div>
          <div className="search__field">
            <input
              type="search"
              name="image-search"
              id="search"
              value={search}
              onChange={(e: any) => {
                setSearch(e.target.value);
              }}
              placeholder="Search images here..."
            />
          </div>
          <Cat handleClick={handleCatClick} />
          <>
            <div className="cards">
              {data.map((item: Image, index: number) => (
                <div key={index} className={`item item-${index}`}>
                  <span className="view_full">
                    <button onClick={() => setModalImage(item.urls.raw)}>
                      <VisibilityIcon />
                    </button>
                  </span>
                  <img src={item.urls.regular} alt={item.alt_description} />
                  <div className="overlays">
                    <div className="profile">
                      {item.user.instagram_username ? (
                        <a
                          className="name"
                          href={`https://www.instagram.com/${item.user.instagram_username}`}
                          target="_blank"
                          rel="noreferrer"
                          title="Instagram"
                        >
                          <img
                            src={item.user.profile_image.medium}
                            alt={item.user.name}
                          />
                          <p>{item.user.name}</p>
                        </a>
                      ) : (
                        <a
                          className="name"
                          href={item.user.portfolio_url}
                          target="_blank"
                          rel="noreferrer"
                          title="Portfolio"
                        >
                          <img
                            src={item.user.profile_image.medium}
                            alt={item.user.name}
                          />
                          <p>{item.user.name}</p>
                        </a>
                      )}
                    </div>
                    <span>
                      <button
                        className="like-btn"
                        onClick={() => handleLikeImage(item.id)}
                        title={
                          likedImages.includes(item.id) ? "Unlike" : "Like"
                        }
                      >
                        {likedImages.includes(item.id) ? (
                          <FavoriteIcon />
                        ) : (
                          <FavoriteBorderIcon />
                        )}
                      </button>
                      <button
                        className="share-btn"
                        onClick={() => {
                          navigator
                            .share({
                              title: `Photo by ${item.user.name}`,
                              text:
                                item.description ||
                                "Check out this amazing photo!",
                              url: item.urls.raw,
                            })
                            .catch(console.error);
                        }}
                        title="Share"
                      >
                        <ShareIcon />
                      </button>
                      {item.user.portfolio_url && (
                        <a
                          className="portfolio_url"
                          href={item.user.portfolio_url}
                          target="_blank"
                          rel="noreferrer"
                          title="Portfolio"
                        >
                          <PersonSearchIcon />
                        </a>
                      )}
                      <a
                        className="download_btn"
                        href={`${item.links.download}&force=true`}
                        target="_blank"
                        rel="noreferrer"
                        title="Download"
                      >
                        <DownloadIcon />
                      </a>
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="navigation">
              {page >= 2 && (
                <button onClick={handlePrevPage} className="prev">
                  <NavigateNextIcon />
                  Previous Page
                </button>
              )}
              {data.length === 30 && (
                <button onClick={handleNextPage} className="next">
                  Next Page
                  <NavigateNextIcon />
                </button>
              )}
            </div>
          </>
          <footer>
            <div className="credits">
              <span>
                Images from{" "}
                <a href="https://unsplash.com/" className="unsplash">
                  Unsplash
                </a>
                .
              </span>
              <span>
                Designed & Developed by{" "}
                <a
                  href="https://www.linkedin.com/in/ratnexh"
                  target="_blank"
                  rel="noreferrer"
                >
                  Ratnesh
                </a>
                .
              </span>
            </div>
          </footer>
          <div
            className="back_to_top"
            onClick={handleScrollTop}
            style={{ display: showBackToTop ? "flex" : "none" }}
          >
            <KeyboardArrowUpIcon />
          </div>

          {modalImage && (
            <div className="modal" onClick={() => setModalImage(null)}>
              <div className="modal-content">
                <button
                  className="close-modal"
                  onClick={() => setModalImage(null)}
                >
                  <CloseIcon />
                </button>
                <div className="modal-image-container">
                  <div className="loader-text">Loading...</div>
                  <img
                    src={modalImage}
                    alt="Full size"
                    className="actual-image"
                    onLoad={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.opacity = "1";
                      target.previousElementSibling?.remove();
                    }}
                    style={{ opacity: 0 }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
