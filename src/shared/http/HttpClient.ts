// Re-export HTTP primitives from the legacy location to centralize imports
// under the new shared/http folder structure.
export { httpClient, ApiErrorImpl } from "../http";
export type { ApiError, HttpClientOptions } from "../http";
