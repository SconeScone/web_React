import React, { useState, useEffect, useRef } from "react";
import MovieCard from "./MovieCard";
import MovieForm from "./MovieForm";

export default function Plates(props) {

  const [selectedPlate, setSelectedPlate] = useState(-1);
  const [movies, setMovies] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const refreshPlates = useRef(false);
  const addButtonRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    if(refreshPlates.current === false)
    {
      getMovies();
    }
  }, [refreshPlates.current]);

  const getMovies = async () => {
    try {
      const response = await fetch("http://localhost:3000/movies");
      const data = await response.json();
      setMovies(data);
      refreshPlates.current = true;
      setFetchError(null);
    }
    catch (e) {
      setFetchError(e.message);
    }
  }

  useEffect(() => {
    if (selectedPlate !== -1) {
      props.movieContent.render(
        <MovieCard 
        movieId={selectedPlate}
        movieContent={props.movieContent} 
        movieList={props.movieList}
        refresh={refreshPlates}
        addBtn={addButtonRef}
        inp={inputRef} 
        />
      );
    }
  }, [selectedPlate]);

  const HandlePlateClick = (e, id) => {
    setSelectedPlate(id);
  }

  //Обработчик для кнопки добавления
  const HandleAddButtonClick = (e) => {

    addButtonRef.current.disabled = true;
    inputRef.current.disabled = true;

    props.movieContent.render(
      <MovieForm
        movieContent={props.movieContent}
        movieList={props.movieList}
        movieId={selectedPlate}
        refresh={refreshPlates}
        addBtn={addButtonRef}
        inp={inputRef}
      />
    );
  };
  //------------------------------------

  //Поиск и фильтрация по названию фильма
  const [value, setValue] = useState("");
  const filteredMovies = movies.filter((item)=>{
    return item.title.toLowerCase().startsWith(value.toLowerCase());
  });
  //-------------------------------------

  return (
    <>
      {
        fetchError !== null ?
          <p style={{ textAlign: "center" }}>{fetchError}</p> :
          <>
          <input ref={inputRef} type="text" autoComplete="off" onChange={(e)=>{
            setValue(e.target.value);
          }}/>
          <ul id="plates">
            {filteredMovies.map((movie) => {
              return (
                <li key={movie.id} className="plate"
                  style={selectedPlate === movie.id ? { backgroundColor: "rgba(42, 157, 160, 1)" } : null}
                  onClick={(e) => {
                    if(addButtonRef.current.disabled === false)
                    {
                      HandlePlateClick(e, movie.id);
                    }
                    else
                    {
                      alert("Вы не можете проcматривать фильмы, пока не отредактируте фильм или не закончите его добавление");
                    }
                  }}>
                  <h3>{movie.title}</h3>
                  <p>{movie.genres.join(" | ")}</p>
                </li>
              );
            })}
          </ul>
          <button ref={addButtonRef} id="add-btn" onClick={(e) => {
            HandleAddButtonClick(e);
            }}>Добавить</button>
          </>
      }
    </>
  );
}
