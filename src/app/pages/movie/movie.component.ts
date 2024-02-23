import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { GetTitleByID } from '../../model/GetTitleModel';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule,],
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.scss',
})
export class MovieComponent implements OnInit {
  id: string[] = []; // กำหนดให้ id เป็น string[]
  title: GetTitleByID[] = [];
  movie: GetTitleByID | undefined;// สร้างตัวแปรเพื่อเก็บข้อมูลเรื่องราวของแต่ละหนัง

  constructor(
    private activeadRoute: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) {}
  
  goBack() {
    this.router.navigate(['/']);
  }

  ngOnInit(): void {
    const idParam = this.activeadRoute.snapshot.paramMap.get('id');
    if (idParam) {
      this.id.push(idParam);
      this.getTitle(this.id);
    }
  }

  async getTitle(id: string[]) {
    // รับ id เป็น string[]
    this.title = await this.apiService.getMovie(id);
    // console.log(this.title[0]);
    this.movie = this.title[0];
  }
  

}

