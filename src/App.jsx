import { useState } from "react";
import axios from "axios";
import { Container, Row, Col, Form, Button, Card, Spinner } from "react-bootstrap";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function App() {
  const [form, setForm] = useState({
    bedrooms: "",
    bathrooms: "",
    accommodates: ""
  });

  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const predict = async () => {
    setLoading(true);
    setPrice(null);

    try {
      const res = await axios.post(
        "https://airbnb-lustrous-songbird-4.fly.dev/predict",
        {
          bedrooms: Number(form.bedrooms),
          bathrooms: Number(form.bathrooms),
          accommodates: Number(form.accommodates)
        }
      );
      setPrice(res.data.predicted_price);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };
  const codigo = `
dt = pd.read_csv("listings.csv")

# dejamos precios como numeros y dejamos las variables a usar eliminando tambien filas vacias
dt["price"] = dt["price"].replace("[$,]", "", regex=True).astype(float)
dt = dt[["price", "bedrooms", "bathrooms", "accommodates"]].dropna()

# sacamos las mas caras para que no altere el modelo
dt = dt[dt["price"] < 500]

# definimos variables independientes y la variable objetivo
X = dt[["bedrooms", "bathrooms", "accommodates"]]
y = dt["price"]

# dividimos los datos 80% para entrenar el modelo y 20% para ver si funciona bien en datos nuevos
Xt, Xv, yt, yv = train_test_split(X, y, test_size=0.2, random_state=42)

# comparamos ambos modelos para evaluar resultados
ml = LinearRegression()
ml.fit(Xt, yt)

rf = RandomForestRegressor(random_state=42)
rf.fit(Xt, yt)

pl = ml.predict(Xv)
pr = rf.predict(Xv)

el = mean_absolute_error(yv, pl)
rl = r2_score(yv, pl)

er = mean_absolute_error(yv, pr)
rr = r2_score(yv, pr)

importancia = rf.feature_importances_

# De donde obtenemos los siguientes resultados: 

# LR
# MAE: 38.95
# R2: 0.42

# RF
# MAE: 36.93
# R2: 0.47

# Importancia de variables
# bedrooms: 0.719
# bathrooms: 0.111
# accommodates: 0.17

`;

  return (
    <Container fluid className="bg-light">
      <Row className="vh-100 d-flex align-items-center justify-content-center">
        <Col md={6}>
          <Card style={{ padding: "30px", borderRadius: "12px" }}>
            <Card.Body>
              <Card.Title className="text-center mb-4">
                Precio recomendado para Airbnb en Seattle
              </Card.Title>
              <Form>
                <Form.Control
                  name="bedrooms"
                  placeholder="Dormitorios"
                  onChange={handleChange}
                  className="mb-3"
                />
                <Form.Control
                  name="bathrooms"
                  placeholder="Baños"
                  onChange={handleChange}
                  className="mb-3"
                />
                <Form.Control
                  name="accommodates"
                  placeholder="Cantidad de huéspedes"
                  onChange={handleChange}
                  className="mb-4"
                />
                <Button variant="danger" className="w-100" onClick={predict}>
                  Calcular precio
                </Button>
              </Form>
              <div className="text-center mt-4">
                {loading && <Spinner animation="border" variant="danger" />}
                {!loading && price && (
                  <h4>Precio estimado: USD {price.toFixed(2)}</h4>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="d-flex align-items-center">
          <div style={{ padding: "10px" }}>
            <h3>¿Cómo funciona esto?</h3>
            <p>
              Esta aplicación estima el precio por noche que deberia tener un propiedad para alquilar en Airbnb dentro de la ciudad de Seattle usando un modelo de machine learning.
            </p>
            <p>
              El modelo fue entrenado con datos reales de Airbnb y usa variables basicas como dormitorios, baños y capacidad, que son los factores que mas influyen en el precio.
            </p>
            <p>
              Use un Random Forest porque no asume una relación lineal entre las variables y el precio, y en pruebas funcionó un poco mejor que una regresión lineal aunque, como se puede ver en los resultados de la ejecucion, ninguno fue muy preciso, ademas se puede observar como el tamaño del alojamiento es el factor que mas influye en el precio.
            </p>
            <p>
              El backend esta hecho en Python con FastAPI y desplegado en Fly.io, mientras que el frontend esta en React y se comunica con la API para obtener la predicción.
            </p>
            <p>
              Es una versión muy simplificada del problema real, no tiene en cuenta datos como la ubicacion que influye bastante y tiene un error aproximado de 37 dolares, pero sirve para mostrar como se pueden usar datos para estimar precios.
            </p>
          </div>
        </Col>
      </Row>
      <Row className="p-4">
        <Col>
          <h3>Codigo del modelo:</h3>
          <SyntaxHighlighter language="python" style={oneDark}>
            {codigo}
          </SyntaxHighlighter>
        </Col>
      </Row>
    </Container>
  );
}