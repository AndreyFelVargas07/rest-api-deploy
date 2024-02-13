const z = require("zod");

const movieSchema = z.object({
    title: z.string({
        invalid_type_error:'Movie titulo no es un string',
        required_error : 'titulo es requerido.'
    }),
    year: z.number().int().positive().min(1900).max(2024),
    director: z.string(),
    duration: z.number().int().positive(),
    rate: z.number().min(0).max(10).default(5),
    poster: z.string().url({
        message:' Poster subido correctamente'
    }),
    genre: z.array(
        z.enum(['Drama','Action','Romance','Crime','Sci-Fi', 'Adventure','Animation', 'Fantasy', 'Biography']),
        {
            required_error: 'Movie genero es requerido',
            invalid_type_error: ' Movie genero no se ha enviado correctamente'
        }
    )
})

function validateMovie(object){
    return movieSchema.safeParse(object);
}   

function validatePartialMovie (input){
    return movieSchema.partial().safeParse(input);
}

module.exports ={
     validateMovie,
     validatePartialMovie
}