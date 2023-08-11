import React, { createContext } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { salvo_dati } from './src/Utils/Data';
import SplashScreen from 'react-native-splash-screen';
import {enableLatestRenderer} from 'react-native-maps';
import Mappa from './src/Components/Map';
import requestPositionPerm from './src/Components/RequestPositionPerm';
import { crea_cluster } from './src/Utils/Cluster';




export const RtreeContext = createContext<any>(null);
export const SuperclusterContext = createContext<any>(null);

function App(): JSX.Element {
  const tree = salvo_dati()
  const supercluster = crea_cluster();
  requestPositionPerm();
  enableLatestRenderer();
  SplashScreen.hide();
  


  return (
  
    <View style={styles.container}>
      <RtreeContext.Provider value={tree}>
        <SuperclusterContext.Provider value={supercluster}>
      <Mappa />
     
      </SuperclusterContext.Provider>
      </RtreeContext.Provider>
    </View>
    
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  container: {
    flex: 1,
  },
});

export default App;