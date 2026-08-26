import { MapPinIcon, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export type NominatimLocation = {
    name?: string;
    display_name?: string;
    lat: number | string;
    lon: number | string;
    address?: {
        house_number?: string;
        road?: string;
        neighbourhood?: string;
        suburb?: string;
        quarter?: string;

        city?: string;
        town?: string;
        village?: string;
        municipality?: string;

        state?: string;
        postcode?: string;

        country?: string;
        country_code?: string;

        "ISO3166-2-lvl4"?: string;
    };
};

type NominatimLocationCardProps = {
    location: NominatimLocation;
    onEdit?: (location: NominatimLocation) => void;
};

export function NominatimLocationCard({
    location,
    onEdit,
}: NominatimLocationCardProps) {
    const address = location.address;

    const name =
        location.name ??
        location.display_name?.split(",")[0] ??
        "Unnamed location";

    const street = [
        address?.house_number,
        address?.road,
    ]
        .filter(Boolean)
        .join(" ");

    const city =
        address?.city ??
        address?.town ??
        address?.village ??
        address?.municipality;

    const state = address?.state;

    const stateCode =
        address?.["ISO3166-2-lvl4"]?.replace(/^US-/, "");

    const zip = address?.postcode;

    const country = address?.country;

    const countryCode = address?.country_code?.toUpperCase();

    return (
        <div className="flex w-full items-center gap-3 px-3 py-2">
            <div className="flex w-fit">
                <MapPinIcon size={16} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex flex-col items-start w-full gap-0">
                    <h3 className="text-md">{name}</h3>
                    <p className="text-xs">{`${street}, ${city}, ${state}, ${country}`}</p>
                </div>
            </div>
        </div>
    )

}