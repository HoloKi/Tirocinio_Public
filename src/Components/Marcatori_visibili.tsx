import React, { useEffect } from "react";
import { useState } from "react";
import  MapView, { Marker } from "react-native-maps";
import { View, Text } from "react-native";
import { filtra } from "../Utils/Filtri";
import { PointFeature } from 'supercluster';


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
    filtri: string[];
    mapRef: React.RefObject<MapView>;
    invia_info: (value:any)=>void;
    rtree: any;
    supaclusta: any;
    invia_premuto: (value:boolean)=>void;
}



const Marcatori_visibili:React.FC<MarcatoriVisibiliProps> = ({ region,area_schermo,pronto,filtri,mapRef,invia_info,rtree,supaclusta,invia_premuto }) => {
    const [markers, setMarkers] = useState([]);
    const [cluster, setCluster] = useState([]);
    const [infoMarker,setInfoMarker] = useState<any>(null);
    const [pressed,setPressed] = useState<boolean>(false);

    


    
    //renderizza ogni volta che mi muovo
    useEffect(() => {
        if(pronto){
            renderMap();
        }
    }, [filtri,region]);

    useEffect(() => {
        invia_info(infoMarker);
        invia_premuto(pressed)
    },[pressed])




  
    //TODO -- da migliorare l'efficienza
    //Funzione che mi aggiorna ogni volta la mappa con i punti al suo interno
    function renderMap(){
        if(area_schermo!=undefined){
            const startTime = performance.now();
            //1) ottengo i punti dell'area visibile
            const result = rtree.search({
                minX: area_schermo.southWest.latitude,
                minY: area_schermo.southWest.longitude,
                maxX: area_schermo.northEast.latitude,
                maxY: area_schermo.northEast.longitude,
            });
            //console.log("n punti totali=",result.length)

            const ris=filtra(result,filtri);
            //console.log("n punti filtrati=",ris.length)

            //2) carico i punti nel supercluster
            const clusterData: PointFeature<any>[] = ris.map((marker:any) => ({
                type: 'Feature',
                geometry: { type: 'Point', coordinates: [marker.data.longitudine, marker.data.latitudine] },
                properties: { data: marker.data},
                }));

            supaclusta.load(clusterData);
        
            const zoom = Math.round(Math.log(360 / region.latitudeDelta) / Math.LN2);
            //3) Esegue il clustering
            var clusters = supaclusta.getClusters(
                [area_schermo?.southWest.longitude || 0, area_schermo?.southWest.latitude || 0, area_schermo?.northEast.longitude || 0, area_schermo?.northEast.latitude || 0],                zoom);

            const arrayCluster:any=[]
            const non_cluster:any=[]
            clusters.map((cluster:any) => {
                if(cluster.properties.cluster){
                    arrayCluster.push(cluster);
                }else{
                    non_cluster.push(cluster);
                }
            })
            //console.log("n di clusters = ",arrayCluster.length)
            //console.log("n di markers = ",non_cluster.length)
            setCluster(arrayCluster);
            setMarkers(non_cluster);

            const endTime = performance.now(); // Ottieni il timestamp di fine
            const executionTime = endTime - startTime; // Calcola il tempo di esecuzione in millisecondi
            console.log('Tempo di clustering+render:', executionTime, 'ms');
            
            
        }else{
            console.log("area schermo undefined")
        }
    }


    //TODO da rivedere il padding
    //@ts-ignore
    const CustomMarker = ({ number }) => {
        return (
          <View style={{flex:1}}>
            <Text style={{ 
                position:'absolute',fontSize:12,textAlign:'center',top:20,left:15,
                }}>{number}</Text>
          </View>
        );
      };


    //zoomma e si sposta sulla posizione del marker fogli del cluster
    //@ts-ignore
    function clusterzoom({id}){
        var a:any[] = []
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
        if(pippo.length>0){
            pippo.map((cluster:any) => {
                let test={
                    latitude:cluster.geometry.coordinates[1],
                    longitude:cluster.geometry.coordinates[0],
                }
                b.push(test)
            })
        }
        mapRef.current?.fitToCoordinates(a.concat(b) , {
            edgePadding: { top: 40, right: 20, bottom: 20, left: 20 },
            animated: true})
    }


    //invia ad infoview per mostrare le informazioni del marker
    const infotab = (data:any)=>{
        setPressed(!pressed);
        setInfoMarker(data);
    }

    //Funzione che mi ritorna l'icona del marker
    function MarkerICon(info:any){
        if(info.data.flagAds=="Y"){
            return require('../immagini/originali/marker-ads.png')
        }else{
            if(info.data.tipologie[0].tipologia=='AUTOMAT'){
                return require('../immagini/originali/marker-q8easy.png')
            }else{
                return require('../immagini/originali/marker-q8.png')
            }
        }
    }

    

    return (
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
          image={require('../immagini/originali/m1.png')}
        >
            <CustomMarker number={cluster.properties.point_count} />
        </Marker>
      ))}

      {markers.map((marker:any) => (
        <Marker
            onPress={()=>{console.log("premutoo");infotab(marker.properties.data)}}
            tracksViewChanges={false}
          key={(marker.properties.data.codice)} 
          coordinate={{ latitude: (marker.geometry.coordinates[1]), longitude: (marker.geometry.coordinates[0]) }}
          icon={MarkerICon(marker.properties)}
          >
          </Marker>))}
    </>
    )
}
export default Marcatori_visibili;