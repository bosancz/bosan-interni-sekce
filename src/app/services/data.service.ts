import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { Album, AlbumPhoto } from "../schema/album";
import { Camp } from "../schema/camp";
import { Contact } from "../schema/contact";
import { Event } from "../schema/event";
import { WebConfig } from "../schema/webconfig";

function toParams(options){
	if(!options) return "";
	
	var params = Object.keys(options)
		.map(key => {
			if(typeof options[key] === "object") return Object.keys(options[key]).map(key2 => key + "[" + key2 + "]=" + options[key][key2]).join("&");
			else return key + "=" + options[key];
		})
		.join("&");
	
	return "?" + params;
}

@Injectable()
export class DataService {
  
  root:string = environment.api_root;
  
  config:Promise<WebConfig>;
	
	constructor(private http: HttpClient) {  }
  
  getAlbums(options?):any{
		return this.http.get<any>(this.root + "/albums" + toParams(options)).toPromise();
	}
  
  getAlbumsYears(){
    return this.http.get<any>(this.root + "/albums/years").toPromise();
  }
  
  getAlbum(albumId:string, options?):Promise<Album>{
		return this.http.get<Album>(this.root + "/albums/" + albumId + toParams(options)).toPromise();
	}
  
  updateAlbum(albumId:string, albumData:any):Promise<string>{
    return this.http.patch(this.root + "/albums/" + albumId, albumData, {responseType: "text"}).toPromise();
  }
  
  getAlbumPhotos(albumId:string,options?:any):Promise<AlbumPhoto[]>{
    return this.http.get<AlbumPhoto[]>(this.root + "/albums/" + albumId + "/photos").toPromise();
  }
    
  updateAlbumPhotos(albumId:string,photosData:any):Promise<string>{
    return this.http.patch(this.root + "/albums/" + albumId + "/photos", photosData, {responseType:"text"}).toPromise();
  }
  
  createAlbumPhoto(albumId:string,photoData):Observable<HttpEvent<string>>{
    return this.http.post(this.root + "/albums/" + albumId + "/photos",photoData,{observe: 'events',reportProgress:true, responseType:"text"});
  }
  
  deleteAlbumPhoto(albumId:string,photoId:string):Promise<string>{
    return this.http.delete(this.root + "/albums/" + albumId + "/photos/" + photoId,{responseType:"text"}).toPromise();
  }
  
  getCamps(){
    return this.http.get<Camp[]>(this.root + "/camps").toPromise();
  }
  
  getCamp(id:string){
    return this.http.get<Camp>(this.root + "/camps/" + id).toPromise();
  }
  
  updateCamp(id:string,campData:Camp):Promise<string>{
    return this.http.patch(this.root + "/camps/" + id, campData, {responseType:"text"}).toPromise();
  }
  
  getConfig(update?:boolean){
    if(update || !this.config) this.config = this.http.get<WebConfig>(this.root + "/config").toPromise();
    return this.config;
  }
  
  saveConfig(config:WebConfig):Promise<string>{
    return this.http.put(this.root + "/config", config, { responseType: "text" }).toPromise();
  }
  
  getContacts(options?:any):Promise<Contact[]>{
    return this.http.get<Contact[]>(this.root + "/contacts" + toParams(options)).toPromise();
  }
  
  getEvents(options?:any):Promise<Event[]>{
    return this.http.get<Event[]>(this.root + "/events" + toParams(options)).toPromise();
  }
  
  getUpcomingEvents():Promise<Event[]>{
    return this.http.get<Event[]>(this.root + "/events/upcoming").toPromise();
  }
  
  getEvent(eventId:string):Promise<Event>{
    return this.http.get<Event>(this.root + "/events/" + eventId).toPromise();
  }
  
  createEvent(eventData:any):Promise<Event>{
    return this.http.post<Event>(this.root + "/events",eventData).toPromise();
  }
  
  updateEvent(eventId:string,eventData:any):Promise<string>{
    return this.http.patch(this.root + "/events/" + eventId,eventData, {responseType:"text"}).toPromise();
  }
  
  deleteEvent(eventId:string):Promise<string>{
    return this.http.delete(this.root + "/events/" + eventId, {responseType:"text"}).toPromise();
  }
  
	getGroups(options?:any):Promise<any>{
		return this.http.get<any>(this.root + "/groups" + toParams(options)).toPromise();
	}
  
  getMembers(options?:any):Promise<any>{
    return this.http.get<any>(this.root + "/members" + toParams(options)).toPromise();
  }
}