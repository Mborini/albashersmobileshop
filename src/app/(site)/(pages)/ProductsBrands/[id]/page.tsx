import ProductsBrands from "@/components/CommonBrands/ProductsBrands";

export default async function BrandProductsPage({ params }) {
 
  return <ProductsBrands id={params.id} />;
}
