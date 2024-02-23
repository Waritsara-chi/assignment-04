import { Injectable } from '@angular/core';
import { Constants } from '../constants/constants';
import { HttpClient } from '@angular/common/http';
import { GetTitleByID } from '../model/GetTitleModel';
import { GetMovieP } from '../model/GetMovieP';
import { firstValueFrom, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private constanst: Constants, private http: HttpClient) {}

  page: number = 1;
  url = this.constanst.API_ENDPOINT;
  type: string = 'movie';

  public async getTitleP(page?: number, type?: string) {
    const response = await firstValueFrom(
      this.http.get(this.url, {
        params: {
          s: type || 'movie',
          page: page || 1,
        },
      })
    );
    // console.log(response);
    return response as GetMovieP;
  }

  public async getTitletype(type?: string, page?: number ) {
    let params: any = {
      s: 'movie',
      page: page
    };

    if (type) {
      params.type = type;
    }

    const response = await firstValueFrom(
      this.http.get(this.url, { params })
    );

    console.log(response);
    return response as GetMovieP;
  }

  public async getMovie(id: string[]) {
    const moviePromises = id.map(async (id) => {
      const response = await firstValueFrom(
        this.http.get(this.url, {
          params: {
            i: id,
            plot: 'movie',
          },
        })
      );
      // console.log(response);
      return response as GetTitleByID;
    });

    const movies = await Promise.all(moviePromises);
    // console.log(movies);
    return movies;
  }

  public async getTitleByName(name: string[], page?: number) {
    const response = await firstValueFrom(
      this.http.get(this.url, {
        params: {
          s: name,
          plot: 'movie',
          page: page || 1,
        },
      })
    );
    // console.log(response);
    

    return response as GetMovieP;
  }

  public async getTitleByID(id: string[], page?: number) {
    const response = await firstValueFrom(
      this.http.get(this.url, {
        params: {
          i: id,
          plot: 'movie',
          page: page || 1,
        },
      })
    );
      
    return response as GetTitleByID;
  }

  
}
