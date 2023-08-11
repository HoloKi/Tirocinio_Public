import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Image } from "react-native";

interface benzina{
  [key:string]:string;
}
const benza:benzina={
  "300991":"AdBlue",
  "300793":"AdBlue",
  "300204":"Metanocng",
  "302043":"Metanocng",
  "301793":"AdBlue",
  "302042":"Metanolng",
  "302182":"Q8 HVO+",
  "300054":"GPL",
  "301362":"Q8 Hi Perform Diesel",
  "301403":"Q8 Hi Perform 100 ottani",
  "301404":"Q8 Hi Perform 100 ottani",
  "300391":"Q8 Hi Perform Diesel",
  "300004":"Benzina",
  "300016":"Gasolio",
  "301471":"Metano CNG",
}
//----------------------------

interface InfoViewProps {
  dati: any; //ricevo informazioni
  invia_route:(value:any)=>void;
  ricevi_press:boolean;
  infopremuto:boolean; //mi indica quando un marker è stato premuto
}



const InfoView: React.FC<InfoViewProps> = ({ dati,invia_route,ricevi_press,infopremuto,}) => {
  const [pressed, setPressed] = useState(false);
  const [invia_road, setInviaRoad] = useState(false);
  const [modalHeight, setModalHeight] = useState(200);
  const [no_vendita, setNo_vendita] = useState(false);

  //ogni volta che viene premuto un marker
  useEffect(() => {
    if(dati!=null){
      console.log("ho i dati!")
      setPressed(true); 
      //console.log(dati)
      if(dati.indirizzo!=""){ //se ho cercato per esempio milano
        setNo_vendita(true)
      }else{
        setNo_vendita(false)
      }
    }
  },[infopremuto])

  function tipologia_benza(info:any){
    let tipologia:string="";
    info.map((item:any)=>tipologia=tipologia.concat(benza[item.codiceProdotto]?benza[item.codiceProdotto]+", ":""))
    tipologia = tipologia.slice(0, -2); //dovrei rimuovere l'ultima virgola
    if(tipologia==""){
      tipologia="Nessun prodotto disponibile" //poichè ci sono i codici della benzina anche esteri
    }
    return tipologia;
  }

  //Gestisco quando espando le informazioni
  const [espandi,setEspandi] = useState(false);
  function expand(){
    setEspandi(!espandi)
    if(espandi==false){
      setModalHeight(600)
    }else{
      setModalHeight(200)
    }
  }



  //invia i dati alla route(Destination.tsx) e chiudo il modal
  useEffect(() => { 
    if(invia_road==true){
      invia_route(dati)
      setPressed(false) //chiudo il modal
    }
  },[invia_road])

  //Da tenere perchè mi serve per tener conto se l'utente ha premuto il pulsante indietro, resetto il bottone
  useEffect(() => {
    //console.log("back press=",ricevi_press)
    if(ricevi_press==false){
      setInviaRoad(false)
    }
  },[ricevi_press])
  

  return (
    <>
    {dati ? (<Modal
      visible={pressed}
      animationType="slide"
      transparent={true}
      >
    <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.5)'}}>
      
      <View style={[styles.modalContainersmall,{height:modalHeight}]}>
        <TouchableOpacity onPress={() => setPressed(false)} style={styles.closeButton}>
          <Text style={[styles.closeButtonText,{color:'white'}]}>Chiudi</Text>
        </TouchableOpacity>
          
          <View style={styles.modalContentsmall}>
            {<Text style={{fontSize:22,fontWeight:'bold',color:'#20419A'}}>{dati?.localita}</Text>}
            {dati?.indirizzo ? <Text style={{color:'#20419A',fontSize:18,fontWeight:'bold'}}>{ dati?.indirizzo}</Text>:null}
            {dati?.codice ? <Text style={{color:'#20419A',fontSize:18,fontWeight:'bold'}}>{"PV: "+dati?.codice}</Text>:null}
              
              <View style={styles.directionsButtonContainer}>
                {no_vendita ? (<TouchableOpacity style={{margin:8,alignItems:'center',top:10,right:20}} onPress={expand}>
                  <Image 
                  style={{width: 25, height: 25}}
                  source={!espandi ? require('../immagini/expand-arrow.png') : require('../immagini/down-arrow.png')}></Image>
                </TouchableOpacity>):null}
                
              <View style={{ flexDirection: 'row', alignItems: 'center', position: 'absolute', bottom: 0, right: 0 }}>

              {!espandi ? (<TouchableOpacity style={{margin:20}} onPress={()=>{setInviaRoad(true)}}>
                <Image 
                style={{width: 40, height: 40}}
                source={require('../immagini/get-directions-button.png')}></Image>
              </TouchableOpacity>):null}
              </View>
              
              </View>
              {/*INFORMAZIONI SULLA BENZINA*/}
              <View style={{position:'absolute',bottom:0,left:0,margin:20}}>
              {(!espandi && no_vendita)?<Text style={styles.tipologiaText}>{tipologia_benza(dati?.prodotti)}</Text>:null}
              </View>

              {(espandi && dati && no_vendita) ? (<ScrollView>
              <View style={{marginTop:15}}>
                <Text style={{color:'black',fontSize:18,fontWeight:'bold'}}>{"Servizi disponibili"}</Text>
                {dati?.servizi ? dati?.servizi.map((item:any) => {
                  if (item.codice !== 'DPAY') {
                    return <Text key={item.codice} style={{color:'black', fontSize:16}}>{item.descrizione}</Text>;
                  }
                  return null;
                }):null}
              </View>
              <View style={{marginTop:15}}>
                <Text style={{color:'black',fontSize:18,fontWeight:'bold'}}>{"Metodi di pagamento tradizionali"}</Text>
                {dati?.pagamenti ? dati?.pagamenti.map((item:any)=><Text key={item.codiceMetodo} style={{color:'black',fontSize:16}}>{item.descrizione}</Text>):null}
              </View>
              <View style={{marginTop:15}}>
                <Text style={{color:'black',fontSize:18,fontWeight:'bold'}}>{"Metodi di pagamento digitali"}</Text>
                {dati?.digitali ? dati?.digitali.map((item:any,index:number)=><Text key={index} style={{color:'black',fontSize:16}}>{item.descrizione}</Text>):null}
              </View>
              <View style={{marginTop:15,marginBottom:15}}>
                <Text style={{color:'black',fontSize:18,fontWeight:'bold'}}>{"ClubQ8 Click&Fuel"}</Text>
                {dati?.sblocco ? dati?.sblocco.map((item:any,index:number)=><Text key={index+99} style={{color:'black',fontSize:16}}>{item.descrizione}</Text>):null}
              </View>
            </ScrollView>):null}

            </View>
        </View>
        </View>
      </Modal>):null}
    </>
      
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 10,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  tipologiaText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft:0, // Aggiungi margine a destra
  },
  modalContainersmall: {
  position: 'absolute',
  margin: 10,
  bottom: 0,
  left: 0,
  right: 0,
  justifyContent: 'flex-start',
  backgroundColor: 'transparent',
  paddingTop: 30, 
  borderRadius: 20,
  },
  modalContentsmall: {
    position:'relative',
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  directionsButtonContainer: {
    position: 'absolute', // Imposta la posizione assoluta
    top: 0,
    bottom: 0,
    right: 0,
    borderBlockColor: 'black',
    flexDirection: 'column', // Imposta il layout in colonna per contenere i bottoni
    justifyContent: 'space-between', // Spazio tra il bottone superiore e quello inferiore
  },
});
export default InfoView;