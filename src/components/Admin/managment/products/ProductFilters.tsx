import React from "react";
import { TextInput, Select, Button } from "@mantine/core";

function ProductFilter({
  filters,
  setFilters,
  categories,
  filteredSubcategories,
  brandsList,
  onReset,
}) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <TextInput
          variant="filled"
          radius="xl"
          placeholder="Search by product name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <Select
          variant="filled"
          radius="xl"
          data={categories}
          value={filters.category}
          placeholder="Category"
          clearable
          onChange={(value) =>
            setFilters({ ...filters, category: value || "" })
          }
        />
        <Select
          variant="filled"
          radius="xl"
          data={filteredSubcategories}
          value={filters.subcategory}
          placeholder="Subcategory"
          clearable
          onChange={(value) =>
            setFilters({ ...filters, subcategory: value || "" })
          }
        />
        <Select
          variant="filled"
          radius="xl"
          data={brandsList}
          value={filters.brand}
          placeholder="Brand"
          clearable
          onChange={(value) => setFilters({ ...filters, brand: value || "" })}
        />{" "}
       
      </div>

    </>
  );
}

export default ProductFilter;
