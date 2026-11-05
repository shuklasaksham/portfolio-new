import { CLink, Footer, Label } from './parts';

export default function NotFound() {
  return (
    <div className="cf-page">
      <section className="cf-notfound">
        <Label>404</Label>
        <h1 className="cf-about__title">This page isn’t in the index.</h1>
        <CLink to="/" className="cf-btn cf-btn--solid">Back to the work →</CLink>
      </section>
      <Footer />
    </div>
  );
}
