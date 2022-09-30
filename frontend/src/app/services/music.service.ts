import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  constructor(protected http: HttpClient) {
  }

  searchTracks(data): Observable<any> {
    return this.http.get(`${environment.api}/api/searchTracks/${data.nombre_banda}`);
  }

}
