import React, { useState, useEffect } from "react";
import MovieEditForm from "./MovieEditForm";

export default function MovieCard(props) {

  const [movie, setMovie] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    getMovie();
  }, [props.movieId]);

  const getMovie = async () => {
    try {
      const response = await fetch(`http://localhost:3000/movies/${props.movieId}`);
      const data = await response.json();
      setMovie(data);
      setFetchError(null);
    } catch (e) {
      setFetchError(e.message);
    }
  };

  const HandleEditButtonClick = (e)=>{
    props.addBtn.current.disabled = true;
    props.inp.current.disabled = true;
    props.movieContent.render(
      <MovieEditForm 
      curMovie={movie} 
      movieContent={props.movieContent} 
      movieList={props.movieList} 
      addBtn={props.addBtn}
      inp={props.inp} 
      refresh={props.refresh}/>
    );
  };

  return (
    <>
      {fetchError !== null ? (
        <p style={{ textAlign: "center" }}>{fetchError}</p>
      ) : (
        <>
          {movie && (
            <>
              <button id="edit-btn" onClick={(e)=>{
                HandleEditButtonClick(e);
              }}>Редактировать</button>
              <div className="movieImageInfo">
                <div className="imgFrame">
                  <img
                    className="movieImg"
                    src={movie.posterUrl}
                    alt="Обложка фильма"
                  />
                </div>
                <div className="movieInfo">
                  <h1>{movie.title}</h1>
                  <div className="movieDetails">
                    <div id="aboutMovie">
                      <h2>О фильме</h2>
                      <p>Год производства: {movie.year}</p>
                      <p>Режиссер: {movie.director}</p>
                      <p>Жанры: {movie.genres.join(", ")}</p>
                    </div>
                    <div id="movieActors">
                      <h3>В главных ролях</h3>
                      <ul>
                        {movie.actors.split(",").map((actor, index) => (
                          <li key={index}>{actor}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div>
                    <h2>Рейтинг</h2>
                    <h1 id="rank">{movie.rank}</h1>
                  </div>
                </div>
              </div>
              <div className="movieDescription">
                <h2>Описание</h2>
                <p id="description">{movie.plot}</p>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
