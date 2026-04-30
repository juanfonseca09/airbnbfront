# Airbnb Price Predictor

Esta es una app simple que estima el precio por noche de una propiedad en Airbnb en Seattle usando un modelo de machine learning.

La idea es ver cómo, con pocos datos básicos, se puede tener una aproximación bastante razonable del precio.

---

## Cómo funciona

El usuario ingresa:
- cantidad de dormitorios
- cantidad de baños
- cantidad de huéspedes

Con eso el frontend usa la API y devuelve un precio estimado.

---

## Modelo

- Modelo: Random Forest
- Variables usadas:
  - bedrooms
  - bathrooms
  - accommodates

El modelo fue entrenado con datos reales de Airbnb (dataset de Kaggle).

Resultados aproximados:
- MAE: ~37 USD
- R2: ~0.47

No es perfecto, pero para ser un modelo simple con pocas variables anda bastante bien.

---

## Stack

### Backend
- Python
- FastAPI
- scikit-learn

### Frontend
- React
- Axios
- React Bootstrap

---

## Deploy

- Frontend: Netlify
- Backend: Fly.io

---

## Correr el proyecto local

### Frontend

```bash
npm install
npm start