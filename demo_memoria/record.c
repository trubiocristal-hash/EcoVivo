#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char id[30];
    char date[15];
    char category[30];
    float kilos;
    char location[100];
} Residuo;

int main() {
    printf("=== Motor de Analisis EcoVivo ===\n");
    
    // 1. Abrir el archivo CSV generado por la app
    FILE *archivo = fopen("datos.csv", "r");
    if (archivo == NULL) {
        printf("Error: No se encontro el archivo 'datos.csv'.\n");
        return 1;
    }

    // 2. Capacidad inicial dinámica
    int capacidad = 2; 
    int totalRecords = 0;
    Residuo **listaResiduos = (Residuo **)malloc(capacidad * sizeof(Residuo *));

    char linea[256];
    // 3. Lectura dinámica del archivo CSV
    fgets(linea, sizeof(linea), archivo); 
    while (fgets(linea, sizeof(linea), archivo)) {
        
        // Expansión dinámica del Heap si superamos la capacidad
        if (totalRecords >= capacidad) {
            capacidad *= 2; 
            listaResiduos = (Residuo **)realloc(listaResiduos, capacidad * sizeof(Residuo *));
            printf("[Sistema] Memoria del arreglo maestro expandida a %d espacios.\n", capacidad);
        }

        // Asignar memoria para el nuevo registro individual
        listaResiduos[totalRecords] = (Residuo *)malloc(sizeof(Residuo));

        // Separar la línea por comas
        char *token = strtok(linea, ",");
        if (token) strcpy(listaResiduos[totalRecords]->id, token);
        token = strtok(NULL, ",");
        if (token) strcpy(listaResiduos[totalRecords]->date, token);
        token = strtok(NULL, ",");
        if (token) strcpy(listaResiduos[totalRecords]->category, token);
        token = strtok(NULL, ",");
        if (token) listaResiduos[totalRecords]->kilos = atof(token); 
        token = strtok(NULL, "\r\n"); 
        if (token) strcpy(listaResiduos[totalRecords]->location, token);
        totalRecords++;
    }
    fclose(archivo);

    // 4. DEMOSTRACIÓN DE MEMORIA FÍSICA
    printf("\n--- MAPA DE DIRECCIONES FISICAS (HEAP) ---\n");
    printf("Total de registros cargados dinamicamente: %d\n", totalRecords);
    printf("Direccion del arreglo maestro expandible: %p\n\n", (void *)listaResiduos);

    float sumaKilos = 0;
    for (int i = 0; i < totalRecords; i++) {
        printf("[Memoria: %p] -> ID: %-8s | Cat: %-15s | Peso: %.2f kg\n", 
               (void *)listaResiduos[i], 
               listaResiduos[i]->id, 
               listaResiduos[i]->category, 
               listaResiduos[i]->kilos);
               
        sumaKilos += listaResiduos[i]->kilos;
    }
    printf("\nTotal procesado: %.2f kg de residuos.\n", sumaKilos);

    // 5. LIBERACIÓN DE MEMORIA
    printf("\nLiberando recursos del Heap...\n");
    for (int i = 0; i < totalRecords; i++) {
        free(listaResiduos[i]); 
    }
    free(listaResiduos); 
    printf("Memoria liberada exitosamente.\n");

    return 0;
}