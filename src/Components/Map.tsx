import MapView from 'react-native-maps';
import  { PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, TouchableOpacity, Image, View, Dimensions } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {Marker} from 'react-native-maps';
import Marcatori_visibili from './Marcatori_visibili';
import SearchBarCustom from './SearchBarCustom';
import InfoView from './InfoView';
import Destination from './Destination';
import { RtreeContext,SuperclusterContext } from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';




Geolocation.setRNConfiguration({skipPermissionRequests: false, authorizationLevel: 'whenInUse',locationProvider: 'auto'});


type Region = {
  latitude: number,
  longitude: number,
  latitudeDelta: number,
  longitudeDelta: number,
}

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;



const Mappa = () => {
  const mapRef = useRef<MapView>(null);

  //Fuzioni per la posizione
  const [position, setPosition] = useState<{latitudine:number,longitudine:number}>({ latitudine: 0, longitudine: 0 });
  const [posTrovata, setPosTrovata] = useState<{latitudine:number,longitudine:number}>({ latitudine: 0, longitudine: 0 });
  const [luogo, setLuogo] = useState("");
  const [road, setRoad] = useState(false);
  const [arrfiltri, setArrFiltri] = useState<string[]>([]);
  const [info, setInfo] = useState<any>(null);
  const stree = useContext(RtreeContext);
  const supercluster = useContext(SuperclusterContext);
  const [back, setBack] = useState(false);
  const [currentRegion, setCurrentRegion] = useState<Region>({latitude: 0, longitude: 0, latitudeDelta: 0.015, longitudeDelta: 0.0121});
  const [area, setArea] = useState<any>()


  //Funzione per cercare una posizione, ottengo le coordinate e mi sposto
  async function cerca(posizione: string) {
    console.log("posizione= ",posizione);
    if(posizione!=""){
          setLuogo(posizione);
          try{
            console.log("cercando nel database...")
            //controllo se ho gia salvata la pozione
            const value = await AsyncStorage.getItem(posizione);
            //se non ho la posizione salvata
            if(value === null) {
              try{
                console.log("cerco",posizione)
                const dati= (await axios.get("https://geocode.maps.co/search?q="+posizione+"&format=json")).data
                console.log("data=",dati[0])
                moveInPos(dati[0]);
                setPosTrovata({ latitudine: parseFloat(dati[0].lat), longitudine: parseFloat(dati[0].lon) });

                try{
                  //salvo la posizione
                  console.log("inserisco nel database...")
                  await AsyncStorage.setItem(posizione, JSON.stringify(dati[0]));
                  console.log("salvato",posizione)
                }catch(e){
                  console.log("Errore con la sincronizzazione dei dati",e)
                  //TODO considerare quando il database è pieno
                }
              }catch(e){
                console.log("Errore dopo aver fetchato i dati",e)
              }
            }else{
              //se ho la posizione salvata
              console.log("Trovato!")
              const data=JSON.parse(value);
              //console.log("data=",data)
              moveInPos(data);
              setPosTrovata({ latitudine: parseFloat(data.lat), longitudine: parseFloat(data.lon) });
            }
          }catch(e){
            console.log("Qualcosa è andato storto=",e)
          }
          console.log("Ricerca effettuata con successo!")
    }else{
      console.log("non puoi cercare il nulla")
    }
  }



  //Funzione per spostarsi in una posizione, ottengo le coordinate e mi sposto
  function moveInPos(posizione: any) {
    //console.log("posizione",posizione)
    const northeastLat = parseFloat(posizione.boundingbox[1]);
    const southwestLat = parseFloat(posizione.boundingbox[0]);
    const latDelta = northeastLat - southwestLat;
    const lngDelta = latDelta * ASPECT_RATIO;
    //console.log("delta calc ",latDelta, lngDelta);
    let reg={
      latitude: parseFloat(posizione.lat),
      longitude: parseFloat(posizione.lon),
      latitudeDelta: latDelta,
      longitudeDelta: lngDelta,
    }
    if (mapRef.current) {
      console.log("sposto in pos=",reg)
      mapRef.current.animateToRegion(reg, 1000);
      //Manda a infoView le info per mostrarsi e permette di muoversi poi
      const dati={
        "localita":posizione.display_name,
        "codice":posizione.place_id,
        "indirizzo":"",
        "prodotti":[],
      }
      setTimeout(() => {setInfo(dati),setInfoPremuto(!info_premuto)}, 2000);
    }
  }


  //Simile a sposta, duplicato migliorabile
  function SpostaPos(){
    getCurrentLocation();
    let regione = {
      latitude: position.latitudine,
      longitude: position.longitudine,
      latitudeDelta: 0.015,
      longitudeDelta: 0.015,
    };
    if(mapRef.current){
      mapRef.current.animateToRegion(regione, 1000);
    }
  }  

  //funzione che mi ritorna le informazioni necessarie dello schermo
  const handleRegionChangeComplete = async (region:Region) => {
    if(ready){
      const boundaries = await mapRef.current?.getMapBoundaries();
      setArea(boundaries);
    }
    setCurrentRegion(region);
  };

  //Mi dice se la mappa è carica cosi evito di fare inutili azioni
  const[ready, setReady] = useState(false);
  const checkReady = () => {
    setReady(true);
  }


  //Funzione che mi permette di ottenere la posizione corrente dato il gps
  //ATTENZIONE: in teoria c'è da rivedere react-native-maps perchè forse ha la funzione
  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (posizione) => {
        const { latitude, longitude } = posizione.coords;
        //console.log('Latitudine:', latitude);
        //console.log('Longitudine:', longitude);
        setPosition({ latitudine: latitude, longitudine: longitude });
      },
      (error) => {
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  //serve per utilizzare una sola volta getCurrentLocation() e all'apertura dell'app
  useEffect(() => {
    //console.log('useEffect ran');
    getCurrentLocation();
  }, []);

  function filtri(value:any): void {
    setArrFiltri(value);  
  }


  function ricevi_info(value:any): void {
    setInfo(value);  
  }

  //mi dice se ho premuto un marker cosi da utilizzarlo ogni volta
  const [info_premuto, setInfoPremuto] = useState(false);
  function premuto(value:boolean): void {
    setInfoPremuto(value);
  }

  //imposto la freccia per il back in SearchBarCustom.tsx e aggiorno Destination.tsx
  function ricevi_back(){
    setRoad(!road);
    setBack(false)
  }


  //Invia a Destination.tsx le informazioni per la strada e imposta gia la freccia per tornare indietro
  function invia_road_benza(info:any){
    console.log("info",info)
    if(info!=null || luogo!=""){
      setLuogo(info.localita)
      if(info.indirizzo!==""){
        setPosTrovata({latitudine:info.latitudine,longitudine:info.longitudine});
      }
      setBack(true);
      setRoad(!road);
    }
  }

  return (
  <View style={styles.container}>
    <MapView
      showsMyLocationButton={false}
      toolbarEnabled={false}
      ref={mapRef}
      loadingEnabled={true}
      loadingIndicatorColor='blue' //opzionale
      loadingBackgroundColor='black' //opzionale
      provider={PROVIDER_GOOGLE} // remove if not using Google Maps
      style={styles.map}
      region={{
        latitude: position.latitudine,
        longitude: position.longitudine,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      }}
      //uso checkready quando la mappa è completamente carica cosi funziona il rendering dei marcatori
      onMapLoaded={checkReady}
      //quando completa la visualizzazione di un area, aggiorna l'area visibile.
      onRegionChangeComplete={handleRegionChangeComplete}>
        <Marker id={"sei_qua"}
          coordinate={{ latitude: position.latitudine, longitude: position.longitudine }}>
          <Image style={{width: 20, height: 20}} source={require('../immagini/right-arrow.png')} />
        </Marker>
        {/*MI INDICA LA ROUTE*/}
        {<Destination posizione_attuale={position} posizione_trovata={posTrovata} nome_luogo={luogo} 
          routeVis={road} mapRef={mapRef} invia_info={ricevi_info} filtri_attivi={arrfiltri} rtree={stree}
          invia_press={premuto}
        />}

        {/*MI INDICA I MARKER*/}
        {!road && <Marcatori_visibili region={currentRegion} area_schermo={area} pronto={ready} filtri={arrfiltri} mapRef={mapRef}
          invia_info={ricevi_info} rtree={stree} supaclusta={supercluster} invia_premuto={premuto}/>}
    </MapView>
    <SearchBarCustom onSearch={cerca} applica_filtri={filtri} indietro={back} invia_back={ricevi_back}/>
    <View style={{ flex: 1, justifyContent: 'flex-end' }}>

      {/* Bottone "compass" */}
      <TouchableOpacity style={styles.button} onPress={SpostaPos}>
        <Image style={styles.image_style} source={require('../immagini/compass.png')} />
      </TouchableOpacity>
    </View>
    <InfoView dati={info} invia_route={invia_road_benza} ricevi_press={back} infopremuto={info_premuto}/>
    {/*currentRegion && (
        <View style={{ position: 'absolute', top: 120, left: 170 }}>
          <Text style={{color:"red"}}>Area visibile:</Text>
          <Text style={{color:"black"}}>Latitude: {currentRegion.latitude.toString()}</Text>
          <Text style={{color:"black"}}>Longitude: {currentRegion.longitude.toString()}</Text>
          <Text style={{color:"black"}}>Latitude delta: {currentRegion.latitudeDelta.toString()}</Text>
          <Text style={{color:"black"}}>Longitude delta: {currentRegion.longitudeDelta.toString()}</Text>
        </View>
      )*/}
  </View>
  );

};

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
    ...StyleSheet.absoluteFillObject,
  },
  button: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    borderRadius: 100,
    padding: 8,
    backgroundColor: 'white',
    elevation:10,
  },
  image_style: {
    width: 40,
    height: 40,
  },
  container: {
    flex: 1,
  },
});

export default Mappa;
