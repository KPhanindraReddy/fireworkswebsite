import EmptyState from "../components/EmptyState.jsx";

function NotFoundPage() {
  return (
    <EmptyState
      title="Page not found"
      description="The link may be outdated, or the page may have moved. Head back to the catalog to continue shopping."
      actionLabel="Go to products"
      actionTo="/products"
    />
  );
}

export default NotFoundPage;
