/** Every service rejects with this shape so screens can render errors uniformly. */
export interface ApiError {
  message: string;
  status?: number;
}
