import React, { useEffect, useRef, useState } from "react";
import MovieCard from "./MovieCard";
import MovieList from "./MovieList";

export default function MovieForm(props) {
  const filmGenres = [
    "Comedy",
    "Fantasy",
    "Crime",
    "Drama",
    "Music",
    "Adventure",
    "History",
    "Thriller",
    "Animation",
    "Family",
    "Mystery",
    "Biography",
    "Action",
    "Film-Noir",
    "Romance",
    "Sci-Fi",
    "War",
    "Western",
    "Horror",
    "Musical",
    "Sport",
  ];

  const saveButtonRef = useRef();

  const HandleCancelButtonClick = (e)=>{
    if(props.movieId !== -1)
    {
      props.movieContent.render(
        <MovieCard 
        movieId={props.movieId} 
        movieContent={props.movieContent} 
        movieList={props.movieList}
        refresh={props.refresh}
        addBtn={props.addBtn}
        inp={props.inp} />
      );
      props.addBtn.current.disabled = false;
      props.inp.current.disabled = false;
    }
    else
    {
      props.movieContent.render(
        <></>
      );
      props.addBtn.current.disabled = false;
      props.inp.current.disabled = false;
    }
  };

  const [newMovieIsAdded, setNewMovieIsAdded] = useState(false);
  const [newMovie, setNewMovie] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  useEffect(()=>{
    if(newMovieIsAdded !== false)
    {
      postMovie();
    }
  }, [newMovieIsAdded]);

  const postMovie = async ()=>{
    try
    {
      const response = await fetch("http://localhost:3000/movies", {
        method: "POST",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify(newMovie),
      });
      const data = await response.json();
      setNewMovie(data);
      setNewMovieIsAdded(false);
      setFetchError(null);
    }
    catch(e)
    {
      setFetchError(e.message);
    }
  };

  useEffect(()=>{
    if(newMovie !== null && newMovie.id !== undefined && fetchError === null)
    {
      props.refresh.current = false;

      props.movieList.render(
        <MovieList movieContent={props.movieContent} movieList={props.movieList}/>
      );
    }

  },[newMovie]);

  const HandleFormSubmit = (e)=>{
    e.preventDefault();

    saveButtonRef.current.disabled = true;

    const formData = new FormData(e.target);
    const filmObj = {
      title: formData.get("film-name"),
      year: formData.get("release-date"),
      rank: formData.get("rank"),
      genres: formData.getAll("genres"),
      director: formData.get("director"),
      actors: formData.get("actors-list"),
      plot: formData.get("description"),
      posterUrl: formData.get("image"),
    };
    setNewMovieIsAdded(true);
    setNewMovie(filmObj);
  };

  return (
    <form id="addForm" name="create-edit-movie" onSubmit={(e)=>{
      HandleFormSubmit(e);
    }}>
      <label htmlFor="film-name">Название фильма</label>
      <input
        type="text"
        name="film-name"
        id="film-name"
        placeholder="Введите название фильма"
        required
        autoComplete="off"
      />
      <label htmlFor="release-date">Год выпуска</label>
      <input
        type="number"
        min={1895}
        max={2100}
        name="release-date"
        id="release-date"
        placeholder="Введите год выпуска"
        required
        autoComplete="off"
      />
      <label htmlFor="description">Описание</label>
      <textarea
        name="description"
        id="description"
        placeholder="Введите описание"
        required
        defaultValue={""}
      />
      <label htmlFor="genres">Выберите жанр фильма</label>
      <select
        name="genres"
        id="genres"
        size={4}
        form="addForm"
        multiple
        required
      >
        {filmGenres.map((genre, index) => (
          <option key={index} value={genre}>
            {genre}
          </option>
        ))}
      </select>
      <label htmlFor="image">Cсылка на обложку</label>
      <input
        type="url"
        name="image"
        id="image"
        placeholder="Вставьте ссылку"
        required
      />
      <label htmlFor="rank">Рейтинг</label>
      <input
        type="number"
        min={1}
        max={10}
        name="rank"
        id="rank"
        placeholder="Введите..."
        required
      />
      <label htmlFor="actors-list">Список актеров</label>
      <input
        type="text"
        name="actors-list"
        id="actors-list"
        placeholder="Введите список актеров (через ,)"
        required
        autoComplete="off"
      />
      <label htmlFor="director">Режиссер</label>
      <input
        type="text"
        name="director"
        id="director"
        placeholder="Введите..."
        required
        autoComplete="off"
      />
      <div className="movieContent__flex-row">
        <button type="button" id="cancel-btn" onClick={(e)=>{
          HandleCancelButtonClick(e);
        }}>
          Закрыть
        </button>
        <button ref={saveButtonRef} type="submit" id="save-btn">
          Сохранить
        </button>
      </div>
    </form>
  );
}
