import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule ,FormBuilder,FormGroup} from '@angular/forms';
import { CallApiService } from './services/call-api.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    ReactiveFormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'case';

  //ตัวแปร
  fg_url!:FormGroup;
  data:any[]=[];
  constructor(
    private fb_url: FormBuilder,
    private api:CallApiService
  ){}

  ngOnInit(): void {
    this.fg_url = this.fb_url.group({
      url:['https://api.oho.chat/latest/case?$skip=0&$limit=20&$populate[0][path]=assignee_member.member_id&$populate[0][select][]=display_name&$populate[0][select][]=role&$populate[0][select][]=image_url&$populate[1][path]=involved_members&$populate[1][populate][0]=member_id&$populate[2][path]=tags_migrate_objectid&$populate[3][path]=contact_id&$populate[3][select][]=_id&$populate[3][select][]=display_name&$populate[3][select][]=profile_picture_url&$sort[short_id]=-1&channel_id[]=66a84cfbd9f220fd1866066a'],
      aut:['eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJzdWIiOiI2NmE4OTA3ZjA3YzkwNWU5MTZhNTYxMTIiLCJpYXQiOjE3MzUyMjM3MDEsImV4cCI6MTczNzgxNTcwMSwiYXVkIjoiaHR0cHM6Ly9vaG8uY2hhdCIsImlzcyI6ImZlYXRoZXJzIiwianRpIjoibWVtYmVyIn0.9FVcx_50xYwIfuEWPZwGZLMBhPHrXZi4GDa8fum9tc4']
    })
  }

  loadData(){
    this.api.getCase(this.fg_url.value.url,this.fg_url.value.aut).subscribe(
      res =>{
        console.log(res);
        this.data = res.data
        console.log(this.data)
      }
    );
  }

}
