interface ImportMetaEnv {
  /** Base URL used by the shared Axios client. */
  readonly VITE_API_BASE_URL?: string
  /** Chat endpoint used by the CodeMate chat client. */
  readonly VITE_CHAT_API_PATH?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

export declare global {
  type ApiDebug = {
    exception: string
    message: string
    file: string
    line: number
    trace: unknown[]
  }

  type ApiResponse<TMetadata = unknown> = {
    message: string
    status_code: number
    metadata?: TMetadata
    path: string
    timestamp: string
    debug?: ApiDebug
    stack?: string
  }
}
