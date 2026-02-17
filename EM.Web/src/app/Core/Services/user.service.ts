import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';

export interface UserResponseDto {
  user_Id: number;
  username: string;
  email: string;
  address: string;
  role: string;
  credits: number;
}
export interface UpdateProfileDto {
  user_Id: number;
  username: string;
  email: string;
  address: string;
  role: string;
  credits: number;
}
export interface CreateProfileDto {
  username: string;
  password: string;
  email: string;
  address: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly baseUrl = 'http://localhost:5159/api';


  private userSubject = new BehaviorSubject<UserResponseDto | null>(null);
  user$ = this.userSubject.asObservable();
  constructor(private http: HttpClient) {}


  getMe(): Observable<UserResponseDto> {
    return this.http.get<UserResponseDto>(`${this.baseUrl}/user/me`).pipe(
      tap(user => this.userSubject.next(user))
    );
  }
  updateMyProfile(profile: UserResponseDto) {
    return this.http.put<UserResponseDto>(`${this.baseUrl}/user/me`, profile);
}
loadUser() {
  this.getMe().subscribe();
}
get currentUser(): UserResponseDto | null {
  return this.userSubject.value;
}
listUsers(): Observable<UserResponseDto[]> {
  return this.http.get<UserResponseDto[]>(`${this.baseUrl}/admin/users`);
}
  updateProfile(profile: UpdateProfileDto) {
    return this.http.put<UpdateProfileDto>(`${this.baseUrl}/admin/update-profile`, profile);
}
createProfile(profile: CreateProfileDto) {
  return this.http.put<CreateProfileDto>(`${this.baseUrl}/admin/create-profile`, profile)
}
deleteProfile(id: number) {
  return this.http.delete<number>(`${this.baseUrl}/admin/delete/${id}`)
}
}

@Injectable({ providedIn: 'root' })
export class DebugTokenService {
  constructor(private auth: AuthService) {}
}