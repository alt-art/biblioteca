'use strict';
let fs = require("fs");
let home = require("os").homedir;
module.exports = class Da {
    constructor() {
        this.path = `${home}/Documents/Biblioteca/data.json`;
    }
    lo(callback) {
        fs.readFile(this.path,"utf-8",(e,r)=>{
            if (r == "") {
                callback(Array());
            } else if (r == undefined) {
                fs.mkdir(`${home}/Documents/Biblioteca`,()=>{fs.writeFile(this.path,"[]",(e)=>callback([]))});
            } else {
                callback(JSON.parse(r));
            }
        });
    }

    wri(obj,callback) {
        this.lo(r=>{
            let d = r;
            d.push(obj);
            fs.writeFile(this.path,JSON.stringify(d),(e)=>callback?callback():null);
        });
    }

    upd(obj,id,callback) {
        this.lo(r=>{
            let d = r;
            console.log(d);
            setInterval(()=>d[id] = obj,100);
            console.log(d);
            fs.writeFile(this.path,JSON.stringify(d),(e)=>callback?callback():null);
        })
    }

    del(id,callback) {
        this.lo(r=>{
            let d = r;
            d.splice(id,1);
            fs.writeFile(this.path,JSON.stringify(d),(e)=>callback?callback():null);
        })
    }
}