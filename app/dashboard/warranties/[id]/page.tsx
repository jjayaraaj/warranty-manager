import WarrantyDetails from "../../_components/WarrantyDetails";



type Params = Promise<{ id: string}>



export default async function WarrantyDetailsPage({
  params,
}: {
  params: Params
}) {
  const slug = (await params).id
  return  <WarrantyDetails warrantyId={slug} />;
}