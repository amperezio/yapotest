import { CACHE_MANAGER, HttpService, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private http: HttpService,
  ) {}

  async getMusic(artist) {
    const cachedItem = await this.cacheManager.get(artist);

    if (cachedItem) {
      return this.cacheManager.get(artist);
    }
    const setAlbums = new Set();

    return await lastValueFrom(
      this.http.get('https://itunes.apple.com/search?term=' + artist).pipe(
        map((response) => response.data.results.slice(0, 24)),
        map((response) => {

          let cancionesArray = [];
          response.forEach((entry) => {
            setAlbums.add(entry.collectionName);
            if (entry.hasOwnProperty('trackId')){
              let cancion = {"cancion_id": entry['trackId'],
                              "nombre_album": !entry.hasOwnProperty('collectionName') ? '' :  entry['collectionName'],
                              "nombre_tema": !entry.hasOwnProperty('trackName') ? '' :  entry['trackName'],
                              "preview_url" : !entry.hasOwnProperty('previewUrl') ? '' :  entry['previewUrl'],
                              "fecha_lanzamiento": !entry.hasOwnProperty('releaseDate') ? '' :  entry['releaseDate'],
                              "precio" : {
                                "valor": !entry.hasOwnProperty('collectionPrice') ? '' :  entry['collectionPrice'],
                                "moneda": !entry.hasOwnProperty('currency') ? '' :  entry['currency']
                              }
                            }
              cancionesArray.push(cancion)
          }
          });

          const retorno = {
            ...response,
            albumes: Array.from(setAlbums),
            total_albumes: setAlbums.size,
            canciones : cancionesArray
          };

          this.cacheManager.set(artist, retorno, { ttl: 3600 });
          return retorno;
        }),
      ),
    );
  }

  async setFavoritos(
    nombre_banda: string,
    cancion_id: number,
    usuario: string,
    ranking: string,
  ) {
    let found = false;
    const respuestaBanda = this.getMusic(nombre_banda);
    respuestaBanda.then((data) => {
      if (Object.keys(data).length > 0) {
        Object.entries(data).forEach((key) => {
          if (key[1]['trackId'] && key[1]['trackId'] === cancion_id) {
            this.cacheManager.set(
              usuario + '_' + nombre_banda + '_' + cancion_id,
              ranking,
              { ttl: 3600 },
            );
            found = true;
          }
        });
      }
      return found;
    });
  }
}
