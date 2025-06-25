// src/app/ProductsBrands/[id]/page.tsx

import ProductsBrands from "@/components/CommonBrands/ProductsBrands";


export default function BrandProductsPage({ params }: { params: { id: string } }) {
  return <ProductsBrands id={params.id} />;
}
