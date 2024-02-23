import { Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { MovieComponent } from './pages/movie/movie.component';

export const routes: Routes = [
    {path: '', component:MainComponent },
    {path: 'movie/:id', component:MovieComponent}
  
];
