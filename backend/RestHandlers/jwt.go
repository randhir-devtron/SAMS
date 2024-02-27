package resthandlers

import (
	_ "database/sql" // Import the database driver
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/dgrijalva/jwt-go"
	auth "github.com/randhir06/StdAttdMangSys/Auth"
	repo "github.com/randhir06/StdAttdMangSys/Repository"
	serv "github.com/randhir06/StdAttdMangSys/Services"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

var jwtKey = []byte("secret_key")

type Claims struct {
	Username string `json:"username"`
	Role     string `json:"role"`
	jwt.StandardClaims
}

// Login Page
func Login(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	println("Inside login");
	type requestBody struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	var data requestBody
	json.NewDecoder(r.Body).Decode(&data)
	var credentials repo.Credentials
	username := data.Username
	password := data.Password
	result := serv.DB.Where("username = ? AND password = ?", username, password).Find(&credentials)
	println(username)
	println(password)
	if result.Error == gorm.ErrRecordNotFound {
		http.Error(w, "Credential does not exist", http.StatusUnauthorized)
		return
	}
	println(result.Error)
	role := credentials.Role

	tokenString := auth.CreateToken(username, password, role)
	println(role);
	http.SetCookie(w, &http.Cookie{Name: "Randhir", Value: tokenString})
	json.NewEncoder(w).Encode(credentials)
}

func Home(w http.ResponseWriter, r *http.Request) {
	statusOk, username, role := auth.VerifyToken(r)
	if statusOk != 200 {
		w.WriteHeader(http.StatusUnauthorized)
	}
	println(username, role)
	// if()
	cookie, err := r.Cookie("Randhir")
	if err != nil {
		if err == http.ErrNoCookie {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	tokenStr := cookie.Value
	claims := &Claims{}
	tkn, err := jwt.ParseWithClaims(tokenStr, claims, func(t *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	if err != nil {
		if err == jwt.ErrSignatureInvalid {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if !tkn.Valid {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	w.Write([]byte(fmt.Sprintf("Hello, %s", claims.Username)))
}

// This credentials will be added by Principle while adding new students
func AddCredentials(username, password, role string) (repo.Credentials, error) {
	var credentials repo.Credentials
	credentials.Username = username
	credentials.Password = password
	credentials.Role = role
	errCreate := serv.DB.Create(&credentials)
	if errCreate.Error != nil {
		log.Printf("Error creating credentials: %v", errCreate)
		return credentials, errCreate.Error
	}

	// json.NewEncoder(w).Encode(credentials)
	return credentials, nil
}

// Function to generate Hash for Passwords
func GenerateHash(password string) (string, error) {
	// Convert password string to byte slice
	passwordBytes := []byte(password)

	// Generate hash of the password
	hashedBytes, err := bcrypt.GenerateFromPassword(passwordBytes, bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}

	// Convert hashed bytes to string and return
	hashedPassword := string(hashedBytes)
	return hashedPassword, nil
}
