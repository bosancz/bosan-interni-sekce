import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import * as URITemplate from "urijs/src/URITemplate";

import { environment } from "environments/environment";

type HttpObserve = 'body' | 'events' | 'response';

export interface HalLinkText {
  href:string;
  type:'text';
  method?:"GET"|"POST"|"PUT"|"PATCH"|"DELETE";
}

export interface HalLinkJson {
  href:string;
  type:'json';
  method?:"GET"|"POST"|"PUT"|"PATCH"|"DELETE";
}

type HalLink = HalLinkText|HalLinkJson;

export interface HalResource {
  _links?:{
    "self":HalLinkText|HalLinkJson,
    [name:string]:HalLinkText|HalLinkJson
  }
}

export class ApiError extends Error{
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  root = environment.apiRoot;

  resources:Promise<{[name:string]:HalResource}>;

  constructor(private http:HttpClient) {
    this.loadResources();
  }

  loadResources(){
    this.resources = this.http.get<any>(this.root).toPromise().then(api => api._links);
  }
  
  async path2link(pathObj:any):Promise<HalLink>{
    
    if(!pathObj) throw new ApiError("Missing link");
    
    var path:any;
    var expand:any;
    
    if(Array.isArray(pathObj) && pathObj.length <= 2) [path,expand] = pathObj;
    else if(Array.isArray(pathObj) && pathObj.length > 2){ path = pathObj.shift(); expand = pathObj; }
    else path = pathObj;
    
    var link;
    
    if(typeof path === "string" && path.match(/^[a-z]+(\:[a-z]+)?$/i)){
      const resources = await this.resources;
    
      if(!resources[path]) throw new ApiError(`Resource ${path} does not exist on the API endpoint ${this.root}.`);
      
      link = resources[path];
    }
    else if(typeof path === "string"){
      link = { href: path };
    }
    else if(path.href){
      link = path;
    }
    else{
      throw new ApiError("Invalid link: " + pathObj);
    }
    
    if(typeof expand === "object") link.href = URITemplate(link.href).expand(key => expand[key]);
    if(typeof expand === "string" || typeof expand === "number") link.href = URITemplate(link.href).expand(key => expand);
    if(Array.isArray(expand)){ var i = 0; link.href = URITemplate(link.href).expand(key => { i++; return expand[i - 1]; }); }
    
    if(!link.href.match(/^[a-z]+\:\/\//)) link.href = this.root + link.href;
    
    return link;
      
  }

  async get<T>(path:any,params?:any):Promise<T>{
    const link = await this.path2link(path);
    return this.http.get<T>(link.href, { params: this.toParams(params) }).toPromise();
  }
  
  async getAsText(path:any,params?:any):Promise<string>{
    const link = await this.path2link(path);
    return this.http.get(link.href, { params: this.toParams(params), responseType: "text" }).toPromise();
  }
  
  async post(path:any,data?:any):Promise<HttpResponse<string>>{
    const link = await this.path2link(path);
    return this.http.post(link.href, data, { observe: "response", responseType: "text" }).toPromise();
  }
  
  async put(path:any,data?:any):Promise<HttpResponse<string>>{
    const link = await this.path2link(path);
    return this.http.put(link.href, data, { observe: "response", responseType: "text" }).toPromise();
  }
  
  async patch(path:any,data?:any):Promise<HttpResponse<string>>{
    const link = await this.path2link(path);
    return this.http.patch(link.href, data, { observe: "response", responseType: "text" }).toPromise();
  }
  
  async delete(path:any,expand?:any):Promise<HttpResponse<string>>{
    const link = await this.path2link(path);
    return this.http.delete(link.href, { observe: "response", responseType: "text" }).toPromise();
  }  

  private setParam(params:HttpParams,name:string,value:any){
    if(value === undefined) return params;

    if(value === null) return params.set(name,null);

    if(typeof value !== "object") return params.set(name,value);

    if(Array.isArray(value)){
      value.forEach((item,i) => params = this.setParam(params,name + "[" + i + "]",item));
      return params;
    }

    Object.entries(value).forEach(entry => params = this.setParam(params,name + "[" + entry[0] + "]",entry[1]));
    return params;
  }

  private toParams(options:{[s:string]:any}):HttpParams{
    let params = new HttpParams();

    if(options) Object.entries(options).forEach(entry => params = this.setParam(params,entry[0],entry[1]));

    return params;
  }
}
