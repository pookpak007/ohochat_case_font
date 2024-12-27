import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CallApiService {
  
  constructor(
    private http:HttpClient
  ) { }

  getCase(url:string,auth:string):Observable<any>{
    const headers ={
      'Content-Type':'application/json',
      Authorization:'Bearer '+auth
    }
    return this.http.get<any>(url,{headers});
  }
}
