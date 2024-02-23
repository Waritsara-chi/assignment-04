import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GetMovieP, Search } from '../../model/GetMovieP';
import { ApiService } from '../../services/api.service';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { GetTitleByID } from '../../model/GetTitleModel';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    FormsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    RouterModule,
    MatSelectModule
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit {
  titles: GetMovieP | undefined;
  SearchTitle: Search[] = [];
  TitleByID: GetTitleByID[] = [];
  title: GetTitleByID | undefined;
  Startpage: number = 1;
  Imdbs: string[] = [];
  searchForm: boolean = false;
  selectForm: boolean = false; 
  idForm: boolean = false;
  resultTitle: any;
  searchName: string[] = [];
  id: string[] = [];
  selectedValue: string | undefined;

  type = ['movie', 'series', 'episode'];

  constructor(private apiService: ApiService, private router: Router) {

  }

  page: number = this.apiService.page;

  ngOnInit(): void {
    const currentPage = sessionStorage.getItem('currentPage');
    const searchForm = sessionStorage.getItem('searchForm');
    const searchString = sessionStorage.getItem('search');
    const selectForm = sessionStorage.getItem('selectForm');
    const idForm = sessionStorage.getItem('idForm');
    const selectString = sessionStorage.getItem('type'); 
    const id = sessionStorage.getItem('id');

    
    this.searchForm = searchForm === 'true' || false;
    // กำหนดค่า searchString ใน searchName โดยตรง
    this.searchName = searchString ? searchString.split(',') : [];
    this.page = currentPage ? parseInt(currentPage) : 1;
    
    this.selectForm = selectForm === 'true' || false;
    this.selectedValue = selectString || ''; // กำหนดค่า selectForm จาก sessionStorage

    this.id = id ? id.split(',') : [];
    this.idForm = idForm === 'true' || false;

    this.loadDataAsync();
  }

  async loadDataAsync() {
    console.log("current page : ", this.page);
    
    this.titles = await this.apiService.getTitleP();
    this.resultTitle = this.titles.totalResults;
    this.resultTitle = Math.ceil(this.resultTitle / 10);

    console.log("search : ", this.searchForm);
    console.log("select : ", this.selectForm);
    console.log("id : ", this.idForm);
    


    if (this.searchForm) {
      this.titles = await this.apiService.getTitleByName(this.searchName, this.page);
      this.SearchTitle = this.titles.Search;
      // console.log(this.SearchTitle);

    } else if (this.selectForm) {
      this.titles = await this.apiService.getTitleP(this.page, this.selectedValue);
      this.SearchTitle = this.titles.Search;
      // console.log(this.SearchTitle);
      
    } else {
      this.titles = await this.apiService.getTitleP(this.page);
      this.SearchTitle = this.titles.Search;
      console.log(this.SearchTitle);
    }
    
    if (this.idForm) {
      this.title = await this.apiService.getTitleByID(this.id, this.page);
      this.Imdbs.push(this.title.imdbID);
    } else {
      this.SearchTitle.forEach((title) => {
        this.Imdbs.push(title.imdbID);
      });
    }
    

    this.TitleByID = await this.apiService.getMovie(this.Imdbs);

    // อัพเดทค่าของหน้าใน session storage เมื่อมีการเปลี่ยนแปลง
    sessionStorage.setItem('currentPage', this.page.toString());
  }

  getGenreArray(genre: string): string[] {
    return genre.split(',');
  }

  async handleSubmit(PageInput: any) {

    this.titles = await this.apiService.getTitleP(this.page);
    this.SearchTitle = this.titles.Search;

    this.Imdbs = []; // เคลียร์ Imdbs เดิม
    this.TitleByID = []; // เคลียร์ TitleByID เดิม
    await this.loadDataAsync();

    this.Startpage = PageInput.value;
  }

  async updatePage(direction: 'next' | 'prev') {
    if (direction === 'next') {
      this.Startpage++;
    } else if (direction === 'prev' && this.Startpage > 1) {
      this.Startpage--;
    }

    this.page = this.Startpage;
    this.titles = await this.apiService.getTitleP(this.page);
    this.SearchTitle = this.titles.Search;

    this.Imdbs = []; // เคลียร์ Imdbs เดิม
    this.TitleByID = []; // เคลียร์ TitleByID เดิม
    await this.loadDataAsync();
    // console.log(this.titles);
  }

  // SearchName
  async SearchByname(Search: HTMLInputElement): Promise<void> {
    const search = Search.value;
    if (search.trim() === '') {
      return; // ถ้าไม่มีข้อมูลที่ส่งมาให้ยกเลิกการค้นหา
    }

    sessionStorage.setItem('search', search);
    sessionStorage.setItem('searchForm', 'true'); // เก็บค่าว่ากำลังทำการค้นหา

    this.searchForm = true;
    this.page = 1;
    this.searchName = [search.trim()]; // เพิ่มเงื่อนไขเพื่อให้รับเฉพาะข้อมูลที่ไม่ว่างเปล่า
    this.Imdbs = [];
    this.TitleByID = [];
    await this.loadDataAsync();
  }

  // SearchID
  async SearchByID(id: HTMLInputElement) {
    const idString = id.value;
    if (idString.trim() === '') {
      return; // ถ้าไม่มีข้อมูลที่ส่งมาให้ยกเลิกการค้นหา
    }

    sessionStorage.setItem('id', idString);
    sessionStorage.setItem('idForm', 'true'); // เก็บค่าว่ากำลังทำการค้นหา

    this.idForm = true;
    this.page = 1;
    this.id = [];
    this.id.push(id.value);

    this.Imdbs = [];
    this.TitleByID = [];
    await this.loadDataAsync();
    // console.log(this.TitleByID);
  }

  // Dropdown
  async onTypeSelectionChange(event: MatSelectChange) {
    this.selectForm = true;
    this.selectedValue = event.value;
    sessionStorage.setItem('type', this.selectedValue || ''); // ใช้ this.selectedValue แทน selectedValue
    sessionStorage.setItem('currentPage', '1');
    sessionStorage.setItem('selectForm', 'true'); // เก็บค่าว่ากำลังทำการค้นหา

    this.page = 1; // กำหนดหน้าปัจจุบันใหม่เป็น 1
    this.Imdbs = [];
    this.TitleByID = [];
    await this.loadDataAsync();
}

async destroySession(): Promise<void> {
  console.log("BACkBACK");

  sessionStorage.removeItem('search');
  sessionStorage.removeItem('currentPage');
  sessionStorage.removeItem('searchForm');
  sessionStorage.removeItem('selectForm');
  sessionStorage.removeItem('id');
  sessionStorage.removeItem('idForm');
  sessionStorage.removeItem('type'); 

  this.page = 1;
  this.Imdbs = [];
  this.TitleByID = [];
  this.searchForm = false;

  await this.loadDataAsync();
}
}
