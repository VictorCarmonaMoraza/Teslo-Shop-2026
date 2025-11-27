// import { Injectable } from '@angular/core';
// import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
// import { Observable } from 'rxjs';
// @Injectable()
// export class YourInterceptor implements HttpInterceptor {
//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     return next.handle(req);
//   }
// }



import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";



export function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  console.log(req.url);
  return next(req);
}
