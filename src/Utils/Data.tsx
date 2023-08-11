import RBush from "rbush";
import database from "../data/full_dati.json"

//salvo i dati nel rtree all'inizio
export function salvo_dati(){
    console.log("salvando i dati...")
    const startTime = performance.now();
    const rtree = new RBush();
    // @ts-ignore
    for (let i = 0; i < database.length; i++) {
        // @ts-ignore
        const { latitudine, longitudine } = database[i];
        if(latitudine!=0 && longitudine!=0){
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
        }
      };

    const endTime = performance.now(); // Ottieni il timestamp di fine
    const executionTime = endTime - startTime; // Calcola il tempo di esecuzione in millisecondi
    console.log('Tempo di esecuzione r-tree:', executionTime, 'ms');
    return rtree;      
}