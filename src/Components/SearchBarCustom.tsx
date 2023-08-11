import React, { useEffect, useState } from "react";
import { Image, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';


interface SearchBarProps {
  onSearch: (value: string) => void;
  applica_filtri: (value:any)=>void;
  indietro:boolean;
  invia_back:(value:any)=>void;
}

//dizionario dei filtri
/*
const filtri = {
  "tipologia_punti_vendita": [],
  "prodotti": [],
  "servizi": [],
  "metodi_pagamento": [],
}
*/


let serviziarr = ["Bar","Ristorante","Shop","Lavaggio","Gommista","Officina","TNT Point","Ricarica Elettrica","Concept Store Svolta"]
let prodottiarr = ["Q8 Hi Perform Diesel","Q8 Hi Perform 100 ottani","AdBlue","GPL","Metano CNG","Metano LNG","Q8 HVO+"]
let metodiPagamento = ["CartissimaQ8","RecardQ8","PayPal","DKV","UTA","euroShell Card","Telepass Pay","mycard Tamoil","LOGPAY","IQCard","EuroWag","Pagamenti digitali con app","Click&Fuel"];
let puntivenditaarr = ["Servito","Self","24hx7","Autostradale"]
let fastfilter = ["Q8","Q8Easy","CartissimaQ8","RecardQ8","Lavaggio","Bar"]

const SearchBarCustom: React.FC<SearchBarProps> = ({onSearch,applica_filtri,indietro,invia_back}) => {
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [arrayfiltri, setArrayfiltri] = useState<any>([]);
    const [punti_vendita, setPunti_vendita] = useState<string[]>([]);
    const [prodotti, setProdotti] = useState<string[]>([]);
    const [servizi, setServizi] = useState<string[]>([]);
    const [metodo_pagamenti, setMetodo_pagamenti] = useState<string[]>([]);
    const [colorvendita, setColorvendita] = useState<boolean[]>([false,false,false,false]);
    const [colorservizi, setColorservizi] = useState<boolean[]>([false,false,false,false,false,false,false,false,false]);
    const [colorprodotti, setColorprodotti] = useState<boolean[]>([false,false,false,false,false,false,false]);
    const [colorpagamenti, setColorpagamenti] = useState<boolean[]>([false,false,false,false,false,false,false,false,false,false,false,false,false])
    const [colorfastfilter, setColorfastfilter] = useState<boolean[]>([false,false,false,false,false,false]);



    //Funzioni che servono a segnare il colore dei bottoni quando vengono premuti
    const premi_vendita = (indice:number) => {
      const temp = [...colorvendita];
      temp[indice] = !temp[indice];
      setColorvendita(temp);
    }

    const premi_servizi = (indice:number) => {
      const temp = [...colorservizi];
      temp[indice] = !temp[indice];
      setColorservizi(temp);
    }
    
    const premi_prodotti = (indice:number) => {
      const temp = [...colorprodotti];
      temp[indice] = !temp[indice];
      setColorprodotti(temp);
    }

    const premi_pagamenti = (indice:number) => {
      const temp = [...colorpagamenti];
      temp[indice] = !temp[indice];
      setColorpagamenti(temp);
    }

    const premi_fast_filter = (indice:number) => {
      const temp = [...colorfastfilter];
      temp[indice] = !temp[indice];
      setColorfastfilter(temp);
    }


    //Funzioni che servono a settare  i filtri
    const filtra_punto_vendita=(filtro:string) => {
      if(!punti_vendita.includes(filtro)){
        console.log("aggiungo in punti vendita",filtro)
        setPunti_vendita([...punti_vendita,filtro]);
      }else{
        setPunti_vendita(punti_vendita.filter((item: any) => !filtro.includes(item)));
        console.log("rimuovo in punti vendita",filtro)
      }
    }

    const filtraprodotti=(filtro: string) => {
      if(!prodotti.some(element => filtro.includes(element))){
        console.log("aggiungo",filtro)
        setProdotti([...prodotti,filtro])
      }else{
        setProdotti(prodotti.filter((item: any) => !filtro.includes(item)));
        console.log("rimuovo",filtro)
      }
    }

    const filtrametodopagamenti=(filtro: string) => {
      if(!metodo_pagamenti.includes(filtro)){
        console.log("aggiungo",filtro)
        setMetodo_pagamenti([...metodo_pagamenti,filtro]);
      }else{
        setMetodo_pagamenti(metodo_pagamenti.filter((item: string) => item !== filtro));
        console.log("rimuovo",filtro)
      }
    }

    const filtraservizi=(filtro: string) => {
      if(!servizi.includes(filtro)){
        console.log("aggiungo",filtro)
        setServizi([...servizi,filtro]);
      }else{
        setServizi(servizi.filter((item: string) => item !== filtro));
        console.log("rimuovo",filtro)
      }
    } 
  

    //Funzione che invia i filtri appena uno delle funzioni precedenti viene modificato
    useEffect(() => {
      const filtro={
        "tipologia_punti_vendita": punti_vendita,
        "prodotti": prodotti,
        "servizi": servizi,
        "metodi_pagamento": metodo_pagamenti,
      }
      setArrayfiltri(filtro);
    },[punti_vendita,prodotti,servizi,metodo_pagamenti]);

  
    //TODO - forse rindondante
    useEffect(() => {applica_filtri(arrayfiltri)},[arrayfiltri])


    //Attenzione al garbage collector!
    //TODO approfondire
    function RimuoviFiltro(){
      setPunti_vendita([]);
      setProdotti([]);
      setServizi([]);
      setMetodo_pagamenti([]);
      setColorvendita([false,false,false,false]);
      setColorservizi([false,false,false,false,false,false,false,false,false]);
      setColorprodotti([false,false,false,false,false,false,false]);
      setColorpagamenti([false,false,false,false,false,false,false,false,false,false,false,false,false])
      setColorfastfilter([false,false,false,false,false,false]);

    }

    //Funzione che mi controlla se la lista dei filtri è vuota
    //@return true se è vuota, false altrimenti
    function check_filtri_vuota(){
      const valoriFiltri = Object.values<string[]>(arrayfiltri);
      return valoriFiltri.every((elemento: string[]) => elemento.length === 0);
  }

  //Funzione invia un segnale che sta tornando indietro
  function torna_indietro(){
    if(indietro==true){
        invia_back(true);
    }
  }


    //Funzione che aggiorna ogni volta la barra di ricerca
    const [search, setSearch] = useState('');
    const updateSearch = (search: string) => {
    setSearch(search);
    };

    const handleSearch = () => {
        onSearch(search); // Passa il valore del TextInput al componente genitore tramite la funzione di callback
      };


    return(
      <View>
        <View style={{flex:1}}>
          <View style={styles.containerTop}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              {/*SEARCHBAR*/}
            <View style={styles.searchContainer}>

              <TouchableOpacity style={styles.button2} onPress={torna_indietro}>
                <Image source={indietro?require('../immagini/arrow.png'):require('../immagini/search.png')} style={styles.image} />
              </TouchableOpacity>

                <TextInput
                    autoComplete='country'
                    style={styles.input}
                    placeholder="Search..."
                    placeholderTextColor="gray"
                    onChangeText={updateSearch}
                    value={search}
                    onSubmitEditing={handleSearch}
                />
                <TouchableOpacity style={styles.button1} onPress={() => setSettingsVisible(true)}>
                    <Image style={styles.searchIcon} source={require('../immagini/filter.png')} />
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
            {/*FILTRI RAPIDI SOTTO LA SEARCHBAR*/}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} bounces={false}>
                {fastfilter.map((roberto: string,index:number) => <TouchableOpacity style={[styles.miniButton1,{backgroundColor: colorfastfilter[index]? '#1f419a':'white'}]} onPress={()=>
                  {
                    premi_fast_filter(index);
                    switch (roberto) {
                      case "Q8":
                        //TODO controllare
                        //await AsyncStorage.clear() //-> rimuovere se serve per debug. 
                        filtra_punto_vendita("Servito")
                        premi_vendita(0);
                        break;
                      case "Q8Easy":
                        premi_vendita(2);
                        filtra_punto_vendita("24hx7")
                        break;
                      case "CartissimaQ8":
                        premi_pagamenti(0);
                        filtrametodopagamenti(roberto);
                        break;
                      case "RecardQ8":
                        premi_pagamenti(1);
                        filtrametodopagamenti(roberto);
                        break;
                      case "Lavaggio":
                        premi_servizi(3);
                        filtraservizi(roberto);
                        break;
                      case "Bar":
                        premi_servizi(0);
                        filtraservizi(roberto);
                        break;
                      default:
                        console.log("impossibile")
                    }
                  }  
                  } key={roberto}>
                <Text style={{color:'black',fontSize:12,fontWeight:'bold'}}>{roberto}</Text>
                    </TouchableOpacity>)}
              </ScrollView>
          </View>
        </View>
        {/*SCHERMATA DEI FILTRI*/}
        <Modal  visible={settingsVisible} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={() => setSettingsVisible(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>

          <View style={styles.modalContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setSettingsVisible(false)}>
                <Image source={require('../immagini/close.png')} style={styles.image} />
              </TouchableOpacity>
              <Text style={{alignSelf:'center',fontSize: 18,fontWeight: 'bold',color:'black',marginBottom:10}}>Filtro</Text>
              {!check_filtri_vuota() ?(<TouchableOpacity style={styles.rimuoviFiltroButton} onPress={RimuoviFiltro}>
                <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>CLEAR</Text>
            </TouchableOpacity>): null}
            {/*FILTRI VARI ALL'INTERNO DELLA MODAL FILTRI*/}
             <ScrollView style={{flex:1}}>   
              <Text style={{marginTop: 20,color: 'black',fontSize: 16,fontWeight: 'bold',}}>Tipologia di punto vendita</Text>
                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>              
                {puntivenditaarr.map((roberto: string,index:number) => <TouchableOpacity style={[styles.miniButton,{backgroundColor: colorvendita[index]? '#1f419a':'white'}]} onPress={()=>{
                  
                  switch(roberto){
                    case "24hx7":
                      premi_fast_filter(1);
                      premi_vendita(index);
                      filtra_punto_vendita(roberto)
                      break;
                    case "Servito":
                      premi_fast_filter(0);
                      premi_vendita(index);
                      filtra_punto_vendita(roberto)
                      break;
                    default:
                      premi_vendita(index);
                      filtra_punto_vendita(roberto)

                  }
                  
                  }} key={roberto}>
                  <Text style={{fontSize:14,color:colorvendita[index]?'white':'black'}}>{roberto}</Text>
                </TouchableOpacity>)}
              </View>
              <Text style={{marginTop: 20,
                              color: 'black',
                              fontSize: 16,
                              fontWeight: 'bold',}}>Prodotti</Text>
                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>              
                {prodottiarr.map((roberto: string,index:number) => <TouchableOpacity style={[styles.miniButton,{backgroundColor: colorprodotti[index]? '#1f419a':'white'}]} onPress={()=>{premi_prodotti(index),filtraprodotti(roberto)}} key={roberto}>
                <Text style={{fontSize:14,color:colorprodotti[index]?'white':'black'}}>{roberto}</Text>
                </TouchableOpacity>)}
              </View>
                <Text style={{marginTop: 20,
                              color: 'black',
                              fontSize: 16,
                              fontWeight: 'bold',}}>Servizi</Text>
                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>              
                {serviziarr.map((roberto: string,index:number) => <TouchableOpacity style={[styles.miniButton,{backgroundColor: colorservizi[index]? '#1f419a':'white'}]} onPress={()=>{
                  switch (roberto) {
                    case "Lavaggio":
                      premi_servizi(index);
                      filtraservizi(roberto);
                      premi_fast_filter(5);
                      break;
                    case "Bar":
                      premi_servizi(index);
                      filtraservizi(roberto);
                      premi_fast_filter(5);
                      break;
                    default:
                      premi_servizi(index);
                      filtraservizi(roberto);
                  }                  
                  }} key={roberto}>
                  <Text style={{fontSize:14,color:colorservizi[index]?'white':'black'}}>{roberto}</Text>
                </TouchableOpacity>)}
              </View>
              <Text style={{marginTop: 20,
                              color: 'black',
                              fontSize: 16,
                              fontWeight: 'bold',}}>Metodi di pagamento</Text>
                <View style={{flexDirection: 'row', flexWrap: 'wrap',marginBottom:10}}>              
                {metodiPagamento.map((roberto: string,index:number) => <TouchableOpacity style={[styles.miniButton,{backgroundColor: colorpagamenti[index]? '#1f419a':'white'}]} onPress={()=>{
                  switch (roberto) {
                    case "CartissimaQ8":
                      premi_pagamenti(index);
                      filtrametodopagamenti(roberto);
                      premi_fast_filter(2);
                      break;
                    case "RecardQ8":
                      premi_pagamenti(index),
                      filtrametodopagamenti(roberto);
                      premi_fast_filter(3);
                      break;
                    default:
                      premi_pagamenti(index);
                      filtrametodopagamenti(roberto);

                  }
                  }} key={roberto}>
                  <Text style={{fontSize:14,color:colorpagamenti[index]?'white':'black'}}>{roberto}</Text>
                </TouchableOpacity>)}
              </View>
              </ScrollView>
              </View>
          </Modal>
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerTop: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
  },
  searchContainer: {
    
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 50,
    elevation: 10,
    overflow: 'hidden',
  },
    searchIcon: {
      width: 20,
      height: 20,
      tintColor: 'white',
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: 'black',
    },
    button1: {
      padding: 8,
      borderRadius: 50,
      backgroundColor: '#1f419a',
      marginLeft: 10,
    },
    button2: {
      padding: 8,
      borderRadius: 100,
      //backgroundColor: '#1f419a',
      marginRight: 10,
    },
    miniButton1: {
      margin: 8, 
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      justifyContent: 'center', 
      alignItems: 'center',
      elevation: 10, 
    },
    rimuoviFiltroButton: {
      borderWidth: 1,
      borderColor: '#eeeeee',
      borderRadius: 20,
      position: 'absolute',
      backgroundColor: 'grey',
      top: 10,
      right: 10,
      paddingVertical: 8,
      paddingHorizontal: 12,
      marginRight: 10,
      marginTop: 3,
      elevation: 10,
    },
    image: {
      width: 20,
      height: 20,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'white',
      margin: 20,
      borderRadius: 20,
      elevation: 10,
      padding: 20,
      marginTop: 80,
      marginLeft: 20,
      marginRight: 20,
      marginBottom: 20,
    },
    closeButton: {
      position: 'absolute',
      top: 10,
      left: 10,
      padding: 5,
    },
    buttonContainer: {
      flexDirection: 'row', 
      justifyContent: 'center', 
      marginTop: 10,
      flexWrap: 'wrap'
    },
    miniButton: {
      borderWidth: 1,
      borderColor: '#eeeeee',
      margin: 4, 
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      justifyContent: 'center', 
      alignItems: 'center', 
      elevation: 5, 
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
})


export default SearchBarCustom;