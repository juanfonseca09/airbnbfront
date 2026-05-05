import { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Form, Button, Card, Spinner } from "react-bootstrap";
import { FaGithub } from "react-icons/fa";
import "./App.css";

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
    <div className="app-bg">
      <Container className="py-5">
        <Row className="mb-5 text-center text-white">
          <Col>
            <h1 className="fw-bold text-uppercase">
              Estimador de Precios de Airbnb
            </h1>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md={5}>
            <Card className="project-card shadow-sm border-0">
              <Card.Body>
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
                  {loading && (
                    <div>
                      <Spinner animation="border" variant="danger" />
                      <p style={{ color: "#dc3545", marginTop: "10px", fontSize: "14px" }}>
                        (puede tardar un poco)
                      </p>
                    </div>
                  )}
                  {!loading && price && (
                    <h5>Precio estimado: USD {price.toFixed(2)}</h5>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={5}>
            <Card className="project-card shadow-sm border-0">
              <Card.Body>
                <h5 className="text-uppercase mb-3">
                  ¿Cómo funciona?
                </h5>
                <p className="text-muted">
                  Esta aplicación estima el precio por noche que deberia tener un propiedad para alquilar en Airbnb dentro de la ciudad de Seattle usando un modelo de machine learning.
                </p>
                <p className="text-muted">
                  El modelo fue entrenado con datos reales de Airbnb y usa variables basicas como dormitorios, baños y capacidad, que son los factores que mas influyen en el precio.
                </p>
                <p className="text-muted">
                  Use un Random Forest porque no asume una relación lineal entre las variables y el precio, y en pruebas funcionó un poco mejor que una regresión lineal aunque, como se puede ver en los resultados de la ejecucion, ninguno fue muy preciso, ademas se puede observar como el tamaño del alojamiento es el factor que mas influye en el precio.
                </p>
                <p className="text-muted">
                  El backend esta hecho en Python con FastAPI y desplegado en Fly.io, mientras que el frontend esta en React y se comunica con la API para obtener la predicción.
                </p>
                <p className="text-muted mb-3">
                  Es una versión muy simplificada del problema real, no tiene en cuenta datos como la ubicacion que influye bastante y tiene un error aproximado de 37 dolares, pero sirve para mostrar como se pueden usar datos para estimar precios.
                </p>
                <a
                  href="https://github.com/juanfonseca09/airbnb/blob/main/airbnb.ipynb"
                  target="_blank"
                  rel="noreferrer"
                  className="github-btn"
                >
                  <FaGithub style={{ marginRight: "6px" }} />
                  Ver código
                </a>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}