import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { Prayer } from 'src/prayers/prayer.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ModerationService {
  constructor(
    private readonly httpService: HttpService,
    private config: ConfigService,
  ) {}

  moderatePrayer(prayer: Prayer): Observable<AxiosResponse<Prayer[]>> {
    const data = new FormData();
    data.append('text', 'Contact rick(at)gmail(dot)com to have s_*_x');
    data.append('lang', 'en');
    data.append('opt_countries', 'us,gb,fr');
    data.append('mode', 'standard');
    data.append('api_user', this.config.get<string>('MOD_API_USER'));
    data.append('api_secret', this.config.get<string>('MOD_API_SECRET'));

    return this.httpService.post(
      'https://api.sightengine.com/1.0/text/check.json',
      {
        text: prayer.prayerText,
      },
    );
  }
}
