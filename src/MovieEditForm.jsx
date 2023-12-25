import { useRef, useState, useEffect } from "react";
import MovieCard from "./MovieCard";
import MovieList from "./MovieList";

export default function MovieEditForm(props)
{
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

    const curMovie = props.curMovie;
    const saveEditButtonRef = useRef();
    const [editedMovieIsEdit, setEditedMovieIsEdit] = useState(false);
    const [canRefresh, setCanRefresh] = useState(false);
    const [editedMovie, setEditedMovie]= useState(null);
    const [fetchError, setFetchError] = useState(null);

    useEffect(()=>{
        if(editedMovieIsEdit !== false)
        {
            putMovie();
        }
    },[editedMovieIsEdit]);

    const putMovie = async ()=>{
        try
        {
            const response = await fetch(`http://localhost:3000/movies/${curMovie.id}`, {
                method: 'PUT',
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                body: JSON.stringify(editedMovie),
            });
            const data = await response.json();
            setEditedMovie(data);
            setEditedMovieIsEdit(false);
            setCanRefresh(true);
            setFetchError(null);
        }
        catch (e)
        {
            setFetchError(e.message);
        }
    };

    useEffect(()=>{
        if(canRefresh === true && editedMovie !== null && fetchError === null)
        {
            props.refresh.current = false;
            props.movieList.render(
              <MovieList movieContent={props.movieContent} movieList={props.movieList}/>
            );
        }
    },[canRefresh]);

    const HandleFormSubmit = (e)=>{
        e.preventDefault();
    
        saveEditButtonRef.current.disabled = true;
    
        const formData = new FormData(e.target);
        const filmObj = {
          id:curMovie.id,
          title: formData.get("film-name"),
          year: formData.get("release-date"),
          rank: formData.get("rank"),
          genres: formData.getAll("genres"),
          director: formData.get("director"),
          actors: formData.get("actors-list"),
          plot: formData.get("description"),
          posterUrl: formData.get("image"),
        };
        setEditedMovie(filmObj);
        setEditedMovieIsEdit(true);
      };

      const HandleCancelButtonClick = (e)=>{
        props.movieContent.render(
            <MovieCard 
            movieId={curMovie.id} 
            movieContent={props.movieContent} 
            movieList={props.movieList}
            refresh={props.refresh}
            addBtn={props.addBtn}
            inp={props.inp} />
          );
        props.addBtn.current.disabled = false;
        props.inp.current.disabled = false;
      };

    return (
        <>
        {curMovie &&
            <form id="editForm" name="create-edit-movie" onSubmit={(e)=>{
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
                defaultValue={curMovie.title}
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
                defaultValue={curMovie.year}
            />
            <label htmlFor="description">Описание</label>
            <textarea
                name="description"
                id="description"
                placeholder="Введите описание"
                required
                defaultValue={curMovie.plot}
            />
            <label htmlFor="genres">Выберите жанр фильма</label>
            <select
                name="genres"
                id="genres"
                size={4}
                form="editForm"
                multiple
                required
                defaultValue={curMovie.genres}
            >
                {filmGenres.map((genre, index) => {
                if (curMovie.genres.includes(genre)) {
                    return <option key={index} value={genre}>{genre}</option>;
                }
                return <option key={index} value={genre}>{genre}</option>;
                })}
            </select>
            <label htmlFor="image">Cсылка на обложку</label>
            <input
                type="url"
                name="image"
                id="image"
                placeholder="Вставьте ссылку"
                required
                defaultValue={curMovie.posterUrl}
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
                defaultValue={curMovie.rank}
            />
            <label htmlFor="actors-list">Список актеров</label>
            <input
                type="text"
                name="actors-list"
                id="actors-list"
                placeholder="Введите список актеров (через ,)"
                required
                autoComplete="off"
                defaultValue={curMovie.actors}
            />
            <label htmlFor="director">Режиссер</label>
            <input
                type="text"
                name="director"
                id="director"
                placeholder="Введите..."
                required
                autoComplete="off"
                defaultValue={curMovie.director}
            />
            <div className="movieContent__flex-row">
                <button type="button" id="cancel-btn-editForm" onClick={(e)=>{
                    HandleCancelButtonClick(e);
                }}>
                Отменить
                </button>
                <button ref={saveEditButtonRef} type="submit" id="save-btn-editForm">
                Сохранить
                </button>
            </div>
            </form>
        }
        </>
    );
}