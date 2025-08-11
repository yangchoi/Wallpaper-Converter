export type TargetPlatform = 'mac' | 'windows-webm' | 'windows-mp4';

export interface ConvertOptions {
  target: TargetPlatform; // required
  width?: number; // optional, e.g., 1920
  height?: number; // optional, e.g., 1080
  fps?: number; // optional, e.g., 30 or 60
}
