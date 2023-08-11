import { useEffect, useState } from "react";
import MapView, { Geojson, Marker } from "react-native-maps"
import axios from "axios";
import { check_filtri_vuota, filtra } from "../Utils/Filtri";
import {MAPBOX_API} from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage';



type Geojson = {
    type: 'FeatureCollection',
    features: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [number, number][], // Array di coppie di coordinate [longitudine, latitudine]
      },
    }[],
};

interface route {
    posizione_attuale: {latitudine:number,longitudine:number};
    posizione_trovata: {latitudine:number,longitudine:number};
    nome_luogo: string;
    routeVis: boolean;
    mapRef: React.RefObject<MapView>;
    invia_info: (value:any)=>void;
    filtri_attivi: any;
    rtree: any;
    invia_press:(value:any)=>void;
}



const destination:React.FC<route> = ({posizione_attuale,posizione_trovata,nome_luogo,routeVis,mapRef,invia_info,filtri_attivi,rtree,invia_press}) => {
    const [luogoCache, setLuogoCache] = useState("");
    const [popi, setPopi] = useState([]);
    const [infoMarker,setInfoMarker] = useState<any>(null);
    const [pressed,setPressed] = useState<boolean>(false);
    const [road, setRoad] = useState(false);
    const [test, setTest] = useState<any[]>([]);
    


    const [geojson, setGeojson] = useState<Geojson>({
        type: 'FeatureCollection',
        features: [{
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'LineString',
            coordinates: [],
        },
        }],
    });

    useEffect(() => {
        if(routeVis==true){
            route();
        }else{
            setTest([]);
        }
    },[routeVis])



    //Funzione che mi trova la route utilizzando Mapbox API Directions
    async function route(){
        //se non è vuoto
        if(nome_luogo!==""){
        //se non ho già fatto la richiesta (cache cosi evito di rifare la stessa chiamata)
            if(luogoCache!==nome_luogo){ 
                setLuogoCache(nome_luogo);
                //controllo che non sia in database
                try{
                    
                    //ottengo il valore in database
                    console.log("cercando nel database...",'dest'+nome_luogo)
                    const value = await AsyncStorage.getItem('dest'+nome_luogo);
                    //se non esiste il valore nel database
                    if(value===null){
                        console.log("cercando la route...")

                        const accessToken = `${MAPBOX_API}`;

                        // URL dell'API di Mapbox per il servizio di direzioni
                        const directionAPIUrl = 'https://api.mapbox.com/directions/v5/mapbox/driving';

                        // Punti di partenza e arrivo per le direzioni (coordinate latitudine e longitudine)
                        const startPoint = posizione_attuale.longitudine+","+posizione_attuale.latitudine;
                        const endPoint = posizione_trovata.longitudine+","+posizione_trovata.latitudine;
                        //console.log("startPoint= ",startPoint, "endPoint= ",endPoint)

                        // Effettua la richiesta API a Mapbox
                        try{
                        axios.get(`${directionAPIUrl}/${startPoint};${endPoint}`, {
                            params: {
                            alternatives: false,
                            geometries: 'geojson',
                            access_token: accessToken,
                            steps: true, // Ottieni le indicazioni dettagliate passo-passo
                            },
                        })
                        .then((response) => {
                            const json = response.data;
                            const routes = json.routes;
                            
                            if (routes && routes.length > 0) {
                            const routeData = routes[0];
                            const routeGeometry = routeData.geometry;
                            //console.log("routeGeometry= ",routeGeometry)
                            setPopi(routeGeometry.coordinates);
                            
                            // Costruisci l'oggetto GeoJSON FeatureCollection utilizzando la geometria del percorso
                            const geojsonCollection = {
                                type: 'FeatureCollection',
                                features: [
                                {
                                    type: 'Feature',
                                    properties: {},
                                    geometry: {
                                    type: 'LineString',
                                    coordinates: routeGeometry.coordinates,
                                    },
                                },
                                ],
                            };
                            //Non ha senso buttare in database ciò perchè la posizione attuale cambia man mano
                            //si potrebbe considerare la posizione attuale frequente
                            //saveDataToDatabase(geojsonCollection);
                            //@ts-ignore
                            setGeojson(geojsonCollection);
                            

                            //------------------------
                            let a = [];
                            a.push({latitude: posizione_attuale.latitudine, longitude: posizione_attuale.longitudine})
                            a.push({latitude: posizione_trovata.latitudine, longitude: posizione_trovata.longitudine})  
                            
                            
                            mapRef.current?.fitToCoordinates(a , {
                                edgePadding: { top: 120, right: 20, bottom: 20, left: 20 },
                                animated: true})
                                

                            }})
                        }catch(e){
                            console.log("errore con axios = ",e)
                        }
                    }else{
                        //se esiste nel database
                        console.log("Trovato!")
                        const data=JSON.parse(value);
                        setPopi(data.features[0].geometry.coordinates);
                        setGeojson(data);
                        //console.log(data.features[0].geometry.coordinates)
                        let a = [];
                            a.push({latitude: posizione_attuale.latitudine, longitude: posizione_attuale.longitudine})
                            a.push({latitude: posizione_trovata.latitudine, longitude: posizione_trovata.longitudine})  
                            
                          
                        mapRef.current?.fitToCoordinates(a , {
                            edgePadding: { top: 120, right: 20, bottom: 20, left: 20 },
                            animated: true})
                    }
                }catch(e){
                    console.log("qualcosa è andato storto con getitem")
                }
            }else{
                console.log("hai già fatto la richiesta")
                marcatori();
            }
        }else{
            console.log("non hai inserito un luogo")
        }
        setRoad(false);
    }

    /*Serviva per mettere nel database, ma effettivamente la route non è la stessa ma cambia da persona a persona in base lla sua posizione
    const saveDataToDatabase = async (data:any) => {
        try {
          console.log("inserisco nel database...")
          await AsyncStorage.setItem('dest' + nome_luogo, JSON.stringify(data));
          console.log("salvato", 'dest' + nome_luogo)
        } catch (e) {
          console.log("Errore con la sincronizzazione dei dati", e)
          // TODO: considerare quando il database è pieno
        }
      };
      */


    //Funzione che ti trova i punti vicino al segmento
    function findMarkersNearSegment(segmentStart: number[], segmentEnd: number[], distanceThreshold: number): number[] {
        const minX_ = Math.min(segmentStart[1], segmentEnd[1]) - distanceThreshold;
        const minY_ = Math.min(segmentStart[0], segmentEnd[0]) - distanceThreshold;
        const maxX_ = Math.max(segmentStart[1], segmentEnd[1]) + distanceThreshold;
        const maxY_ = Math.max(segmentStart[0], segmentEnd[0]) + distanceThreshold;
        //(12.921344,46.721185,10.920037,44.721152)

        const results = rtree.search({
        minX:minX_,
        minY:minY_,
        maxX:maxX_,
        maxY:maxY_,
        });
        return results.map((result:any) => result);
    }


    function marcatori(){
    // Calcola i marker vicino a ciascun segmento della linea
    const distanceThreshold = 0.00000010; // Ad esempio, consideriamo i marker entro 0.02 gradi (circa 2 km) dal segmento
    const arr:any[]=[];
    for (let i = 0; i < popi.length - 1; i++) {
        const segmentStart = popi[i];
        const segmentEnd = popi[i + 1];
        const markersNearSegment = findMarkersNearSegment(segmentStart, segmentEnd, distanceThreshold);
        if(markersNearSegment.length > 0){
            markersNearSegment.map((item:any) => {
            if(!arr.includes(item.data.codice)){
                arr.push(item)
            }
        })
        }
    }
    //se ci sono filtri attivi nel mentre
    if(check_filtri_vuota(filtri_attivi)==false){
        const ris=filtra(arr,filtri_attivi);
        setTest(ris)
    }else{
        setTest(arr);
        }   
    }

    /*DEBUG serve per vedere il umero dei punto della route
    useEffect(() => {
        console.log("lunghezza array test= ",test.length)
    },[test])*/


    //mi serve per triggherare a catena le route e marcatori
    useEffect(() => {
        marcatori();
    }, [popi]);
    
    useEffect(() => {
        route();
    },[road])


    //invio ad Maps.tsx le informazioni del marker premuto
    const infotab = (data:any)=>{
        //console.log("infotab",pressed)
        setPressed(!pressed); //cambio lo stato di pressed
        setInfoMarker(data);  //imposto informarker
    }

    //invio ad Maps.tsx le informazioni del marker premuto
    //quando sente che pressed cambia
    useEffect(() => {
        invia_press(pressed);
        invia_info(infoMarker);
    },[pressed]) 

    //TODO migliorabile
    function punto_finale(){
        const results = rtree.search({
            minX:posizione_trovata.latitudine,
            minY:posizione_trovata.longitudine,
            maxX:posizione_trovata.latitudine,
            maxY:posizione_trovata.longitudine,
            });
        if(results.length>0){
            return(
                <Marker
                    coordinate={{latitude: results[0].data.latitudine, longitude: results[0].data.longitudine}}
                    onPress={() => {
                        infotab(results[0].data)
                    }}
                    tracksViewChanges={false}
                    icon={results[0].data.tipologie[0].tipologia=='AUTOMAT'?require('../immagini/originali/marker-q8easy.png'):require('../immagini/originali/marker-q8.png')}
                >

                </Marker>
            )
        }else{
            return(
                <Marker coordinate={{latitude:posizione_trovata.latitudine,longitude:posizione_trovata.longitudine}}></Marker>
            )
        }
    }


    //anche qua si possono applicare i filtri
    useEffect(() => {
        if(check_filtri_vuota(filtri_attivi)==false){
            const ris=filtra(test,filtri_attivi);
            setTest(ris)
        }else{
            marcatori();
        }
    },[filtri_attivi])

    return (
        <>
        {/*MI VISUALIZZA LA ROUTE PER ARRIVARE AD UN DETERMINATO LUOGO*/}
        {routeVis &&<Geojson
            geojson={geojson}
            strokeColor="#3887be" // colore della linea
            strokeWidth={5} // spessore della linea
          />} 

        {/*MI MOSTRA I PUNTI LUNGO LA MAPPA*/}
        {routeVis && test.map((marker:any, index:number) => { 
        return(
            <Marker key={"dest"+marker.codice+index}
                coordinate={{latitude:marker.data.latitudine,longitude:marker.data.longitudine}}
                onPress={()=>{infotab(marker.data)}}
                tracksViewChanges={false}
                icon={marker.data.tipologie[0].tipologia=='AUTOMAT'?require('../immagini/originali/marker-q8easy.png'):require('../immagini/originali/marker-q8.png')}
                >
            </Marker>)})}
        {routeVis && punto_finale()}
        </>
    )
         
}

export default destination;