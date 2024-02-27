package auth

import (
	// "encoding/json"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"go.uber.org/zap"
)

type AuthToken interface {
	CreateToken(r *http.Request) (int, string, string)
}

var jwtKey = []byte("JwtKey")

type Claims struct {
	Password string `json:"password"`
	Username string `json:"username"`
	Role     string `json:"role"`
	jwt.RegisteredClaims
}

type Credentials struct {
	Username string `json:"username,omitempty"`
	Password string `json:"password,omitempty"`
}

func CreateToken(username, password, role string) string {

	expirationtime := time.Now().Add(time.Hour * 24)

	claims := &Claims{
		Username: username,
		Password: password,
		Role:     role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationtime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString(jwtKey)

	if err != nil {
		zap.L().Error("Couldn't create token string", zap.Error(err))
		return ""
	}

	return tokenString
}

func VerifyToken(r *http.Request) (int, string, string) {
	cookie, err := r.Cookie("Randhir")

	if err != nil {
		if err == http.ErrNoCookie {
			zap.L().Error("No Cookie found", zap.Error(err))
			return http.StatusUnauthorized, "", ""
		}
		zap.L().Error("Cannot retrieve cookie", zap.Error(err))
		return http.StatusBadRequest, "", ""
	}

	tokenStr := cookie.Value
	claims := &Claims{}

	token, err := jwt.ParseWithClaims(tokenStr, claims, func(t *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})

	if err != nil {
		if err == jwt.ErrSignatureInvalid {
			zap.L().Error("Invalid token", zap.Error(err))
			return http.StatusUnauthorized, "", ""
		}
		zap.L().Error("Error verifying token", zap.Error(err))
		return http.StatusBadRequest, "", ""
	}

	if !token.Valid {
		zap.L().Error("Token not valid")
		return http.StatusUnauthorized, "", ""
	}
	return http.StatusAccepted, claims.Username, claims.Role
}
