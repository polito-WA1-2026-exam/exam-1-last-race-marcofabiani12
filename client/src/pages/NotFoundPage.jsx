import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import './NotFoundPage.css';

function NotFoundPage() {
    return (
        <div className="not-found-page">
            <section className="not-found-card page-card">
                <div className="not-found-icon">
                    <i className="bi bi-signpost-split" />
                </div>

                <span className="metro-pill">
                    <i className="bi bi-exclamation-circle" />
                    Unknown route
                </span>

                <h1>Page not found</h1>

                <p>
                    The requested page does not exist or is no longer available.
                </p>

                <Button as={Link} to="/" variant="primary" size="lg" className="not-found-action">
                    <i className="bi bi-house-door" />
                    Back to Home
                </Button>
            </section>
        </div>
    );
}

export default NotFoundPage;