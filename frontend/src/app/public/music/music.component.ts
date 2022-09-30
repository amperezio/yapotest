import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';
import {MusicService} from '../../services/music.service';

@Component({
  selector: 'app-login',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.css', './../public.component.css']
})
export class MusicComponent implements OnInit {
  songs: any[] = [];
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: MusicService
  ) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nombre_banda: ''
    });
  }

  submit(): void {
    this.authService.searchTracks(this.form.getRawValue()).subscribe((data: any) => {

      this.songs = [];
      Object.entries(data).forEach((key) => {

        // tslint:disable-next-line:prefer-const

        let song = {
          nombre_cancion :  !key[1].hasOwnProperty('trackName') ? '' : key[1]['trackName'],
          nombre_album : !key[1].hasOwnProperty('collectionName') ? '' : key[1]['collectionName'],
          url_preview : !key[1].hasOwnProperty('trackViewUrl') ? '' : key[1]['trackViewUrl'],
          precio : !key[1].hasOwnProperty('trackPrice') ? '' : key[1]['trackPrice'],
          fecha_de_lanzamiento : !key[1].hasOwnProperty('releaseDate') ? '' : key[1]['releaseDate']
        }

        this.songs.push(song);

      });
    });


  }
}
