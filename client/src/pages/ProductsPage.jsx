import { useDeferredValue, useEffect, useState, useTransition } from "react";
import { useSearchParams } from "react-router-dom";
import ProductGrid from "../components/ProductGrid.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { ProductGridSkeleton } from "../components/LoadingState.jsx";
import { fetchProducts } from "../lib/api.js";

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
  const [selectedAudience, setSelectedAudience] = useState(searchParams.get("audience") || "All");
  const [inStockOnly, setInStockOnly] = useState(searchParams.get("inStock") === "true");
  const [catalog, setCatalog] = useState({ products: [], categories: ["All"], audiences: ["All"] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFilterPending, startFilterTransition] = useTransition();
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchProducts({
          search: deferredSearch,
          category: selectedCategory !== "All" ? selectedCategory : "",
          audience: selectedAudience !== "All" ? selectedAudience : "",
          inStock: inStockOnly ? "true" : "",
        });

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

    loadProducts();
    return () => {
      isMounted = false;
    };
  }, [deferredSearch, inStockOnly, selectedAudience, selectedCategory]);

  useEffect(() => {
    const nextParams = {};

    if (search) {
      nextParams.search = search;
    }

    if (selectedCategory !== "All") {
      nextParams.category = selectedCategory;
    }

    if (selectedAudience !== "All") {
      nextParams.audience = selectedAudience;
    }

    if (inStockOnly) {
      nextParams.inStock = "true";
    }

    setSearchParams(nextParams, { replace: true });
  }, [inStockOnly, search, selectedAudience, selectedCategory, setSearchParams]);

  const categories = catalog.categories?.length ? catalog.categories : ["All"];
  const audiences = catalog.audiences?.length ? catalog.audiences : ["All"];

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Catalog"
        title="Browse fireworks by category"
      />

      <section className="surface-panel rounded-[32px] border border-white/50 p-5 shadow-glow sm:p-6">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_auto] lg:items-center">
          <div>
            <label className="field-label text-slate-700">Search products</label>
            <input
              value={search}
              onChange={(event) =>
                startFilterTransition(() => {
                  setSearch(event.target.value);
                })
              }
              placeholder="Search rockets, sparklers, combo packs..."
              className="input-field"
            />
          </div>
          <label className="mt-1 inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(event) =>
                startFilterTransition(() => {
                  setInStockOnly(event.target.checked);
                })
              }
              className="h-4 w-4 rounded border-slate-300 text-orange-500"
            />
            Show in-stock items only
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5 sm:mt-5 sm:gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() =>
                startFilterTransition(() => {
                  setSelectedCategory(category);
                })
              }
              className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-medium leading-none transition sm:px-3 sm:py-1.5 sm:text-[11px] ${
                category === selectedCategory
                  ? "bg-slate-900 text-white"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-orange-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5 sm:mt-5 sm:gap-2">
          {audiences.map((audience) => (
            <button
              key={audience}
              type="button"
              onClick={() =>
                startFilterTransition(() => {
                  setSelectedAudience(audience);
                })
              }
              className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-medium leading-none transition sm:px-3 sm:py-1.5 sm:text-[11px] ${
                audience === selectedAudience
                  ? "bg-slate-900 text-white"
                  : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {audience}
            </button>
          ))}
        </div>

        <div className="mt-5 text-sm text-slate-500">
          {isFilterPending ? "Updating filters..." : `${catalog.products.length} product(s) found`}
        </div>
      </section>

      {error ? (
        <div className="rounded-[28px] border border-rose-400/30 bg-rose-500/10 p-5 text-sm text-rose-100">{error}</div>
      ) : loading ? (
        <ProductGridSkeleton />
      ) : (
        <ProductGrid
          products={catalog.products}
          emptyTitle="No fireworks matched those filters"
          emptyDescription="Try another search term or switch back to all categories."
        />
      )}
    </div>
  );
}

export default ProductsPage;
