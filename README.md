# Airbnb Price Predictor

Este proyecto es una aplicación simple que estima el precio por noche de una propiedad en Airbnb en Seattle usando machine learning.

## Qué hace

Ingresás:
- cantidad de dormitorios  
- cantidad de baños  
- capacidad de huéspedes  

Y el sistema devuelve un precio estimado por noche.

---

## Cómo está hecho

Arranqué trabajando con datasets reales de Airbnb, probando distintas ideas como ocupación, fechas, etc.  
Pero para simplificar y hacerlo más estable, terminé usando solo variables estructurales del alojamiento.

El modelo final es un Random Forest, entrenado con scikit-learn en Python.  
Elegí ese modelo porque funciona bien sin mucho ajuste y capta relaciones más reales que una regresión simple.

---

## Tech Stack

- **Backend:** FastAPI 
- **Modelo:** scikit-learn
- **Frontend:** React + Bootstrap
- **Deploy:** Fly.io

---

##  Cómo funciona

1. El usuario ingresa los datos en el frontend
2. React hace una request a la API
3. FastAPI recibe los datos y los pasa al modelo
4. El modelo devuelve un precio estimado
5. Se muestra en pantalla

---

## Correr el proyecto

### Frontend

```bash
npm install
npm start
