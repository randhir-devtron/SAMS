package resthandlers

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	repo "github.com/randhir06/StdAttdMangSys/Repository"
	serv "github.com/randhir06/StdAttdMangSys/Services"
)

// Get principals
func GetPrincipals(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var principal []repo.Principal
	serv.DB.Find(&principal)
	json.NewEncoder(w).Encode(principal)
}

// Get principal
func GetPrincipal(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var principal repo.Principal
	params := mux.Vars(r)
	serv.DB.First(&principal, params["principalid"])
	json.NewEncoder(w).Encode(principal)
}

// Add a principal into principal table
func AddPrincipal(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var principal repo.Principal
	json.NewDecoder(r.Body).Decode(&principal)
	serv.DB.Create(&principal)
	json.NewEncoder(w).Encode(principal)
}
