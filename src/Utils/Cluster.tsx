import Supercluster from 'supercluster';

export function crea_cluster(){
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

    
    const endTime = performance.now(); // Ottieni il timestamp di fine
    const executionTime = endTime - startTime; // Calcola il tempo di esecuzione in millisecondi
    console.log('Tempo di esecuzione cluster:', executionTime, 'ms');

    return supercluster;

}