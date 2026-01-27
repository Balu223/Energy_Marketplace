import { ChangeDetectionStrategy, Component, OnInit, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [AsyncPipe],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AppComponent implements OnInit {
  message: string = '✅ Connected!';
  weatherData$!: Observable<any[]>;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.weatherData$ = this.http.get<any[]>('http://localhost:5159/weatherforecast');
  }
}
