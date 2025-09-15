export const COORDINATE_BOUNDS = {
  LATITUDE: { MIN: -90, MAX: 90 },
  LONGITUDE: { MIN: -180, MAX: 180 },
} as const;

export const PHONE_REGEX = /^\d{9,11}$/;
export const CCCD_REGEX = /^\d{9,12}$/;
