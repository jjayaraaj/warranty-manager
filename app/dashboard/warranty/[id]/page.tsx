import WarrantyDetails from "../../_components/WarrantyDetails";

export default function WarrantyDetailsPage({ params }: { params: { id: string } }) {
    return <WarrantyDetails warrantyId={params.id} />;
  }