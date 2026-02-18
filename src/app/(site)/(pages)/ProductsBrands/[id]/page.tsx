import ProductsBrands from "@/components/CommonBrands/ProductsBrands";

export default async function BrandProductsPage({ params }) {
  const resolvedParams = await params; 

  return <ProductsBrands id={resolvedParams.id} />;
}
