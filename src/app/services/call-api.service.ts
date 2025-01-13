import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class CallApiService {
  
  constructor(
    private http:HttpClient,
    private toast:ToastrService
  ) { }

  getCase(url:string,auth:string):Observable<any>{
    const headers ={
      'Content-Type':'application/json',
      Authorization:'Bearer '+auth
    }
    return this.http.get<any>(url,{headers});
  }

  GetSChoolByLike(body:any[]):Observable<any>{
    const headers={
      'Content-Type':'application/json'
    }
    return this.http.post<any>(environment.baseUrl+environment.GetSChoolByLike,body,{headers,observe:'response'}).pipe(
      catchError(error =>{
        console.error(error);
        this.toast.error(error);
        throw error
      })
    );
  }
}
