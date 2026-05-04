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
  const pythonCode = `
df = pd.read_csv("listings.csv")

df["price"] = df["price"].replace("[\\$,]", "", regex=True).astype(float)
df = df[["price", "bedrooms", "bathrooms", "accommodates"]].dropna()

df = df[df["price"] < 500]

X = df[["bedrooms", "bathrooms", "accommodates"]]
y = df["price"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

lr = LinearRegression()
lr.fit(X_train, y_train)

rf = RandomForestRegressor(random_state=42)
rf.fit(X_train, y_train)

y_pred_lr = lr.predict(X_test)
y_pred_rf = rf.predict(X_test)

mae_lr = mean_absolute_error(y_test, y_pred_lr)
r2_lr = r2_score(y_test, y_pred_lr)

mae_rf = mean_absolute_error(y_test, y_pred_rf)
r2_rf = r2_score(y_test, y_pred_rf)

print("LR")
print("MAE:", round(mae_lr, 2))
print("R2:", round(r2_lr, 2))

print("\\nRF")
print("MAE:", round(mae_rf, 2))
print("R2:", round(r2_rf, 2))

importancia = rf.feature_importances_
variables = X.columns

print("\\nImportancia de variables")
for i in range(len(variables)):
    print(variables[i], ":", round(importancia[i], 3))

joblib.dump(rf, "model.pkl")
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
          <div style={{ padding: "20px" }}>
            <h3>¿Cómo funciona esto?</h3>
            <p>Modelo de machine learning con Random Forest.</p>
          </div>
        </Col>
      </Row>
      <Row className="p-4">
        <Col>
          <h3>Código del modelo (Python)</h3>
          <SyntaxHighlighter language="python" style={oneDark}>
            {pythonCode}
          </SyntaxHighlighter>
        </Col>
      </Row>
    </Container>
  );
}