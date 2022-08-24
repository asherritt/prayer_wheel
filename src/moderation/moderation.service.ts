import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { Prayer } from 'src/prayers/prayer.entity';
import * as FormData from 'form-data';

@Injectable()
export class ModerationService {
  constructor(private readonly httpService: HttpService) {}

  moderatePrayer(prayer: Prayer): Observable<AxiosResponse<any>> {
    // TODO Remove this. Moderation will happen in Lambda
    const d = new FormData();

    // Submit all the possible text of the prayer to moderate it for violations
    d.append(
      'text',
      `${prayer.prayerText} ${prayer.displayName} ${prayer.loacation}`,
    );
    d.append('lang', 'en');
    d.append('mode', 'standard');
    d.append('api_secret', 'LfvaFNFF2XuUzijH7FEs');
    d.append('api_user', '1775677700');

    return this.httpService.post(
      'https://api.sightengine.com/1.0/text/check.json',
      d,
    );
  }
}
