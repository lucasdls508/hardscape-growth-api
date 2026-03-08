import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";

@Injectable()
export class CatalogResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        ok: true,
        message: this.getMessage(context),
        ...data,
      }))
    );
  }

  private getMessage(context: ExecutionContext): string {
    const req = context.switchToHttp().getRequest();
    switch (req.method) {
      case "POST":
        return "Catalogs Created successfully";
      case "PATCH":
        return "Catalog Updated successfully";
      case "DELETE":
        return "Catalog Deleted successfully";
      case "GET":
      default:
        return "Request successful";
    }
  }
}
