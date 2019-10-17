'use strict';
/* electron */
let {remote} = require("electron");
let win = remote.getCurrentWindow();
let Da = require("./Data");
let d = new Da();
let c = document.querySelector("div#close");
c.addEventListener("click",()=>win.close());
/* strutura dos dados */
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
                    up.addEventListener("click",()=>{
                        upd(i);
                    });
                    let del = document.createElement("div");
                    del.className = "opt";
                    del.textContent = "Deletar";
                    del.addEventListener("click",()=>{
                        dele(i);
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
d.lo(r=>listView.view(cont,r));

function dele(i) {
    d.del(i,()=>{
        d.lo(r=>{
            searchView.view(listsearch,[]);
            listView.view(cont,r)
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

function upd(i) {
    let over = document.querySelector("div.over");
    let box = document.querySelector(`div.box:nth-child(4)`);
    over.style.display = "flex";
    box.style.display = "block";
    d.lo(r =>{
        let da = document.querySelector("input#da");
        da.value = r[i].data;
        let aa = document.querySelector("input#aa");
        aa.value = r[i].author;
        let ta = document.querySelector("input#ta");
        ta.value = r[i].titulo;
        let sa = document.querySelector("input#sa");
        sa.value = r[i].desc;
        let ca = document.querySelector("input#ca");
        ca.value = r[i].categoria;
        let ba = document.querySelector("input#ba");
        ba.addEventListener("click",()=>{
            opned = false;
            d.upd({"titulo":ta.value,"author":aa.value,"desc":sa.value,"data":da.value,"categoria":ca.value},i,()=>{
                over.style.display = "none";
                box.style.display = "none";
                clos(2);
                clos(3);
                d.lo(r=>listView.view(cont,r));
            });
        });
    })
}

let bn = document.querySelector("input#bn");
bn.addEventListener("click",()=>{
    opned = false;
    let dn = document.querySelector("input#dn");
    let an = document.querySelector("input#an");
    let tn = document.querySelector("input#tn");
    let sn = document.querySelector("input#sn");
    let cn = document.querySelector("input#cn");
    d.wri({"titulo":tn.value,"author":an.value,"desc":sn.value,"data":dn.value,"categoria":cn.value},()=>{
        d.lo(r=>listView.view(cont,r));
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
})


/* Pesquisar*/
let inpSearch = document.querySelector("input#search");
let listsearch = document.querySelector("div.listsearch");
inpSearch.addEventListener("keydown",()=>setTimeout(()=>search(inpSearch),100));

function search(inp) {
    let search =  inp.value;
    let searchFix = search.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
    let regs = `((\w+)?${searchFix}(\w+)?)`;
    let searchD = [];
    d.lo(data=>{
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
                })
            } 
        });
        searchView.view(listsearch,searchD);
    });
}

/* open */
let opned = false
for (let i = 1; i < 4; i++) {
    let btn = document.querySelector(`div.btn:nth-child(${i})`);
    btn.addEventListener("click",()=>{
        if (!opned) {
            opned = true;
            if (i == 3) {
            d.lo(r=>{
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
    })
}

for (let i = 1; i < 5; i++) {
    let close = document.querySelector(`div.box:nth-child(${i}) div.close`);
    close.addEventListener("click",()=>clos(i))
}

function clos(i) {
    let over = document.querySelector("div.over");
    let box = document.querySelector(`div.box:nth-child(${i})`);
    over.style.display = "none";
    box.style.display = "none";
    opned = false;
}