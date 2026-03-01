import type { Array } from "./utils";

/** 基础响应（status、errCode、message）。Base response (status, errCode, message). */
interface BaseResponse {
  /** 状态码。Status code. */
  status?: number;
  /** 错误码。Error code. */
  errCode?: string;
  /** 消息。Message. */
  message?: string;
}

/** 列表元信息（如 total）。List meta (e.g. total). */
interface ListMeta {
  /** 总数。Total count. */
  total?: number;
}

/** 带 data 与可选 meta 的响应。Response with data and optional meta. */
interface DataResponse<T, M = Record<string, unknown>> extends BaseResponse {
  /** 数据。Data payload. */
  data: T;
  /** 元信息。Meta. */
  meta?: M;
}

/** 数字 offset 分页参数（用于 makeCursorFetchFunction 等）。Number offset pagination params; used by makeCursorFetchFunction etc. */
interface OffsetLimitNumber {
  /** 偏移量。Offset. */
  offset: number;
  /** 每页条数。Limit. */
  limit: number;
}

/** 字符串游标分页参数（用于 makeStringCursorFetchFunction 等）。String cursor pagination params; used by makeStringCursorFetchFunction etc. */
interface OffsetLimitString {
  /** 游标（字符串）。Cursor (string). */
  offset: string;
  /** 每页条数。Limit. */
  limit: number;
}

/** 列表 + 总数：items + total（用于 offset/limit 分页的返回）。List with total count; used as offset/limit response. */
interface ListDTOWithTotalNumber<T> {
  /** 列表项。Items. */
  items: Array<T>;
  /** 总数。Total count. */
  total: number;
}

/** 字符串游标列表：items + nextCursor（用于 nextCursor 为 string 的 API）。List with string nextCursor. */
interface ListDTOWithNextCursor<T> {
  /** 列表项。Items. */
  items: Array<T>;
  /** 下一页游标。Next cursor. */
  nextCursor: string;
}

/** 分页响应（data、total、page、pageSize）。Paginated response (data, total, page, pageSize). */
interface PaginatedResponse<T> {
  /** 数据列表。Data array. */
  data: Array<T>;
  /** 总数。Total count. */
  total: number;
  /** 当前页。Current page. */
  page: number;
  /** 每页条数。Page size. */
  pageSize: number;
}

/** 错误响应。Error response. */
interface ApiErrorBody {
  /** 状态码。Status code. */
  status?: number;
  /** 错误码。Error code. */
  errCode?: string;
  /** 消息。Message. */
  message?: string;
  /** 详情。Details. */
  details?: unknown;
  /** 追踪 ID。Trace ID. */
  traceId?: string;
}

export type {
  BaseResponse,
  DataResponse,
  ListDTOWithNextCursor,
  ListDTOWithTotalNumber,
  ListMeta,
  OffsetLimitNumber,
  OffsetLimitString,
  PaginatedResponse,
  ApiErrorBody,
};
