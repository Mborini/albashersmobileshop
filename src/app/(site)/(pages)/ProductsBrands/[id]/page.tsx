import ProductsBrands from "@/components/CommonBrands/ProductsBrands";

export default async function BrandProductsPage({ params }) {
  // يمكنك هنا جلب البيانات
  // const data = await fetch(...);

  return <ProductsBrands id={params.id} />;
}
