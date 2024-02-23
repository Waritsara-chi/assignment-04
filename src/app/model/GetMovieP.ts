export interface GetMovieP {
    Search:       Search[];
    totalResults: string;
    Response:     string;
}

export interface Search {
    // [x: string]: any;
    Title:  string;
    Year:   string;
    imdbID: string;
    Type:   string;
    Poster: string;
}