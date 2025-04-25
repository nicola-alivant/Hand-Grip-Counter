import { Tab, Tabs } from "react-bootstrap";
import Stopwatch from "./Stopwatch";
import Counter from "./Counter";

export default function Add() {
  return (
    <>
      <Tabs defaultActiveKey="counter" className="mb-3">
        <Tab eventKey="counter" title="Counter">
          <Counter />
        </Tab>
        <Tab eventKey="stopwatch" title="Stopwatch">
          <Stopwatch />
        </Tab>
      </Tabs>
    </>
  );
}
