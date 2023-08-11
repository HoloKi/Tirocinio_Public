export function isPresent_servizi(array: any[], values: any[]) {
    for(let i=0;i<array.length;i++){
        for(let j=0;j<values.length;j++){
            if(array[i]===values[j].codice){
                return true;
            }
        }
    }
    return false;
}
 

export function isPresent_pagamenti(array: any[], values: any[]) {
    for(let i=0;i<array.length;i++){
        for(let j=0;j<values.length;j++){
            if(array[i]===values[j].codiceMetodo){
                return true;
            }
        }
    }
    return false;
}
 

export function isPresent_prodotto(array: any[], values: any[]) {
    for(let i=0;i<array.length;i++){
        for(let j=0;j<values.length;j++){
            if(array[i]===values[j].codiceProdotto){
                return true;
            }
        }
    }
    return false;
}

let automat = ["AUTOMAT"]
let self =["FLEX ISOLA","FLEX FULL","AUTM SELF PRE PAYMENT","SELF POST PAYMENT","SELF SERVICE ISOLA","SELFPRE PAYMENT","SELF SERVICE POST PAYMENT","MIXT SELF-AUTO"]
let servito = ["FLEX FULL SERV", "SCONTO SERVITO","FULL SERVICE","FLEX ISOLA","FLEX FULL","SERV FULL SERVICE","MIXT SELF-AUTO"]
//---------------------------------------

let bar = ["BA","BP","BPAP","TRBA","TRBP"]
let ristorante = ["TF","RI"]
let shop = ["CS","MKAA","MKAB","MKAC","MKBB"]
let lavaggio = ["LDV","CW","MCWP","MCWT","TECW","TRCW","SL","TEPZ","TRSL","JW","MJW3","MJW5","TEJW","AR","JA","NA","JN"]
let gommista = ["RG","TRRG"]
let officina = ["OF"]
let tntpoint = ["TNT"]
let ricaricaelettrica = ["EL","CE","EQ8"]
let svolta = ["SVL"]

//-----------------------------------------
let adblue=["300991","300793"]
let metanocng=["300204","302043","301793"]
let metanolng=["302042"]
let hvo=["302182"]
let gpl=["300054"]
let hiperformdiesel = ["301362"]
let hiperformottani = ["301403","301404"]

//-----------------------------------------
let cartissima =["OTR"]
let recard=["BUO"]
let paypal = ["PAY","PP"]
let dkv=["DKV"]
let uta=["UTA"]
let euroshell = ["ESH"]
let telepass = ["TLP"]
let tamoil = ["TAM"]
let logpay  = ["LOG","LPAY"]
let iqcard = ["IQC"]
let eurowag = ["EWG"]

 //Funzione che mi controlla se la lista dei filtri è vuota
    //@return true se è vuota, false altrimenti
    export function check_filtri_vuota(filtri_attivi:any){
        const valoriFiltri = Object.values<string[]>(filtri_attivi);
        return valoriFiltri.every((elemento: string[]) => elemento.length === 0);
    }

//funzione che filtra in base ai filtri attivi
    //@param items: array di ciò che lo schermo vede
    //dovrebbere prendere il dizionario di filtri da filtri_attivi
    export function filtra(items:any[],filtri_attivi:any){
        var ris=items;
        //console.log(ris)
        //controlliamo che tutti gli array siano vuoti, dunque non ha filtri attivi, visualizza tutto
        if(check_filtri_vuota(filtri_attivi)==false){ 
            //rimuovo quelli che non sono dentro l'array di filtri (tipologia punti vendita)
            //controllo su tipologia punti vendita
            filtri_attivi.tipologia_punti_vendita.map((elemento:string) => {
                if(elemento=="24hx7"){
                    ris = ris.filter((item:any) => automat.includes(item.data.tipologie[0].tipologia));
                }
                if(elemento=="Self"){
                    ris = ris.filter((item:any) => self.includes(item.data.tipologie[0].tipologia));
                }
                if(elemento=="Servito"){
                    ris = ris.filter((item:any) => servito.includes(item.data.tipologie[0].tipologia));
                }
                if(elemento=="Autostradale"){
                    ris = ris.filter((item:any) => item.data.flagAds=="Y");
                }
                
            });
            //console.log("test2",filtri_attivi.servizi)
            filtri_attivi.servizi.map((elemento:string) => {

                if(elemento=="Bar"){
                    ris = ris.filter((item:any) => isPresent_servizi(bar,item.data.servizi));
                }
                if(elemento=="Ristorante"){
                    ris = ris.filter((item:any) => isPresent_servizi(ristorante,item.data.servizi));
                }
                if(elemento=="Shop"){
                    ris = ris.filter((item:any) => isPresent_servizi(shop,item.data.servizi));
                }
                if(elemento=="Officina"){
                    ris = ris.filter((item:any) => isPresent_servizi(officina,item.data.servizi));
                }
                if(elemento=="Lavaggio"){
                    ris = ris.filter((item:any) => isPresent_servizi(lavaggio,item.data.servizi));
                }
                if(elemento=="Gommista"){
                    ris = ris.filter((item:any) => isPresent_servizi(gommista,item.data.servizi));
                }
                if(elemento=="TNT Point"){
                    ris = ris.filter((item:any) => isPresent_servizi(tntpoint,item.data.servizi));
                }
                if(elemento=="Ricarica Elettrica"){
                    ris = ris.filter((item:any) => isPresent_servizi(ricaricaelettrica,item.data.servizi));
                }
                if(elemento=="Concept Store Svolta"){
                    ris = ris.filter((item:any) => isPresent_servizi(svolta,item.data.servizi));
                }
            });
            //controllo su tipologia carburante
            //console.log("test3",filtri_attivi.prodotti)
            filtri_attivi.prodotti.map((elemento:string) => {
                if(elemento=="AdBlue")
                    ris = ris.filter((item:any) => isPresent_prodotto(adblue,item.data.prodotti));
                if(elemento=="Metano CNG")
                    ris = ris.filter((item:any) => isPresent_prodotto(metanocng,item.data.prodotti));
                if(elemento=="Metano LNG")
                    ris = ris.filter((item:any) => isPresent_prodotto(metanolng,item.data.prodotti));
                if(elemento=="GPL")
                    ris = ris.filter((item:any) => isPresent_prodotto(gpl,item.data.prodotti));
                if(elemento=="Q8 HVO+")
                    ris = ris.filter((item:any) => isPresent_prodotto(hvo,item.data.prodotti));
                if(elemento=="Q8 Hi Perform Diese")
                    ris = ris.filter((item:any) => isPresent_prodotto(hiperformdiesel,item.data.prodotti));
                if(elemento=="Q8 Hi Perform 100 ottani")
                    ris = ris.filter((item:any) => isPresent_prodotto(hiperformottani,item.data.prodotti));
            })
            //controllo sui metodi di pagamento
            //console.log("test4",filtri_attivi.metodi_pagamento)
            filtri_attivi.metodi_pagamento.map((elemento:string) => {
                if(elemento=="CartissimaQ8")
                    ris = ris.filter((item:any) => isPresent_pagamenti(cartissima,item.data.pagamenti));
                if(elemento=="RecardQ8")
                    ris = ris.filter((item:any) => isPresent_pagamenti(recard,item.data.pagamenti));
                if(elemento=="PayPal")
                    ris = ris.filter((item:any) => isPresent_pagamenti(paypal,item.data.pagamenti));
                if(elemento=="DKV")
                    ris = ris.filter((item:any) => isPresent_pagamenti(dkv,item.data.pagamenti));
                if(elemento=="UTA")
                    ris = ris.filter((item:any) => isPresent_pagamenti(uta,item.data.pagamenti));
                if(elemento=="euroShell Card")
                    ris = ris.filter((item:any) => isPresent_pagamenti(euroshell,item.data.pagamenti));
                if(elemento=="Telepass Pay")
                    ris = ris.filter((item:any) => isPresent_pagamenti(telepass,item.data.pagamenti));
                if(elemento=="mycard Tamoil")
                    ris = ris.filter((item:any) => isPresent_pagamenti(tamoil,item.data.pagamenti));
                if(elemento=="LOGPAY")
                    ris = ris.filter((item:any) => isPresent_pagamenti(logpay,item.data.pagamenti));
                if(elemento=="IQCard")
                    ris = ris.filter((item:any) => isPresent_pagamenti(iqcard,item.data.pagamenti));
                if(elemento=="EuroWag")
                    ris = ris.filter((item:any) => isPresent_pagamenti(eurowag,item.data.pagamenti));
                if(elemento=="Pagamenti digitali con app")
                    ris= ris.filter((item:any) => item.data.digitali.length>0);
                if(elemento=="Click&Fuel")
                    ris= ris.filter((item:any) => item.data.sblocco.length>0);
            })

        }
        return ris;
    }
