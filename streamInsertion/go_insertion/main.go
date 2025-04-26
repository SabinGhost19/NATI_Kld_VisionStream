package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/tidwall/gjson"
)

type Product struct {
	ID       int     `json:"id"`
	Name     string  `json:"name"`
	Price    float64 `json:"price"`
	Quantity int     `json:"quantity"`
}

func main() {
	gin.SetMode(gin.ReleaseMode)

	const (
		jsonFile    = "products.json"
		endpoint    = "http://localhost:8080/api/products"
		concurrency = 10
	)

	products, err := readProductsWithGjson(jsonFile)
	if err != nil {
		log.Fatalf("Eroare la citirea produselor: %v", err)
	}

	fmt.Printf("S-au încărcat %d produse din fișier\n", len(products))

	productsChan := make(chan Product, len(products))
	
	var successCount, failCount int
	var resultsMutex sync.Mutex
	
	var wg sync.WaitGroup
	for i := 0; i < concurrency; i++ {
		wg.Add(1)
		go worker(i, productsChan, endpoint, &wg, &successCount, &failCount, &resultsMutex)
	}

	for _, product := range products {
		productsChan <- product
	}
	close(productsChan)

	wg.Wait()
	
	fmt.Printf("\nTrimis cu succes: %d produse\n", successCount)
	fmt.Printf("Eșuate: %d produse\n", failCount)
}

func readProductsWithGjson(filePath string) ([]Product, error) {
	
	data, err := os.ReadFile(filePath)
	if err != nil {
		return nil, fmt.Errorf("eroare la citirea fișierului: %w", err)
	}

	result := gjson.Parse(string(data))
	
	var products []Product
	
	if result.IsArray() {
		result.ForEach(func(_, value gjson.Result) bool {
			product := Product{
				ID:       int(value.Get("id").Int()),
				Name:     value.Get("name").String(),
				Price:    value.Get("price").Float(),
				Quantity: int(value.Get("quantity").Int()),
			}
			products = append(products, product)
			return true 
		})
	} else {
		return nil, fmt.Errorf("formatul JSON nu este un array")
	}
	
	if len(products) == 0 {
		return nil, fmt.Errorf("nu s-au găsit produse în fișier")
	}
	
	return products, nil
}

func worker(id int, products <-chan Product, endpoint string, wg *sync.WaitGroup, 
	successCount, failCount *int, mutex *sync.Mutex) {
	
	defer wg.Done()
	
	for product := range products {

		productJSON, err := json.Marshal(product)
		if err != nil {
			mutex.Lock()
			*failCount++
			mutex.Unlock()
			fmt.Printf("Worker %d: Eroare la serializare produs ID %d: %v\n", id, product.ID, err)
			continue
		}
		
		req, err := http.NewRequest("POST", endpoint, bytes.NewBuffer(productJSON))
		if err != nil {
			mutex.Lock()
			*failCount++
			mutex.Unlock()
			fmt.Printf("Worker %d: Eroare la crearea request-ului pentru produs ID %d: %v\n", id, product.ID, err)
			continue
		}
		
		req.Header.Set("Content-Type", "application/json")
		
		client := &http.Client{
			Timeout: 10 * time.Second,
		}
		resp, err := client.Do(req)
		if err != nil {
			mutex.Lock()
			*failCount++
			mutex.Unlock()
			fmt.Printf("Worker %d: Eroare la trimiterea produsului ID %d: %v\n", id, product.ID, err)
			continue
		}
		

		body, _ := io.ReadAll(resp.Body)
		resp.Body.Close()
		
		if resp.StatusCode == http.StatusCreated {
			mutex.Lock()
			*successCount++
			mutex.Unlock()
			fmt.Printf("Worker %d: Produs ID %d trimis cu succes\n", id, product.ID)
		} else {
			mutex.Lock()
			*failCount++
			mutex.Unlock()
			fmt.Printf("Worker %d: Eroare la trimiterea produsului ID %d: status %d, răspuns: %s\n", 
				id, product.ID, resp.StatusCode, string(body))
		}
	}
}