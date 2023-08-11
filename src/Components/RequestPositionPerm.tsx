import {
  PermissionsAndroid,
} from 'react-native';

const RequestPositionPerm = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Acesso alla posizione',
        message:
          'Questa app richiede l\'accesso ' +
          'alla tua posizione per funzionare.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Permesso accettato');
    } else {
      console.log('Permesso negato');
    }
  } catch (err) {
    console.warn(err);
  }
};

export default RequestPositionPerm;
