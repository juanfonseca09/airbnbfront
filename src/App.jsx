import { useState } from "react";
import axios from "axios";
import { Container, Row, Col, Form, Button, Card, Spinner } from "react-bootstrap";

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

  return (
    <Container fluid className="vh-100 d-flex align-items-center justify-content-center bg-light">
      <Row style={{ width: "90%" }}>
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
                  style={{ height: "50px", fontSize: "16px" }}
                />
                <Form.Control
                  name="bathrooms"
                  placeholder="Baños"
                  onChange={handleChange}
                  className="mb-3"
                  style={{ height: "50px", fontSize: "16px" }}
                />
                <Form.Control
                  name="accommodates"
                  placeholder="Cantidad de huéspedes"
                  onChange={handleChange}
                  className="mb-4"
                  style={{ height: "50px", fontSize: "16px" }}
                />
                <Button variant="danger" className="w-100" onClick={predict}>
                  Calcular precio
                </Button>
              </Form>
              <div className="text-center mt-4" style={{ minHeight: "60px" }}>
                {loading && <Spinner animation="border" variant="danger" />}
                {!loading && price && (
                  <h4>
                    Precio estimado: USD {price.toFixed(2)}
                  </h4>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="d-flex align-items-center">
          <div style={{ padding: "20px" }}>
            <h3>¿Cómo funciona esto?</h3>
            <p>
              Esta aplicación estima el precio por noche que deberia tener un propiedad para alquilar en Airbnb dentro de la ciudad de Seattle usando un modelo de machine learning.
            </p>
            <p>
              El modelo fue entrenado con datos reales de Airbnb y usa variables basicas como dormitorios, baños y capacidad, que son los factores que mas influyen en el precio.
            </p>
            <p>
              Use un Random Forest porque no asume una relación lineal entre las variables y el precio, y en pruebas simples funcionó mejor que una regresión lineal.
            </p>
            <p>
              El backend esta hecho en Python con FastAPI y está desplegado en Fly.io, mientras que el frontend esta en React y se comunica con la API para obtener la predicción.
            </p>
            <p>
              Es una versión muy simplificada del problema real, no tiene en cuenta datos como la ubicacion que influye bastante y tiene un error aproximado de 37 dolares, pero sirve para mostrar como se pueden usar datos para estimar precios.
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
