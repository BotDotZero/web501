import {Config} from './config.js'
export class BaseAPI {
   URL = Config.URL;
   
   _get = (endPoint, option) => {
      return fetch(`${this.URL}/${endPoint}/.json${option}`)
   }
   _post = (endPoint, dataPost) =>{
      return fetch(`${this.URL}/${endPoint}/.json`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(dataPost),
      })
   }
   _edit = (endPoint, id, dataPut) => {
      return fetch(`${this.URL}/${endPoint}/${id}/.json`, {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(dataPut),
      })
   }
   _del = (endPoint, id) => {
      return fetch(`${this.URL}/${endPoint}/${id}/.json`, {
         method: 'DELETE',
         headers: {
            'Content-Type': 'application/json',
         },
      })
   }
}