import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Невірна електронна пошта або пароль');
    }
    const isPasswordValid = await this.comparePasswords(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Невірна електронна пошта або пароль');
    }
    const tokens = await this.generateTokens(user.id, user.email);
    return tokens;
  }

  async register(registerDto: RegisterDto): Promise<{ accessToken: string; refreshToken: string }> {
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new UnauthorizedException('Користувач з такою електронною поштою вже існує');
    }
    const user = await this.userService.create(registerDto.email, registerDto.password);
    const tokens = await this.generateTokens(user.id, user.email);
    return tokens;
  }

  async refreshTokens(userId: string): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Невірний токен');
    }
    const tokens = await this.generateTokens(user.id, user.email);
    return tokens;
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      // Перевірка валідності refresh токена
      await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch (error) {
      console.log('Invalid refresh token during logout:', error.message);
    }
  }

  async getCurrentUser(userId: string): Promise<{ id: string; email: string }> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Користувача не знайдено');
    }
    return {
      id: user.id,
      email: user.email
    };
  }

  private async generateTokens(userId: string, email: string): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        { secret: process.env.JWT_SECRET, expiresIn: process.env.JWT_EXPIRES_IN },
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        { secret: process.env.JWT_REFRESH_SECRET, expiresIn: process.env.JWT_REFRESH_EXPIRES_IN },
      ),
    ]);
    return { accessToken, refreshToken };
  }

  private async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
} 