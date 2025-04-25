import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../../config/firebase";
import { Button, Card, Col, Row, Modal, Form } from "react-bootstrap";
import { toast } from "react-toastify";

export default function List() {
  const [lists, setLists] = useState([]);
  const [form, setForm] = useState({ 
    date_start: "", 
    date_end: "",
    grip_training: "",
    training_type: "",
    trained_hand: "",
  });
  const [show, setShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const collectionRef = collection(db, "grip");

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

  const getLists = async (type) => {
    let queryData;
    if (!type) {
      const start = new Date(form.date_start);
      const end = new Date(form.date_end);

      let conditions = [];

      // Tanggal
      if (form.date_start && form.date_end) {
        conditions.push(where("exercise_date", ">=", formatDate(start)));
        conditions.push(where("exercise_date", "<=", formatDate(end)));
      }

      // Filter enum
      if (form.grip_training) {
        conditions.push(where("grip_training", "==", form.grip_training));
      }

      if (form.training_type) {
        conditions.push(where("training_type", "==", form.training_type));
      }

      if (form.trained_hand) {
        conditions.push(where("trained_hand", "==", form.trained_hand));
      }

      queryData = query(
        collection(db, "grip"),
        ...conditions,
        orderBy("exercise_date", "desc"),
        orderBy("exercise_time", "desc")
      );
    } else {
      queryData = query(
        collectionRef,
        orderBy("exercise_date", "desc"),
        orderBy("exercise_time", "desc")
      );
      form.date_start = "";
      form.date_end = "";
      form.grip_training = "";
      form.training_type = "";
      form.trained_hand = "";
    }
    const data = await getDocs(queryData);
    setLists(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    getLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteList = async (id) => {
    try {
      const docRef = doc(db, "grip", id);
      await deleteDoc(docRef);
      toast.success("Data berhasil dihapus!");
      getLists();
      handleClose();
    } catch (error) {
      toast.error("Gagal menghapus data.");
      console.error(error);
    }
  };

  const handleClose = () => {
    setShow(false);
    setSelectedItem(null);
  };

  const handleShow = (item) => {
    setSelectedItem(item);
    setShow(true);
  };

  return (
    <>
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
              <option value="">All</option>
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
            onClick={() => getLists()}
          >
            Filter
          </Button>
          <Button
            variant="secondary"
            size="md"
            className="w-50"
            onClick={() => getLists("reset")}
          >
            Reset
          </Button>
        </Col>
      </Row>

      <Row className="mb-[80px]">
        {lists.map((list) => (
          <Col xs={6} sm={6} md={3} className="my-2" key={list.id}>
            <Card
              onClick={() => handleShow(list)}
              className="border rounded-lg shadow hover:shadow-md transition"
              style={{ backgroundColor: "#f8f9fa", cursor: "pointer" }}
            >
              <Card.Body>
                <Card.Title>
                  <h2 className="text-lg" style={{ color: "#2c2f33" }}>
                    {list.exercise_day}
                  </h2>
                </Card.Title>
                <Card.Subtitle className="my-2 text-muted">
                  {list.exercise_date} - {list.exercise_time}
                </Card.Subtitle>
                <Card.Text>
                  <p>
                    <strong>Training Type:</strong> {list.training_type}
                  </p>
                  <p>
                    <strong>Grip Training:</strong> {list.grip_training}
                  </p>
                  <p>
                    <strong>Handheld Power:</strong> {list.handheld_power} Kg
                  </p>
                  <p>
                    <strong>Repetition:</strong> {list.repetition}
                  </p>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure to delete this data?
          <br />
          <strong>
            {selectedItem?.exercise_day}, {selectedItem?.exercise_date} -{" "}
            {selectedItem?.exercise_time}
          </strong>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => deleteList(selectedItem?.id)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
