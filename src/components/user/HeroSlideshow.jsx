import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getLatestUploads } from "../../api/movie";
import { useNotification } from "../../hooks";
import Slider from "react-slick";

export default function HeroSlidShow() {
  const [slides, setSlides] = useState([]);
  const abortController = useRef(new AbortController());
  const { updateNotification } = useNotification();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getLatestUploads(abortController.current.signal);
        setSlides([...response.movies]);
      } catch (error) {
        console.log(error);
        return updateNotification("error", error);
      }
    }
    fetchData();
    return () => {
      abortController.current.abort();
    };
  }, []);

  const settings = {
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay:true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />
  };

  function NextArrow(props) {
    const { onClick } = props;
    return (
      <button
        className="absolute right-4 top-1/2 right-0 transform -translate-y-1/2 bg-gray-500 hover:bg-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:bg-opacity-75 bg-opacity-60 text-white font-bold py-2 px-4 rounded-full focus:outline-none"
        onClick={onClick}
      >
        {'>'}
      </button>
    );
  }

  function PrevArrow(props) {
    const { onClick } = props;
    return (
      <button
        className="absolute top-1/2 left-4 z-10 transform -translate-y-1/2 bg-gray-500 hover:bg-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:bg-opacity-75 bg-opacity-60 text-white font-bold py-2 px-4 rounded-full focus:outline-none"
        onClick={onClick}
      >
        {'<'}
      </button>
    );
  }


  return (

    <div>
      <Slider {...settings}>
        {slides.map((movie) => (<Slide movie={movie} />))}
      </Slider>
      <style jsx>{`
        .slick-next:before,
        .slick-prev:before {
          color: black; 
        }
      `}</style>
    </div>
  );
}


function Slide({ movie }) {
  return (
    <Link
      to={"/movie/" + movie.id}
    >
      <Poster poster={movie.poster} title={movie.title} />
    </Link>
  );
};

function Poster({ poster, title }) {
  return (
    <div className="relative">
      <img src={poster} alt="Poster" className="w-full h-auto filter brightness-80" />
      <div className="absolute bottom-0 left-0 right-0 z-10" style={{
        height: '60vh',
      }}>
        <div className="w-full h-full relative">
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white to-transparent dark:from-black dark:to-transparent" style={{
            height: '50%',
            maxHeight: '40vh',
          }}></div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 z-20 text-left px-4 py-2">

        <h1 className="text-3xl font-bold pl-6 pb-8 text-blue-500 dark:text-yellow-500">{title}</h1>
      </div>
    </div>
  );
}
