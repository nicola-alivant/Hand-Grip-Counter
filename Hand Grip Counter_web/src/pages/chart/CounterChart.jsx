import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebase";
import { eachDayOfInterval, format, subDays } from "date-fns";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function CounterChart() {
  const [showFilter, setShowFilter] = useState(false);
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    date_start: format(subDays(new Date(), 30), "yyyy-MM-dd"),
    date_end: format(new Date(), "yyyy-MM-dd"),
    grip_training: "",
    trained_hand: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const fetchChartData = async (type) => {
    if (type === "reset") {
      setForm({
        date_start: format(subDays(new Date(), 30), "yyyy-MM-dd"),
        date_end: format(new Date(), "yyyy-MM-dd"),
        grip_training: "",
        trained_hand: "",
      });
    }

    let conditions = [];

    // Tanggal
    if (form.date_start && form.date_end) {
      conditions.push(
        where("exercise_date", ">=", format(form.date_start, "yyyy/MM/dd"))
      );
      conditions.push(
        where("exercise_date", "<=", format(form.date_end, "yyyy/MM/dd"))
      );
      conditions.push(where("training_type", "==", "Counter"));
    }

    // Filter enum
    if (form.grip_training) {
      conditions.push(where("grip_training", "==", form.grip_training));
    }

    if (form.trained_hand) {
      conditions.push(where("trained_hand", "==", form.trained_hand));
    }

    const collectionRef = collection(db, "grip");
    const queryData = query(collectionRef, ...conditions);
    const snapshot = await getDocs(queryData);

    const raw = snapshot.docs.map((doc) => doc.data());

    // Buat struktur data per hari
    const days = eachDayOfInterval({
      start: new Date(form.date_start),
      end: new Date(form.date_end),
    });

    const dailyStats = days.map((day) => {
      const formattedDay = format(day, "yyyy/MM/dd");
      const entries = raw.filter(
        (entry) => entry.exercise_date === formattedDay
      );
      const totalReps = entries.reduce(
        (sum, entry) => sum + entry.repetition,
        0
      );

      return {
        date: format(day, "MM/dd"),
        repetition: totalReps,
      };
    });

    setData(dailyStats);
  };

  useEffect(() => {
    fetchChartData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-4">
      <div className="d-flex justify-content-end mb-2">
        <Form.Check
          type="switch"
          id="toggle-filter"
          label={showFilter ? "Hide Filter" : "Show Filter"}
          checked={showFilter}
          onChange={() => setShowFilter(!showFilter)}
        />
      </div>

      {showFilter && (
      <Row className="gy-3 gx-4 mb-4 justify-content-center">
        <Col xs={12} md="auto">
          <Form.Group controlId="date_start">
            <Form.Label>Date Start</Form.Label>
            <Form.Control
              type="date"
              name="date_start"
              value={form.date_start}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>

        <Col xs={12} md="auto">
          <Form.Group controlId="date_end">
            <Form.Label>Date End</Form.Label>
            <Form.Control
              type="date"
              name="date_end"
              value={form.date_end}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>

        <Col xs={12} md="auto">
          <Form.Group>
            <Form.Label>Training Type</Form.Label>
            <select
              className="form-control"
              id="training_type"
              name="training_type"
              value={form.training_type}
              onChange={handleChange}
            >
              <option value="Counter">Counter</option>
              <option value="Stopwatch">Stopwatch</option>
            </select>
          </Form.Group>
        </Col>

        <Col xs={12} md="auto">
          <Form.Group>
            <Form.Label>Grip Training</Form.Label>
            <select
              className="form-control"
              id="grip_training"
              name="grip_training"
              type="number"
              value={form.grip_training}
              onChange={handleChange}
            >
              <option value="">All</option>
              <option value="Normal Grip">Normal Grip</option>
              <option value="Reverse Grip">Reverse Grip</option>
            </select>
          </Form.Group>
        </Col>

        <Col xs={12} md="auto">
          <Form.Group>
            <Form.Label>Trained Hand</Form.Label>
            <select
              className="form-control"
              id="trained_hand"
              name="trained_hand"
              type="number"
              value={form.trained_hand}
              onChange={handleChange}
            >
              <option value="">All</option>
              <option value="Left">Left</option>
              <option value="Right">Right</option>
            </select>
          </Form.Group>
        </Col>

        <Col xs={12} md="auto" className="d-flex align-items-end gap-2">
          <Button
            style={{ backgroundColor: "#20c997", borderColor: "#20c997" }}
            size="md"
            className="w-50"
            onClick={() => fetchChartData()}
          >
            Filter
          </Button>
          <Button
            variant="secondary"
            size="md"
            className="w-50"
            onClick={() => fetchChartData("reset")}
          >
            Reset
          </Button>
        </Col>
      </Row>
      )}

      <Card className="p-4 mb-5">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="repetition" fill="#8884d8" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
