import WarrantyDetails from "../../_components/WarrantyDetails";
import { use } from 'react';


type Params = Promise<{ id: string}>

export default async function WarrantyDetailsPage(
  props: { params: Params }) {
    const params = use(props.params);
  return <WarrantyDetails warrantyId={params.id} />;
}