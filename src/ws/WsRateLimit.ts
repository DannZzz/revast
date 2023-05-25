import { UseGuards, applyDecorators } from '@nestjs/common'
import { WsThrottlerGuard } from './Throttle'
import { Throttle } from '@nestjs/throttler'

export function WsRateLimit(): any
export function WsRateLimit(limit: number, ttl: number): any
export function WsRateLimit(limit?: number, ttl?: number) {
  if (limit !== undefined && ttl !== undefined) {
    return applyDecorators(Throttle(limit, ttl), UseGuards(WsThrottlerGuard))
  } else {
    return UseGuards(WsThrottlerGuard)
  }
}
