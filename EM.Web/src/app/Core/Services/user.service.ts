import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';

export interface UserResponseDto {
  username: string;
  email: string;
  address: string;
  role: string;
  credits: number;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly baseUrl = 'http://localhost:5159/api';

  constructor(private http: HttpClient) {}

  getMe(): Observable<UserResponseDto> {
    return this.http.get<UserResponseDto>(`${this.baseUrl}/user/me`);
  }
  updateMyProfile(profile: UserResponseDto) {
    return this.http.put<UserResponseDto>(`${this.baseUrl}/user/me`, profile);
}
}
@Injectable({ providedIn: 'root' })
export class DebugTokenService {
  constructor(private auth: AuthService) {}

  logAccessToken() {
    this.auth.getAccessTokenSilently().subscribe(token => {
      console.log('ACCESS TOKEN:', token);
    });
  }
}