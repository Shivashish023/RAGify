function Card({ children, className = "", flat = false, ...props }) {
  return (
    <div
      className={`${flat ? "card-surface-flat" : "card-surface"} transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({ children, className = "" }) {
  return (
    <div className={`border-b border-border/40 px-6 py-4 ${className}`}>{children}</div>
  );
}

function CardBody({ children, className = "" }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

export { Card, CardHeader, CardBody };
