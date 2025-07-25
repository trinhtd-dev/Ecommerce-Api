import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

export interface ClassConstructor {
  new (...args: any[]): any;
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

@Injectable()
export class SerializeInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private readonly dto: ClassConstructor) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((responseFromService) => {
        // Đổi tên `data` thành `responseFromService` cho rõ nghĩa
        const dataToSerialize = responseFromService.data || responseFromService; // Ưu tiên lấy từ thuộc tính 'data' nếu có
        return {
          statusCode: context.switchToHttp().getResponse().statusCode,
          message: responseFromService.message || 'success',
          data: plainToInstance(this.dto, dataToSerialize, {
            excludeExtraneousValues: true,
          }),
        };
      })
    );
  }
}
