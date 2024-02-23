import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Constants {
  public readonly API_KEY: string = '500b9113';
  public readonly API_ENDPOINT: string = `https://www.omdbapi.com/?apikey=${this.API_KEY}`;
}