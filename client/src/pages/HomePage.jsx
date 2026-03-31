import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductGrid from "../components/ProductGrid.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { ProductGridSkeleton } from "../components/LoadingState.jsx";
import { fetchProducts } from "../lib/api.js";

function HomePage() {
  const [catalog, setCatalog] = useState({ products: [], categories: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadCatalog = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();

        if (isMounted) {
          setCatalog(data);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = catalog.categories.filter((category) => category !== "All").slice(0, 6);
  const audiences = (catalog.audiences || []).filter((audience) => audience !== "All").slice(0, 7);
  const homeProducts = catalog.products.slice(0, 8);

  return (
    <div className="space-y-8 sm:space-y-10">
      <section className="space-y-4 sm:space-y-5">
        <SectionHeading
          eyebrow="Categories"
          title="Browse by type"
          actionLabel="View full catalog"
          actionTo="/products"
        />

        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {categories.map((category) => (
            <Link
              key={category}
              to={`/products?category=${encodeURIComponent(category)}`}
              className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-2.5 py-1 text-center text-[10px] font-medium leading-none text-slate-900 transition hover:bg-slate-50 sm:px-3 sm:py-1.5 sm:text-[11px]"
            >
              {category}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {audiences.map((audience) => (
            <Link
              key={audience}
              to={`/products?audience=${encodeURIComponent(audience)}`}
              className="whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-center text-[10px] font-medium leading-none text-slate-700 transition hover:bg-slate-100 sm:px-3 sm:py-1.5 sm:text-[11px]"
            >
              {audience}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <SectionHeading
          eyebrow="Products"
          title="Featured crackers"
          actionLabel="Open all products"
          actionTo="/products"
        />

        {error ? (
          <div className="rounded-[28px] border border-rose-300 bg-rose-50 p-5 text-sm text-rose-700">{error}</div>
        ) : loading ? (
          <ProductGridSkeleton />
        ) : (
          <ProductGrid
            products={homeProducts}
            emptyTitle="Products will appear here"
            emptyDescription="Add products from the admin panel and they will show on the home page."
          />
        )}
      </section>
    </div>
  );
}

export default HomePage;
