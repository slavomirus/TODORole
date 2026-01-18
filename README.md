# ToDo App - Specyfikacja API Implementation

Projekt implementuje API ToDo z autoryzacją JWT, rolami i RLS według specyfikacji.

## Struktura
- `/server`: Backend (Node.js/Express)
- `/client`: Frontend (React/Vite)

## Wymagania
1. Node.js
2. Konto Supabase

## Konfiguracja Supabase
1. Utwórz projekt w Supabase.
2. Wklej skrypt SQL z sekcji 1 tego poradnika w SQL Editor.
3. **WAŻNE:** Włącz "Hooks" w Authentication -> Hooks -> Customize Access Token Claims -> wybierz `custom_access_token_hook`.

## Instalacja i Uruchomienie

### Backend
1. `cd server`
2. Utwórz `.env` i uzupełnij kluczami z Supabase.
3. `npm install`
4. `node index.js`
    - Serwer działa na: http://localhost:3000

### Frontend
1. `cd client`
2. `npm install`
3. `npm run dev`
    - Aplikacja dostępna pod adresem wskazanym przez Vite (zazwyczaj http://localhost:5173)

## Testowanie (cURL)
Rejestracja użytkownika:
```bash
curl -X POST http://localhost:3000/auth/register \
-H "Content-Type: application/json" \
-d '{"email":"test@example.com","password":"Haslo123!"}'