import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import {
  AuthenticatedUserDto,
  LoginResponseDto,
} from './dto/login-response.dto';

@Injectable()
export class AuthService {
  private readonly demoUser: AuthenticatedUserDto & { password: string } = {
    username: 'admin',
    displayName: 'Admin User',
    password: 'password123',
  };

  login(loginDto: LoginDto): LoginResponseDto {
    const { username, password } = loginDto;
    if (
      username !== this.demoUser.username ||
      password !== this.demoUser.password
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      accessToken: this.generateDemoToken(this.demoUser.username),
      tokenType: 'Bearer',
      user: {
        username: this.demoUser.username,
        displayName: this.demoUser.displayName,
      },
    };
  }

  private generateDemoToken(username: string): string {
    const payload = {
      sub: username,
      iat: Date.now(),
    };
    return Buffer.from(JSON.stringify(payload)).toString('base64url');
  }

  validateToken(token: string): AuthenticatedUserDto | null {
    try {
      const decoded = JSON.parse(
        Buffer.from(token, 'base64url').toString('utf-8'),
      );

      if (!decoded.sub || typeof decoded.sub !== 'string') {
        return null;
      }

      // For demo purposes, we only have one user
      if (decoded.sub === this.demoUser.username) {
        return {
          username: this.demoUser.username,
          displayName: this.demoUser.displayName,
        };
      }

      return null;
    } catch (error) {
      return null;
    }
  }
}
