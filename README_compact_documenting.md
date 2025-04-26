# Sistem de Monitorizare a Prețurilor

## Descriere

Aplicația oferă un sistem automatizat pentru monitorizarea și actualizarea prețurilor produselor prin detectarea și potrivirea produselor similare folosind inteligență artificială. Sistemul este proiectat pentru a procesa până la 50.000 de înregistrări pe secundă, utilizând o arhitectură distribuită modernă.

## Arhitectură

Sistemul folosește un design arhitectural bazat pe microservicii:

```
[Client] --> [Spring Boot API] --> [Cassandra (Event Store)]
                |                          |
                v                          v
         [PostgreSQL] <-- [Serviciu de Sincronizare]
                |
                v
      [Serviciu ML/AI] <-- [Kafka] --> [Spring Boot API]
```

## Componente Principale

### Backend & Baze de Date

1. **Colectare Date**
   * Primește date despre produse prin API REST
   * Înregistrează modificările ca evenimente în Cassandra
   * Stochează datele detaliate în PostgreSQL pentru analiză

2. **Sincronizare Date**
   * Transferă datele din Cassandra în PostgreSQL
   * Menține consistența între cele două baze de date
   * Optimizează pentru disponibilitate și viteză

3. **Servicii API**
   * Expune endpoint-uri pentru CRUD produse
   * Procesează actualizările venite de la sistemul ML
   * Comunică cu Kafka pentru messaging asincron

### ML & Procesare Date

1. **Procesare Imagini**
   * Primește imagini de produse din Kafka
   * Aplică modele de detecție obiecte
   * Extrage caracteristici vizuale pentru comparare

2. **Potrivire Produse**
   * Compară caracteristicile cu produsele existente
   * Calculează scorul de similaritate
   * Identifică cele mai relevante potriviri

3. **Actualizare Prețuri**
   * Analizează diferențele de preț între produse similare
   * Aplică reguli de business pentru decizia de actualizare
   * Trimite actualizările înapoi în sistem prin Kafka

## Flux de Date End-to-End

1. **Intrare Date** → Backend primește date despre produse și imagini
2. **Stocare Primară** → Datele sunt salvate în Cassandra pentru procesare rapidă
3. **Publicare Event** → Noile imagini sunt publicate în Kafka
4. **Procesare ML** → Sistemul ML detectează și analizează produsele
5. **Căutare Similarități** → Se identifică produse similare în PostgreSQL
6. **Decizie Actualizare** → Se decide dacă prețul trebuie actualizat
7. **Propagare Actualizări** → Actualizările sunt trimise înapoi prin Kafka
8. **Sincronizare DB** → Datele sunt actualizate în ambele baze de date
9. **Feedback Loop** → Rezultatele alimentează sistemul pentru îmbunătățire continuă

## Tehnologii Utilizate

### Backend & Infrastructură
* Spring Boot (Java) pentru backend
* Cassandra pentru logging evenimente
* PostgreSQL pentru stocare relațională
* Docker & Kubernetes pentru orchestrare

### ML & Procesare Date
* Python pentru servicii ML
* Kafka pentru messaging distribuit
* PyTorch/TensorFlow pentru modele ML
* FastAPI pentru servicii REST ML

