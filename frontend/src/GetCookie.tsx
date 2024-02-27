import { jwtDecode } from "jwt-decode";
export function getUserDataFromCookie() {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith('Randhir=')) {
            const jsonString = decodeURIComponent(cookie.substring(9)); // Remove 'UserData=' prefix and decodeURIComponent
            const data = jwtDecode(jsonString);
            return data;
        }
    }
    return null; // Return null if UserData cookie is not found
}

