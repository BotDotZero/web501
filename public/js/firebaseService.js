import { BaseAPI } from './baseAPI.js';
export class FireBaseService extends BaseAPI {

   getAll = function (endPoint) {
      return this._get(endPoint, '');
   }
   getWithOpt = function (endPoint, option) {
      return this._get(endPoint, option);
   }
   add = function (endPoint, data) {
      return this._post(endPoint, data);
   }
   edit = function (endPoint, id, data) {
      return this._edit(endPoint, id, data);
   }
   delete = function (endPoint, id) {
      return this._del(endPoint, id);
   }
}