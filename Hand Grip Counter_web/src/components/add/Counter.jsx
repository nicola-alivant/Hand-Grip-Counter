import "./add.css";
import { useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { db } from "./../../config/firebase";
import { addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Counter() {
  const [count, setCount] = useState(0);
  const [form, setForm] = useState({
    handheld_power: 5,
    grip_training: "Normal Grip",
  });
  const collectionRef = collection(db, "grip");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

  const handleSubmit = async () => {
    const currentDate = new Date();
    const getCurrentDate = formatDate(currentDate);
    const getCurrentTime = new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const weekday = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    let day = weekday[currentDate.getDay()];

    await addDoc(collectionRef, {
      exercise_date: getCurrentDate,
      exercise_day: day,
      exercise_time: getCurrentTime,
      grip_training: form.grip_training,
      training_type: "Counter",
      trained_hand: form.trained_hand,
      handheld_power: Number(form.handheld_power),
      repetition: count,
    });
    toast.success("Data berhasil ditambah!");
    navigate("/");
  };

  return (
    <>
      <div className="container">
        <label for="handheld_power">
          <h2>Handheld Power (Kg)</h2>
        </label>
        <input
          className="form-control"
          type="number"
          min={0}
          name="handheld_power"
          id="handheld_power"
          value={form.handheld_power}
          onChange={handleChange}
        />
        <br />
        <h2>Grip Training</h2>
        <select
          className="form-control"
          id="grip_training"
          name="grip_training"
          type="number"
          value={form.grip_training}
          onChange={handleChange}
        >
          <option value="Normal Grip">Normal Grip</option>
          <option value="Reverse Grip">Reverse Grip</option>
        </select>
        <br />
        <h2>Trained Hand</h2>
        <select
          className="form-control"
          id="trained_hand"
          name="trained_hand"
          type="number"
          value={form.trained_hand}
          onChange={handleChange}
        >
          <option value="Left">Left</option>
          <option value="Right">Right</option>
        </select>
        <br />
        <h2>Repetition</h2>
        <Row>
          <Col>
            <Button
              size="lg"
              variant="success"
              onClick={() => setCount((count) => count + 1)}
            >
              <h1>+</h1>
            </Button>
          </Col>
          <Col>
            <input
              className="form-control my-3 text-center"
              type="number"
              readOnly="true"
              min="0"
              name="repetition"
              id="repetition"
              value={count}
            />
          </Col>
          <Col>
            <Button
              size="lg"
              variant="danger"
              onClick={() =>
                setCount((count) => (count == 0 ? (count = 0) : count - 1))
              }
            >
              <h1>-</h1>
            </Button>
          </Col>
        </Row>
        <br />
        <div className="d-grid gap-2 mb-2 w-100">
          <Button size="md" style={{ backgroundColor: "#20c997", borderColor: "#20c997" }} onClick={() => handleSubmit()}>
            Submit
          </Button>
        </div>
      </div>
    </>
  );
}
