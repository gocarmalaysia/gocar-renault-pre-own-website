
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated = signal<boolean>(false);

  constructor() {
    // Check for authentication state in local storage on service initialization
    const loggedIn = localStorage.getItem('isAuthenticated') === 'true';
    this.isAuthenticated.set(loggedIn);
  }

  login(username: string, password: string):boolean {
    // Hardcoded credentials for demonstration purposes
    if (username === 'owen' && password === '1234') {
      localStorage.setItem('isAuthenticated', 'true');
      this.isAuthenticated.set(true);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('isAuthenticated');
    this.isAuthenticated.set(false);
  }
}
