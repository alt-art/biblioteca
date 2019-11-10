'use strict';
/* electron */
let {remote} = require("electron");
let win = remote.getCurrentWindow();
let Da = require("./Data");
let da = new Da();
let c = document.querySelector("div#close");
c.addEventListener("click",()=>win.close());
class View {
    view(s,d) {
        if (this.lista) this.lista.remove();
        this.lista = document.createElement("div");
        this.lista.className = "lista";
            if (d.length != 0) {
                for (let i = 0;i < d.length;i++) {
                    let up = document.createElement("div");
                    up.textContent = "Atualizar";
                    up.className = "opt";
                    up.id = d[i]._id;
                    up.addEventListener("click",()=>{
                        upd(up.id);
                    });
                    let del = document.createElement("div");
                    del.className = "opt";
                    del.textContent = "Deletar";
                    del.id = d[i]._id;
                    del.addEventListener("click",()=>{
                        dele(del.id);
                    });
                    let cont = document.createElement("div");
                    cont.className = "cont";
                    cont.appendChild(up);
                    cont.appendChild(del);
                    let menu = document.createElement("div");
                    menu.className = "menu";
                    menu.textContent = "...";
                    menu.appendChild(cont);
                    let dat = document.createElement("p");
                    dat.textContent = d[i].data;
                    let author = document.createElement("p");
                    author.textContent = d[i].author;
                    let titulo = document.createElement("h1");
                    titulo.textContent = d[i].titulo;
                    let desc = document.createElement("p");
                    desc.textContent = d[i].desc;
                    let categoria = document.createElement("div");
                    categoria.className = "categorias";
                    let ar = d[i].categoria.split(", ");
                    ar.forEach(a=>{
                        let p = document.createElement("p");
                        p.textContent = a;
                        categoria.appendChild(p);
                    });
                    let livro = document.createElement("div");
                    livro.className = "livro";
                    livro.appendChild(menu);
                    livro.appendChild(author);
                    livro.appendChild(titulo);
                    livro.appendChild(dat);
                    livro.appendChild(desc);
                    livro.appendChild(categoria);
                    this.lista.appendChild(livro);
                }
            } else {
                let dy = document.createElement("div");
                dy.textContent = "Não encontramos livros :(";
                dy.className = "fo"
                this.lista.appendChild(dy);
            }
        s.appendChild(this.lista);
    }
}

/* carregar livros */
let searchView = new View();
let listView = new View();
let azView = new View();
let az = document.querySelector("div.az");
let cont = document.querySelector("div.cont");
da.lo(false,r=>listView.view(cont,r));

function dele(i) {
    da.del(i,()=>{
        da.lo(null,r=>{
            searchView.view(listsearch,[]);
            listView.view(cont,r);
            let d = r.sort(function (a, b) {
                if (a.titulo > b.titulo) {
                  return 1;
                }
                if (a.titulo < b.titulo) {
                  return -1;
                }
                return 0;
            });
            azView.view(az,d);
        });
    });
}

function upd(id) {
    let over = document.querySelector("div.over");
    let box = document.querySelector(`div.box:nth-child(4)`);
    over.style.display = "flex";
    box.style.display = "block";
    da.lo(id,(r)=>{
        let dda = document.querySelector("input#da");
        dda.value = r[0].data;
        let aa = document.querySelector("input#aa");
        aa.value = r[0].author;
        let ta = document.querySelector("input#ta");
        ta.value = r[0].titulo;
        let sa = document.querySelector("input#sa");
        sa.value = r[0].desc;
        let ca = document.querySelector("input#ca");
        ca.value = r[0].categoria;
        let ba = document.querySelector("input#ba");
        ba.addEventListener("click",()=>{
        opned = false;
        let obj = {
            "titulo":ta.value,
            "author":aa.value,
            "desc":sa.value,
            "data":dda.value,
            "categoria":ca.value
        }
        da.upd(obj,id,()=>{
            over.style.display = "none";
            box.style.display = "none";
            clos(2);
            clos(3);
            da.lo(null,r=>listView.view(cont,r));
        });
    });
    });
    
}

let bn = document.querySelector("input#bn");
bn.addEventListener("click",()=>{
    opned = false;
    let dn = document.querySelector("input#dn");
    let an = document.querySelector("input#an");
    let tn = document.querySelector("input#tn");
    let sn = document.querySelector("input#sn");
    let cn = document.querySelector("input#cn");
    let obj = {
        "titulo":tn.value,
        "author":an.value,
        "desc":sn.value,
        "data":dn.value,
        "categoria":cn.value
    }
    da.wri(obj,()=>{
        da.lo(null,r=>listView.view(cont,r));
        let over = document.querySelector("div.over");
        let box = document.querySelector(`div.box:nth-child(1)`);
        over.style.display = "none";
        box.style.display = "none";
        dn.value = "";
        an.value = "";
        tn.value = "";
        sn.value = "";
        cn.value = "";
    });
});

let inpSearch = document.querySelector("input#search");
let listsearch = document.querySelector("div.listsearch");
inpSearch.addEventListener("keydown",()=>setTimeout(()=>search(inpSearch),100));

function search(inp) {
    let search =  inp.value;
    let searchFix = search.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
    let regs = `((\w+)?${searchFix}(\w+)?)`;
    let searchD = [];
    da.lo(null,data=>{
        data.forEach(a=>{
            let reg = new RegExp(regs,"i");
            let ar = a.categoria.split(", ");
            if(reg.test(a.titulo)||reg.test(a.desc)||reg.test(a.data)||reg.test(a.author)) {
                searchD.push(a);
            } else {
                ar.forEach(c=>{
                    if(reg.test(c)) {
                        searchD.push(a);
                    }
                });
            } 
        });
        searchView.view(listsearch,searchD);
    });
}

let opned = false
for (let i = 1; i < 4; i++) {
    let btn = document.querySelector(`div.btn:nth-child(${i})`);
    btn.addEventListener("click",()=>{
        if (!opned) {
            opned = true;
            if (i == 3) {
            da.lo(null,r=>{
                let d = r.sort(function (a, b) {
                    if (a.titulo > b.titulo) {
                      return 1;
                    }
                    if (a.titulo < b.titulo) {
                      return -1;
                    }
                    return 0;
                });
                azView.view(az,d);
            });
        }
        let over = document.querySelector("div.over");
        let box = document.querySelector(`div.box:nth-child(${i})`);
        over.style.display = "flex";
        box.style.display = "block";
        }
    });
}

for (let i = 1; i < 5; i++) {
    let close = document.querySelector(`div.box:nth-child(${i}) div.close`);
    close.addEventListener("click",()=>clos(i));
}

function clos(i) {
    let over = document.querySelector("div.over");
    let box = document.querySelector(`div.box:nth-child(${i})`);
    over.style.display = "none";
    box.style.display = "none";
    opned = false;
}