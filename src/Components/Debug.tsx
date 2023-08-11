import { useState } from "react";
import { Text, View } from "react-native";


/**
 *  //Funzione per cercare una posizione, ottengo le coordinate e mi sposto
  async function cerca(posizione: string) {
    console.log("posizione= ",posizione);
    if(posizione!=""){
      try {
        // Controlla se i dati sono già presenti nella cache
        const cachedData = await AsyncStorage.getItem(posizione);
        if (cachedData === null) {
          //se i dati non ci sono
          const response = await fetch("https://geocode.maps.co/search?q="+posizione+"&format=json");
          const risp = await response.json();
          //inserisco come cache
          await AsyncStorage.setItem(posizione, JSON.stringify(risp[0]));
          console.log('Dati inseriti',JSON.stringify(risp[0]));
          moveInPos(risp[0]);
        } else {
          //se i dati ci sono
          const placeData = JSON.parse(cachedData);
          console.log('Dati del posto recuperati dalla cache:', placeData);
          //[south Latitude, north Latitude, west Longitude, east Longitude]
          moveInPos(placeData);
        }
      } catch (error) {
        console.log('Errore durante il recupero dei dati del posto:', error);
      }
    }else{
      console.log("non puoi cercare il nulla")
    }
  }


  //Funzione per spostarsi in una posizione, ottengo le coordinate e mi sposto
  function moveInPos(posizione: any) {
    const northeastLat = parseFloat(posizione.boundingbox[1]);
          const southwestLat = parseFloat(posizione.boundingbox[0]);
          const latDelta = northeastLat - southwestLat;
          const lngDelta = latDelta * ASPECT_RATIO;
          console.log("delta calc ",latDelta, lngDelta);
          let reg={
            latitude: parseFloat(posizione.lat),
            longitude: parseFloat(posizione.lon),
            latitudeDelta: latDelta,
            longitudeDelta: lngDelta,
          }
          if (mapRef.current) {
            console.log("sposto in pos=",reg)
            mapRef.current.animateToRegion(reg, 1000);
          }
  }
 */


  // @ts-ignore
            /*
            const result = rtree.search({
                minX: area_schermo.southWest.latitude,
                minY: area_schermo.southWest.longitude,
                maxX: area_schermo.northEast.latitude,
                maxY: area_schermo.northEast.longitude,
            });
            //result.map(gionny => console.log("found =",gionny.data.indirizzo," in ",gionny.data.latitudine,gionny.data.longitudine));
            var res = result;
            console.log("totale=",result.length)
            //----------------FILTRO--------------------------
            
            if(result){
                res = filtra(result);
            }
            console.log("filtrato=",res.length)
            */

  /*
  //salvo i dati nel rtree all'inizio
    function salvo_dati(){
        const rtree = new RBush();
        // @ts-ignore
        for (let i = 0; i < database.length; i++) {
            // @ts-ignore
            const { latitudine, longitudine } = database[i];
            // Crea il bounding box utilizzando le coordinate
            const boundingBox = {
              minX: latitudine,
              minY: longitudine,
              maxX: latitudine,
              maxY: longitudine,
              // @ts-ignore
              data: database[i], // Associa il dizionario all'oggetto bounding box
            };
            // Inserisci il bounding box nell'albero R-tree
            rtree.insert(boundingBox);
          };
            setRtree(rtree);
    }
  */


  /*
  import React, { useEffect } from "react";
import { useState } from "react";
import database from "../data/full_dati.json"
import  MapView, { Marker } from "react-native-maps";
import RBush from 'rbush';
import { Image, View } from "react-native";
import { isPresent_servizi, isPresent_pagamenti, isPresent_prodotto } from "./filtri";
import Supercluster, { PointFeature } from 'supercluster';
import { Text } from "@rneui/themed";


type Region = {
    latitude: number,
    longitude: number,
    latitudeDelta: number,
    longitudeDelta: number,
}

interface MarcatoriVisibiliProps {
    region: Region;
    area_schermo: any;
    pronto: boolean;
    arrayz: string[];
    mapRef: React.RefObject<MapView>;
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



const Marcatori_visibili:React.FC<MarcatoriVisibiliProps> = ({ region,area_schermo,pronto,arrayz,mapRef }) => {
    const [arr,setArr] = useState<any>([]);
    const [rtree,setRtree] = useState<any>([]);
    const [filtri_attivi,setFiltri_attivi] = useState<any>([]);
    const [markers, setMarkers] = useState([]);
    const [cluster, setCluster] = useState([]);
    const [supaclusta, setSupaclusta] = useState<any>(new Supercluster());


    //salvo i dati nel rtree all'inizio
    function salvo_dati(){
        const rtree = new RBush();
        // @ts-ignore
        for (let i = 0; i < database.length; i++) {
            // @ts-ignore
            const { latitudine, longitudine } = database[i];
            // Crea il bounding box utilizzando le coordinate
            const boundingBox = {
              minX: latitudine,
              minY: longitudine,
              maxX: latitudine,
              maxY: longitudine,
              // @ts-ignore
              data: database[i], // Associa il dizionario all'oggetto bounding box
            };
            // Inserisci il bounding box nell'albero R-tree
            rtree.insert(boundingBox);
          };
            setRtree(rtree);
    }




    //funzione che filtra in base ai filtri attivi
    //@param items: array di ciò che lo schermo vede
    //dovrebbere prendere il dizionario di filtri da filtri_attivi
    function filtra(items:any[]){
        var ris=items;
        //controlliamo che tutti gli array siano vuoti, dunque non ha filtri attivi, visualizza tutto
        if(check_filtri_vuota()==false){ 
            //console.log("test1",filtri_attivi.tipologia_punti_vendita)
            //rimuovo quelli che non sono dentro l'array di filtri (tipologia punti vendita)
            //controllo su tipologia punti vendita
            filtri_attivi.tipologia_punti_vendita.map((elemento:string) => {
                if(elemento=="24hx7"){
                    ris = ris.filter((item:any) => automat.includes(item.properties.data.tipologie[0].tipologia));
                }
                if(elemento=="Self"){
                    ris = ris.filter((item:any) => self.includes(item.properties.data.tipologie[0].tipologia));
                }
                if(elemento=="Servito"){
                    ris = ris.filter((item:any) => servito.includes(item.properties.data.tipologie[0].tipologia));
                }
                if(elemento=="Autostradale"){
                    ris = ris.filter((item:any) => item.properties.data.flagAds=="Y");
                }
                
            });
            //console.log("test2",filtri_attivi.servizi)
            filtri_attivi.servizi.map((elemento:string) => {

                if(elemento=="Bar"){
                    ris = ris.filter((item:any) => isPresent_servizi(bar,item.properties.data.servizi));
                }
                if(elemento=="Ristorante"){
                    ris = ris.filter((item:any) => isPresent_servizi(ristorante,item.properties.data.servizi));
                }
                if(elemento=="Shop"){
                    ris = ris.filter((item:any) => isPresent_servizi(shop,item.properties.data.servizi));
                }
                if(elemento=="Officina"){
                    ris = ris.filter((item:any) => isPresent_servizi(officina,item.properties.data.servizi));
                }
                if(elemento=="Lavaggio"){
                    ris = ris.filter((item:any) => isPresent_servizi(lavaggio,item.properties.data.servizi));
                }
                if(elemento=="Gommista"){
                    ris = ris.filter((item:any) => isPresent_servizi(gommista,item.properties.data.servizi));
                }
                if(elemento=="TNT Point"){
                    ris = ris.filter((item:any) => isPresent_servizi(tntpoint,item.properties.data.servizi));
                }
                if(elemento=="Ricarica Elettrica"){
                    ris = ris.filter((item:any) => isPresent_servizi(ricaricaelettrica,item.properties.data.servizi));
                }
                if(elemento=="Concept Store Svolta"){
                    ris = ris.filter((item:any) => isPresent_servizi(svolta,item.properties.data.servizi));
                }
            });
            //controllo su tipologia carburante
            //console.log("test3",filtri_attivi.prodotti)
            filtri_attivi.prodotti.map((elemento:string) => {
                if(elemento=="AdBlue")
                    ris = ris.filter((item:any) => isPresent_prodotto(adblue,item.properties.data.prodotti));
                if(elemento=="Metano CNG")
                    ris = ris.filter((item:any) => isPresent_prodotto(metanocng,item.properties.data.prodotti));
                if(elemento=="Metano LNG")
                    ris = ris.filter((item:any) => isPresent_prodotto(metanolng,item.properties.data.prodotti));
                if(elemento=="GPL")
                    ris = ris.filter((item:any) => isPresent_prodotto(gpl,item.properties.data.prodotti));
                if(elemento=="Q8 HVO+")
                    ris = ris.filter((item:any) => isPresent_prodotto(hvo,item.properties.data.prodotti));
                if(elemento=="Q8 Hi Perform Diese")
                    ris = ris.filter((item:any) => isPresent_prodotto(hiperformdiesel,item.properties.data.prodotti));
                if(elemento=="Q8 Hi Perform 100 ottani")
                    ris = ris.filter((item:any) => isPresent_prodotto(hiperformottani,item.properties.data.prodotti));
            })
            //controllo sui metodi di pagamento
            //console.log("test4",filtri_attivi.metodi_pagamento)
            filtri_attivi.metodi_pagamento.map((elemento:string) => {
                if(elemento=="CartissimaQ8")
                    ris = ris.filter((item:any) => isPresent_pagamenti(cartissima,item.properties.data.pagamenti));
                if(elemento=="RecardQ8")
                    ris = ris.filter((item:any) => isPresent_pagamenti(recard,item.properties.data.pagamenti));
                if(elemento=="PayPal")
                    ris = ris.filter((item:any) => isPresent_pagamenti(paypal,item.properties.data.pagamenti));
                if(elemento=="DKV")
                    ris = ris.filter((item:any) => isPresent_pagamenti(dkv,item.properties.data.pagamenti));
                if(elemento=="UTA")
                    ris = ris.filter((item:any) => isPresent_pagamenti(uta,item.properties.data.pagamenti));
                if(elemento=="euroShell Card")
                    ris = ris.filter((item:any) => isPresent_pagamenti(euroshell,item.properties.data.pagamenti));
                if(elemento=="Telepass Pay")
                    ris = ris.filter((item:any) => isPresent_pagamenti(telepass,item.properties.data.pagamenti));
                if(elemento=="mycard Tamoil")
                    ris = ris.filter((item:any) => isPresent_pagamenti(tamoil,item.properties.data.pagamenti));
                if(elemento=="LOGPAY")
                    ris = ris.filter((item:any) => isPresent_pagamenti(logpay,item.properties.data.pagamenti));
                if(elemento=="IQCard")
                    ris = ris.filter((item:any) => isPresent_pagamenti(iqcard,item.properties.data.pagamenti));
                if(elemento=="EuroWag")
                    ris = ris.filter((item:any) => isPresent_pagamenti(eurowag,item.properties.data.pagamenti));
                if(elemento=="Pagamenti digitali con app")
                    ris= ris.filter((item:any) => item.properties.data.digitali.length>0);
                if(elemento=="Click&Fuel")
                    ris= ris.filter((item:any) => item.properties.data.sblocco.length>0);
            })

        }
        return ris;
    }


    function crea_cluster(){
        console.log("clusterizzo")
        const startTime = performance.now();

        const clusterOptions = { radius: 100, maxZoom: 10,
            reduce: (accumulated:any, props:any) => {
                // Inizializza le proprietà del cluster
                if (!accumulated.localita) {
                accumulated.localita = {};
                }
                if (!accumulated.provincia) {
                accumulated.provincia = {};
                }
            
                // Raggruppa i punti per località
                const localita = props.localita;
                if (!accumulated.localita[localita]) {
                accumulated.localita[localita] = {
                    count: 0,
                    provincia: {},
                };
                }
                accumulated.localita[localita].count++;
            
                // Raggruppa i punti per provincia
                const provincia = props.provincia;
                if (!accumulated.provincia[provincia]) {
                accumulated.provincia[provincia] = {
                    count: 0,
                };
                }
                accumulated.provincia[provincia].count++;
            
                // Somma il numero di punti nel cluster
                accumulated.cluster_count++;
            
                return accumulated;
            },
        };
        const supercluster = new Supercluster(clusterOptions);

        const dataArray = Object.values(database);
        //console.log("dataarray=",dataArray[0])
        const clusterData: PointFeature<any>[] = dataArray.map((marker:any) => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [marker.longitudine, marker.latitudine] },
            properties: { data: marker},
            }));

        supercluster.load(clusterData);
        setSupaclusta(supercluster);
        console.log(supaclusta)
        const zoom = Math.round(Math.log(360 / region.latitudeDelta) / Math.LN2);
        console.log("zoom=",zoom)
        
        const clusters = supercluster.getClusters(
        [area_schermo?.southWest.longitude || 0, area_schermo?.southWest.latitude || 0, area_schermo?.northEast.longitude || 0, area_schermo?.northEast.latitude || 0],
        zoom);

        
        setSupaclusta(supercluster);
        //setMarkers(database);
        setArr(clusters);
        //console.log(clusters)
        const arrayCluster:any=[]
        const non_cluster:any=[]
        //controllo quali sono cluster e li metto in setCluster
        clusters.map((cluster:any) => {
            if(cluster.properties.cluster){
                arrayCluster.push(cluster);
                //console.log("cluster_info=",cluster.properties)
            }else{
                non_cluster.push(cluster);
                //console.log("non_cluster_info=",cluster.properties)
            }
        })
        console.log("nclusters = ",arrayCluster.length)
        setCluster(arrayCluster);
        setMarkers(non_cluster);
        
        const endTime = performance.now(); // Ottieni il timestamp di fine
        const executionTime = endTime - startTime; // Calcola il tempo di esecuzione in millisecondi
        console.log('Tempo di esecuzione:', executionTime, 'ms');

    }



        
    //renderizza una sola volta
    useEffect(() => {
        //salvo_dati();
        crea_cluster();
    }, []);

    useEffect(() => { 
        setFiltri_attivi(arrayz);
    },[arrayz]);
    
    //renderizza ogni volta che mi muovo
    useEffect(() => {
        if(pronto){
            renderMap();
        }

    }, [filtri_attivi,region]);



    //Funzione che mi controlla se la lista dei filtri è vuota
    //@return true se è vuota, false altrimenti
    function check_filtri_vuota(){
        const valoriFiltri = Object.values<string[]>(filtri_attivi);
        return valoriFiltri.every((elemento: string[]) => elemento.length === 0);
    }



  
    //TODO -- da migliorare l'efficienza
    //Funzione che mi aggiorna ogni volta la mappa con i punti al suo interno
    function renderMap(){
        console.log("rendermap")
        if(area_schermo!=undefined){
            //OTTENGO I PUNTI VISIBILI NELLO SCHERMO
            /*
            const result = rtree.search({
                minX: area_schermo.southWest.latitude,
                minY: area_schermo.southWest.longitude,
                maxX: area_schermo.northEast.latitude,
                maxY: area_schermo.northEast.longitude,
            });
            console.log(result)
            crea_cluster(result);
            
        
            const zoom = Math.round(Math.log(360 / region.latitudeDelta) / Math.LN2);
            const clusters = supaclusta.getClusters(
                [area_schermo.southWest.longitude, area_schermo.southWest.latitude, area_schermo.northEast.longitude, area_schermo.northEast.latitude],
                zoom);
            const arrayCluster:any=[]
            const non_cluster:any=[]
            clusters.map((cluster:any) => {
                if(cluster.properties.cluster){
                    arrayCluster.push(cluster);
                    //console.log("cluster_info=",cluster.properties)
                }else{
                    non_cluster.push(cluster);
                    //console.log("non_cluster_info=",cluster.properties)
                }
            })
            console.log("nclusters = ",arrayCluster.length)
            console.log("nmarkers = ",non_cluster.length)
            setCluster(arrayCluster);
            filtra(non_cluster);
            setMarkers(non_cluster);
                
            }else{
                console.log("render "+area_schermo);
            }
        }
    
    
        //@ts-ignore
        const CustomMarker = ({ number }) => {
            return (
              <View style={{ alignItems: 'center' }}>
                <Image source={require('../immagini/circle.png')} style={{ width: 50, height: 50 }} />
                <Text style={{ position: 'absolute',top:'30%' }}>{number}</Text>
              </View>
            );
          };
    
    
        //TODO ANIMAZIONE CLICCANDO CLUSTER
        //@ts-ignore
        function clusterzoom({id}){
            var a:any[] = []
            //console.log("id=",id)
            const c=supaclusta.getLeaves(id,100)
            c.map((cluster:any) => {
                let test={
                    latitude:cluster.geometry.coordinates[1],
                    longitude:cluster.geometry.coordinates[0],
                }
                a.push(test)
            })
    
            var b:any[] = []
            const pippo = supaclusta.getChildren(id);
            //console.log("pippo=",pippo)
            if(pippo.length>0){
                pippo.map((cluster:any) => {
                    let test={
                        latitude:cluster.geometry.coordinates[1],
                        longitude:cluster.geometry.coordinates[0],
                    }
                    b.push(test)
                })
            }
            //TODO - rivedere questo punto che non mi renderizza i sottocluster
            console.log("--------------------fittocoordinates-------------------")
            
            mapRef.current?.fitToCoordinates(a.concat(b) , {
                edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
                animated: true})
        }
    
        return (
            //<Marker key={arr.codice} coordinate={{latitude:arr.latitudine,longitude:arr.longitudine}} title={arr.indirizzo} />
            <>
          {cluster.map((cluster:any, index:number) => (
            <Marker
              onPress={() => {clusterzoom(cluster)}}
              key={cluster.id} // Assicurati che ogni cluster abbia un ID univoco
              tracksViewChanges={false}
              coordinate={{
                latitude: cluster.geometry.coordinates[1],
                longitude: cluster.geometry.coordinates[0],
              }}
              title={`Cluster (${cluster.properties.point_count} punti)`}
            >
                <CustomMarker number={cluster.properties.point_count} />
            </Marker>
          ))}
    
          {markers.map((marker:any, index:number) => (
            <Marker
                tracksViewChanges={false}
              key={(marker.properties.data.codice)} 
              coordinate={{ latitude: (marker.geometry.coordinates[1]), longitude: (marker.geometry.coordinates[0]) }}
            />))}
        </>
        )
    }
    export default Marcatori_visibili;
  
  */



    {/*<Modal
    visible={pressed}
    animationType="slide"
    transparent={true}
  >
   <View style={styles.modalContainer}>
          <TouchableOpacity onPress={() => setPressed(false)} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Chiudi</Text>
          </TouchableOpacity>
          <View style={styles.modalContent}>
            <ScrollView>
              {data?.localita && <Text style={{color:'blue',fontSize:22,fontWeight:'bold'}}>{data.localita}</Text>}
              {data?.codice && <Text style={{color:'blue',fontSize:18,fontWeight:'bold'}}>{"PV: "+data.codice+" - "+data?.indirizzo}</Text>}
              <View style={{marginTop:15}}>
                <Text style={{color:'blue',fontSize:18,fontWeight:'bold'}}>{"Servizi disponibili"}</Text>
                {data?.servizi && data?.servizi.map((item:any) => {
                  if (item.codice !== 'DPAY') {
                    return <Text key={item.codice} style={{color:'blue', fontSize:16}}>{item.descrizione}</Text>;
                  }
                  return null;
                })}
              </View>
              <View style={{marginTop:15}}>
                <Text style={{color:'blue',fontSize:18,fontWeight:'bold'}}>{"Metodi di pagamento tradizionali"}</Text>
                {data?.pagamenti && data?.pagamenti.map((item:any)=><Text key={item.codiceMetodo} style={{color:'blue',fontSize:16}}>{item.descrizione}</Text>)}
              </View>
              <View style={{marginTop:15}}>
                <Text style={{color:'blue',fontSize:18,fontWeight:'bold'}}>{"Metodi di pagamento digitali"}</Text>
                {data?.digitali && data?.digitali.map((item:any,index:number)=><Text key={index} style={{color:'blue',fontSize:16}}>{item.descrizione}</Text>)}
              </View>
              <View style={{marginTop:15}}>
                <Text style={{color:'blue',fontSize:18,fontWeight:'bold'}}>{"ClubQ8 Click&Fuel"}</Text>
                {data?.sblocco && data?.sblocco.map((item:any,index:number)=><Text key={index+99} style={{color:'blue',fontSize:16}}>{item.descrizione}</Text>)}
              </View>
            </ScrollView>

          </View>
        </View>
              </Modal>*/}


        /*
        useEffect(() => {
        if(dati!=null){
            console.log("ho i dati!")
            setData(dati);
            setPressed(true); 
            console.log(dati)
            if(dati.indirizzo!=""){ //se ho cercato per esempio milano
            setNo_vendita(true)
            }else{
            setNo_vendita(false)
            }
        }
        }, [dati]);*/

const Debug = () => {  

}
export default Debug