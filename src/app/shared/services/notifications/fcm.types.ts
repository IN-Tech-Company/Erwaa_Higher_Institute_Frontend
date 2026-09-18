export type FcmPlatform = 'WEB' | 'ANDROID' | 'IOS';

export interface FcmTokenRegisterDto {
  token: string;
  platform: FcmPlatform;
  deviceName?: string;
}

export interface FcmTokenResponseDto {
  id: number;
  token: string;
  platform: FcmPlatform;
  deviceName?: string;
}
