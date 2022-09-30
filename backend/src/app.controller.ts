import {
  Body,
  CacheKey,
  CacheTTL,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('searchTracks/:track')
  async searchTracks(@Param('track') track) {
    return this.appService.getMusic(track);
  }

  @Post('favoritos')
  async favoritos(
    @Body('nombre_banda') nombre_banda: string,
    @Body('cancion_id') cancion_id: number,
    @Body('usuario') usuario: string,
    @Body('ranking') ranking: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.appService.setFavoritos(
      nombre_banda,
      cancion_id,
      usuario,
      ranking,
    );
  }
  @Get('health')
  save(@Res() response: Response) {
    response.status(HttpStatus.OK).send('OK ');
  }
}
