const express = require("express");
const crypto = require("node:crypto"); // Libreria de node para crear un id random
const movies = require("./class4/movies.json");
const { validateMovie, validatePartialMovie } = require("./schemas/movie.js");
const cors = require("cors");

const app = express();
app.use(express.json());
app.disable("x-powered-by");
app.use(cors({
  origin : (origin,callback)=>{
    const ACCEPTED_ORIGINS = [
      "http://localhost:8080",
      "http://localhost:3000",
      "http://movies.com",
    ]
  if(ACCEPTED_ORIGINS.includes(origin)){
    return callback(null,true)
  }
  if(!origin){
    return callback(null, true)
  }
  return callback(new Error('Not allowed by CORS'))
}

}));


//Encontrar peliculas a traves de un genero
app.get("/movies", (req, res) => {
  // const origin = req.header("origin");
  // if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
  //   // ERROR DE CORS

  //   res.header("Access-Control-Allow-Origin", origin);
  // }

  const { genre } = req.query;
  if (genre) {
    const movieFilter = movies.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    );
    if (movieFilter.length === 0) {
      return res.status(404).json({ message: "Hubo un error en el genero" });
    }
    res.json(movieFilter);
  }
  res.json(movies);
});

//Imprimir la pelicula que tenga respectivo id
app.get("/movies/:id", (req, res) => {
  const { id } = req.params;
  console.log(id);
  const movie = movies.find((movie) => movie.id == id);
  if (movie) return res.json(movie);

  res.status(404).json({
    messageError: "Hubo un error",
  });
});

// POST

app.post("/movies", (req, res) => {
  const result = validateMovie(req.body);

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }
  const newMovie = {
    id: crypto.randomUUID(), // crea un id random
    ...result.data,
  };

  movies.push(newMovie);
  console.log(movies);
  res.status(201).json(newMovie);
});
//DELETE

app.delete('/movies/:id', (req, res) => {
  // const origin = req.header("origin");

  // if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
  //   res.header("Access-Control-Allow-Origin", origin);
  // }
  
  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({ message: "Movie not Found" });
  }

  movies.splice(movieIndex, 1);

  return res.json({ message: "Movie Eliminado" });
});

// Editar con PATCH

app.patch("/movies/:id", (req, res) => {
  const result = validatePartialMovie(req.body);

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({ message: "Movie no encontrada" });
  }

  const movieUpdate = {
    ...movies[movieIndex],
    ...result.data,
  };

  movies[movieIndex] = movieUpdate;
  return res.json(movieUpdate);
});

// app.options('/movies/:id',(req, res)=>{
//   const origin = req.header('origin');

//   if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
//     res.header('Access-Control-Allow-Origin', origin);
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
//   }
//   res.send(200);
// })

//Servidor Listening
const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
