import { Link } from 'react-router-dom';
import { Accent, Footer, Label } from './ui';

export default function NotFound() {
  return (
    <div className="page">
      <section className="wrap grid nf">
        <div className="nf__main">
          <Label tone="accent">Error 404</Label>
          <h1 className="h-case"><Accent text="This page isn’t in the dossier." accent="dossier." /></h1>
          <p className="chead__sum">The link may be old, or the case study may have moved. Everything current is on the work index.</p>
          <div className="hero__ctas">
            <Link className="btn btn--solid" to="/">Back to the work →</Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
