'use strict';
let fs = require("fs");
let home = require("os").homedir;
module.exports = class Da {
    constructor() {
        this.path = `${home}\\Documents\\Biblioteca\\data.json`;
    }
    lo(callback) {
        fs.readFile(this.path,"utf-8",(e,r)=>{
            if (r == "") {
                callback(Array());
            } else if (r == undefined) {
                fs.mkdir(`${home}/Documents/Biblioteca`,()=>{fs.writeFile(this.path,"[]",()=>callback([]))});
            } else {
                callback(JSON.parse(r));
            }
        });
    }

    wri(obj,callback) {
        this.lo(r=>{
            let dw = r;
            dw.push(obj);
            fs.writeFile(this.path,JSON.stringify(dw),()=>callback?callback():null);
        });
    }

    upd(obj,id,callback) {
        this.lo(r=>{ 
            let du = r;
            du[id] = obj;
            setTimeout(()=>{
                fs.writeFile(this.path,JSON.stringify(du),()=>callback?callback():null);
            },500);
        })
    }

    del(id,callback) {
        this.lo(r=>{
            let de = r;
            de.splice(id,1);
            fs.writeFile(this.path,JSON.stringify(de),()=>callback?callback():null);
        })
    }
}