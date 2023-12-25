import Plates from "./Plates";

export default function MovieList(props) {
  return (
    <div className="moviesList__grid">
      <Plates movieContent={props.movieContent} movieList={props.movieList}/>
    </div>
  );
}
