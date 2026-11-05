import { Button } from '../components/Button';

export default function NotFound() {
  return (
    <div className="page notfound container">
      <span className="mono accent">404 · Layer not found</span>
      <h1 className="display-xl">This layer hasn’t been designed yet.</h1>
      <Button to="/" label="Home">Back to the stack</Button>
    </div>
  );
}
