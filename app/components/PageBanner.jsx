export default function PageBanner({ title, subtitle, breadcrumb }) {
    return (
        <section className="page-banner">
            <div className="container">
                <div className="page-banner-content">
                    <h1>{title}</h1>
                </div>
            </div>
        </section>
    );
}

