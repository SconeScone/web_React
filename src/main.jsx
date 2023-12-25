import React from "react";
import ReactDOM from 'react-dom/client';
import MovieList from "./MovieList.jsx";

let movie_content = ReactDOM.createRoot(document.getElementById("movieContent"));

let movie_list = ReactDOM.createRoot(document.getElementById("movieList"));

movie_list.render(
    <MovieList movieContent={movie_content} movieList={movie_list}/>
);

