import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Titlecards.css";

type ApiCard = {
  backdrop_path: string;
  original_title: string;
  id: number;
};

type TitlecardProps = {
  title?: string;
  category?: string;
};

const Titlecards: React.FC<TitlecardProps> = ({ title, category }) => {
  const [apiData, setApiData] = useState<ApiCard[]>([]);
  const cardsRef = useRef<HTMLDivElement | null>(null);

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNmY2ZTM1YmRlNzkyYWFhMTBkYTBjNGJmODQzNmQxZSIsIm5iZiI6MTc2MDUxNTQ0Mi41NTIsInN1YiI6IjY4ZWY1NTcyYmVkYzE5ZTI3ZDQwY2MwYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kmfIieSjMpLCeHbGueBIfvIh02sGJnwrGiOVkLjE7Ic",
    },
  };

  const handleWheel = (event: WheelEvent) => {
    event.preventDefault();
    if (cardsRef.current) {
      cardsRef.current.scrollLeft += event.deltaY;
    }
  };

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/${category ? category : "now_playing"}?language=en-US&page=1`,
      options
    )
      .then((res) => res.json())
      .then((res) => setApiData(res.results))
      .catch((err) => console.error(err));

    const currentRef = cardsRef.current;
    if (currentRef) {
      currentRef.addEventListener("wheel", handleWheel, { passive: false });
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener("wheel", handleWheel);
      }
    };
    // Including 'category' in deps so it re-fetches on category change
  }, [category]);

  return (
    <div className="title-cards">
      <h2>{title ? title : "Popular on Netflix"}</h2>
      <div className="card-list" ref={cardsRef}>
        {apiData.map((card) => (
          <Link to={`/player/${card.id}`} className="card" key={card.id}>
            <img
              src={`https://image.tmdb.org/t/p/w500${card.backdrop_path}`}
              alt={card.original_title}
            />
            <p>{card.original_title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Titlecards;
