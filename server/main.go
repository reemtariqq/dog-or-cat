package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"

	"github.com/go-sql-driver/mysql"
)

var db *sql.DB

type Pref struct {
	Id        int64  `json:"id"`
	Selection string `json:"selection"`
}

func getSelections() ([]Pref, error) {
	var prefs []Pref

	rows, err := db.Query(" SELECT * from records")
	if err != nil {
		return nil, fmt.Errorf("get prefs: %v", err)
	}
	defer rows.Close()

	for rows.Next() {
		var pref Pref
		if err := rows.Scan(&pref.Id, &pref.Selection); err != nil {
			return nil, fmt.Errorf("get prefs", err)
		}
		prefs = append(prefs, pref)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("albumsByArtist", err)
	}
	return prefs, nil
}

func addSelection(pref string) (int64, error) {
	result, err := db.Exec("INSERT INTO records (selection) VALUES (?)", pref)
	if err != nil {
		return 0, fmt.Errorf("addAlbum: %v", err)
	}
	id, err := result.LastInsertId()
	if err != nil {
		return 0, fmt.Errorf("addAlbum: %v", err)
	}
	return id, nil
}

func getAllPrefs(c *gin.Context) {
	prefs, _ := getSelections()
	fmt.Println(prefs)

	c.Writer.Header().Add("Access-Control-Allow-Origin", "*")
	c.Writer.Header().Add("Access-Control-Allow-Credentials", "true")
	c.Writer.Header().Add("Content-Type", "application/json")

	c.IndentedJSON(http.StatusOK, prefs)
}

func addPref(c *gin.Context) {
	var newPref string

	if err := c.BindJSON(&newPref); err != nil {
		return
	}

	addSelection(newPref)
	c.IndentedJSON(http.StatusCreated, newPref)
}

func main() {
	cfg := mysql.Config{
		User:   os.Getenv("DBUSER"),
		Passwd: os.Getenv("DBPASS"),
		Net:    "tcp",
		Addr:   "127.0.0.1:3306",
		DBName: "prefs",
	}

	var err error
	db, err = sql.Open("mysql", cfg.FormatDSN())
	if err != nil {
		log.Fatal(err)
	}
	pingErr := db.Ping()
	if pingErr != nil {
		log.Fatal(pingErr)
	}
	fmt.Println(" Connected")
	fmt.Println(getSelections())

	router := gin.Default()
	router.GET("/prefs", getAllPrefs)
	router.POST("/prefs", addPref)

	router.Run("localhost:1111")
}
