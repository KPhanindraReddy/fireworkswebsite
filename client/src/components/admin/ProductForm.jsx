const categoryOptions = [
  "Rockets",
  "Fountains",
  "Flower Pots",
  "Ground Spinners",
  "Sparklers",
  "Aerial Cakes",
  "Bombs",
  "Gift Boxes",
];

const audienceOptions = ["All Ages", "Kids 5+", "Boys", "Girls", "Men", "Women", "Family"];

function ProductForm({
  form,
  onFieldChange,
  onSubmit,
  onCancel,
  editing,
  saving,
  uploadPending,
  onUpload,
}) {
  return (
    <form onSubmit={onSubmit} className="surface-panel rounded-[32px] border border-slate-200 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Admin Panel</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-slate-900">
            {editing ? "Edit product" : "Add new product"}
          </h2>
        </div>
        {editing ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium"
          >
            Clear
          </button>
        ) : null}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="field-label">Product name</label>
          <input
            value={form.name}
            onChange={(event) => onFieldChange("name", event.target.value)}
            className="input-field"
            placeholder="Sky Shot Rocket Pack"
            required
          />
        </div>

        <div>
          <label className="field-label">Category</label>
          <select
            value={form.category}
            onChange={(event) => onFieldChange("category", event.target.value)}
            className="input-field"
            required
          >
            <option value="">Select category</option>
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="field-label">Audience</label>
          <select
            value={form.audience}
            onChange={(event) => onFieldChange("audience", event.target.value)}
            className="input-field"
          >
            {audienceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="field-label">Price (INR)</label>
          <input
            type="number"
            min="0"
            value={form.price}
            onChange={(event) => onFieldChange("price", event.target.value)}
            className="input-field"
            placeholder="699"
            required
          />
        </div>

        <div>
          <label className="field-label">Stock</label>
          <input
            type="number"
            min="0"
            value={form.stock}
            onChange={(event) => onFieldChange("stock", event.target.value)}
            className="input-field"
            placeholder="40"
            required
          />
        </div>

        <div>
          <label className="field-label">Pack size</label>
          <input
            value={form.packSize}
            onChange={(event) => onFieldChange("packSize", event.target.value)}
            className="input-field"
            placeholder="10 rockets"
          />
        </div>

        <div>
          <label className="field-label">Tags</label>
          <input
            value={form.tags}
            onChange={(event) => onFieldChange("tags", event.target.value)}
            className="input-field"
            placeholder="festival, family, colorful"
          />
        </div>

        <div className="md:col-span-2">
          <label className="field-label">Description</label>
          <textarea
            rows="4"
            value={form.description}
            onChange={(event) => onFieldChange("description", event.target.value)}
            className="input-field"
            placeholder="Describe the crackers, pack contents, and celebration use."
            required
          />
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <input
            id="featured"
            type="checkbox"
            checked={form.featured}
            onChange={(event) => onFieldChange("featured", event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-slate-900"
          />
          <label htmlFor="featured" className="text-sm font-medium text-slate-700">
            Mark as featured product
          </label>
        </div>

        <div className="md:col-span-2">
          <label className="field-label">Image URLs</label>
          <textarea
            rows="3"
            value={form.imagesInput}
            onChange={(event) => onFieldChange("imagesInput", event.target.value)}
            className="input-field"
            placeholder="Paste one or more image URLs, separated by commas"
          />
        </div>

        <div className="md:col-span-2">
          <label className="field-label">Upload product image</label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="file"
              accept="image/*"
              onChange={(event) => onUpload(event.target.files?.[0])}
              className="block w-full rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm"
            />
            <span className="text-sm text-slate-500">
              {uploadPending ? "Uploading image..." : "Upload a cracker image, then save the product."}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button type="submit" disabled={saving} className="warm-button disabled:opacity-70">
          {saving ? "Saving..." : editing ? "Update Product" : "Create Product"}
        </button>
        {editing ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl border border-slate-300 px-5 py-3 font-medium text-slate-700"
          >
            Cancel edit
          </button>
        ) : null}
      </div>
    </form>
  );
}

export default ProductForm;
