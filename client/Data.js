'use strict';
var {remote} = require('electron');
const userData = remote.app.getPath('userData');
let path = `${userData}\\db\\livros.db`;
let Datastore = require("nedb");
let db = new Datastore({filename: path, autoload:true});
module.exports = class {
    lo(id,callback) {
        db.find(id?{_id:id}:{},(err,res)=>{
            callback(res);
        });
    }

    wri(obj,callback) {
        db.insert(obj,()=>callback?callback():null);
    }

    upd(obj,id,callback) {
        db.update({_id: id},obj,{},()=>callback?callback():null);
    }

    del(id,callback) {
        db.remove({_id: id},()=>callback?callback():null);
    }
}