import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Equals,
  IsEmail,
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { ACCOUNT_DEACTIVATION_REASONS } from '../interfaces/auth.interface';

const PASSWORD_PATTERN = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const PASSWORD_MESSAGE =
  'Password must contain at least 8 characters, one uppercase letter, one number and one special character';

export class RegisterDto {
  @ApiProperty() @IsString() name: string;

  @ApiProperty() @IsEmail() email: string;

  @ApiProperty()
  @IsString()
  @Matches(PASSWORD_PATTERN, { message: PASSWORD_MESSAGE })
  password: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  @Equals(true, { message: 'Terms and conditions must be accepted' })
  termsAccepted: boolean;
}

export class LoginDto {
  @ApiProperty() @IsEmail() email: string;
  @ApiProperty() @IsString() password: string;
}

export class RequestVerificationCodeDto {
  @ApiProperty({ example: 'usuario@growly.com' })
  @IsEmail()
  email: string;
}

export class VerifyCodeDto {
  @ApiProperty({ example: 'usuario@growly.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @Matches(/^\d{6}$/, { message: 'Code must contain exactly 6 digits' })
  code: string;
}

export class ChangeBlockedPasswordDto {
  @ApiProperty() @IsString() passwordChangeToken: string;
  @ApiProperty()
  @IsString()
  @Matches(PASSWORD_PATTERN, { message: PASSWORD_MESSAGE })
  newPassword: string;
}

export class ForgotPasswordDto {
  @ApiProperty() @IsEmail() email: string;
}

export class ResetPasswordDto {
  @ApiProperty() @IsString() resetToken: string;
  @ApiProperty()
  @IsString()
  @Matches(PASSWORD_PATTERN, { message: PASSWORD_MESSAGE })
  newPassword: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  refreshToken: string;
}

export class LogoutDto extends RefreshTokenDto {}

export class UpdateProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  @MaxLength(254)
  email?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() currentPassword?: string;
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(PASSWORD_PATTERN, { message: PASSWORD_MESSAGE })
  newPassword?: string;
}

export class DeactivateAccountDto {
  @ApiProperty({ enum: ACCOUNT_DEACTIVATION_REASONS })
  @IsIn(ACCOUNT_DEACTIVATION_REASONS)
  reason: (typeof ACCOUNT_DEACTIVATION_REASONS)[number];

  @ApiPropertyOptional()
  @ValidateIf(
    (dto: DeactivateAccountDto) =>
      dto.reason === 'other' || dto.comment !== undefined,
  )
  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  @MinLength(10)
  comment?: string;

  @ApiProperty()
  @IsString()
  currentPassword: string;
}
