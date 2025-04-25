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

export default function MonthlyChart() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    date_start: format(subDays(new Date(), 30), "yyyy/MM/dd"),
    date_end: format(new Date(), "yyyy/MM/dd"),
    training_type: "Counter",
    grip_training: "",
    trained_hand: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const timeToSeconds = (timeStr) => {
    const parts = timeStr.split(":").map(Number);
    if (parts.length === 3) {
      const [hours, minutes, seconds] = parts;
      return hours * 3600 + minutes * 60 + seconds;
    }
    return 0;
  };

  const secondsToTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return [hrs, mins, secs]
      .map((val) => String(val).padStart(2, "0"))
      .join(":");
  };

  const parseRepetition = (repetition, trainingType) => {
    if (trainingType === "Stopwatch") {
      const parts = repetition.split(":").map(Number);
      if (parts.length === 3) {
        const [hours, minutes, seconds] = parts;
        return hours * 3600 + minutes * 60 + seconds;
      } else if (parts.length === 2) {
        const [minutes, seconds] = parts;
        return minutes * 60 + seconds;
      }
      return 0;
    }
    return Number(repetition);
  };

  const formatYAxis = (value) => {
    if (form.training_type === "Stopwatch") {
      // Tampilkan dalam format menit:detik
      const mins = Math.floor(value / 60);
      const secs = value % 60;
      return `${mins}:${String(secs).padStart(2, "0")}`;
    }
    return value; // Counter: langsung angka
  };

  const fetchChartData = async (type) => {
    if (type === "reset") {
      setForm({
        date_start: format(subDays(new Date(), 30), "yyyy/MM/dd"),
        date_end: format(new Date(), "yyyy/MM/dd"),
        training_type: "Counter",
        grip_training: "",
        trained_hand: "",
      });
      return;
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
      conditions.push(where("training_type", "==", form.training_type));
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
        (sum, entry) =>
          sum +
          (form.training_type == "Counter"
            ? entry.repetition
            : parseRepetition(entry.repetition, form.training_type)),
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

      <Card className="p-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis
              tickFormatter={formatYAxis}
              label={{
                value:
                  form.training_type === "Stopwatch"
                    ? "Duration (mm:ss)"
                    : "Reps",
                angle: -90,
                position: "insideLeft",
              }}
            />

            <Tooltip
              formatter={(value) =>
                form.training_type === "Stopwatch"
                  ? formatYAxis(value) + " (mm:ss)"
                  : value
              }
            />

            <Bar dataKey="repetition" fill="#8884d8" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
