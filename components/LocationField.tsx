'use client'

import { NominatimLocation, NominatimLocationCard } from "@/components/NominatimLocationCard";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LocationEdit, LocationEditIcon, SearchIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";

type Place = {
    name: string;
    lat: number;
    lon: number;
};

export default function LocationField(props: {
    selected: NominatimLocation | null,
    onSelect: (newPlace: Place) => any
}) {

    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [places, setPlaces] = useState<Place[] | null>(null);
    const [query, setQuery] = useState("")

    useEffect(() => {

        if (query.length < 3) {
            setPlaces([]);
            return;
        }

        const controller = new AbortController();

        const timeout = setTimeout(async () => {
            try {
                setLoading(true);

                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?` +
                    `q=${encodeURIComponent(query)}` +
                    `&format=json` +
                    `&addressdetails=1` +
                    `&limit=8` +
                    `&viewbox=-88.4,42.45,-87.3,41.35` +
                    `&bounded=1`,
                    {
                        signal: controller.signal,
                        headers: {
                            "Accept-Language": "en",
                        },
                    }
                );

                const data = await res.json();

                const results: Place[] = data;

                setPlaces(results.slice(0, 8) as any);
            } catch (err) {
                if ((err as Error).name !== "AbortError") {
                    console.error(err);
                }
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => {
            clearTimeout(timeout);
            controller.abort();
        };

    }, [query])




    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger className={'w-full'}>

                <Field>
                    <FieldLabel><LocationEdit size={16} /> Location</FieldLabel>
                    <div className="p-1 pb-0 w-full shadow-lg rounded-md">

                        {props.selected ? (
                            <div className="flex w-full gap-1 flex-col">
                                <div className={'flex w-full h-fit p-1 border border-border rounded-md'}>
                                    <NominatimLocationCard
                                        {...{
                                            location: props.selected
                                        }}
                                    />
                                </div>
                                <Button variant={'outline'}>Edit</Button>
                            </div>
                        ) : (

                            <InputGroup className="rounded-lg! border-input/30 bg-input/30 shadow-none! *:data-[slot=input-group-addon]:pl-2! bg-white w-full flex gap-2"
                                role="combobox"
                                aria-expanded={open}
                            >
                                <div className="w-full text-base text-left truncate outline-hidden disabled:cursor-not-allowed opacity-50"> {query || "Search address..."}</div>
                                <InputGroupAddon>
                                    <SearchIcon className="size-4 shrink-0 opacity-50" />
                                </InputGroupAddon>
                            </InputGroup>
                        )}
                    </div>
                </Field>

            </PopoverTrigger>

            <PopoverContent
                className="left-0 p-0 w-[var(--anchor-width)] max-w-[400px] "
                side="bottom"
                align="start"
                sideOffset={-44} // overlap the trigger
            >
                <Command shouldFilter={false}>
                    <CommandInput
                        className="w-full text-base"
                        placeholder="Search address..."
                        value={query}
                        onValueChange={setQuery}
                    />

                    <CommandList className="relative max-h-[40vh] py-0">



                        {loading && (
                            <CommandEmpty>
                                Searching...
                            </CommandEmpty>
                        )}

                        {!loading && (!places || places.length === 0) && query.length >= 3 && (
                            <CommandEmpty>
                                No addresses found.
                            </CommandEmpty>
                        )}

                        <CommandGroup>
                            {places && places.map((place) => (
                                <CommandItem
                                    key={`${place.lat}-${place.lon}`}
                                    value={place.name}
                                    onSelect={() => {
                                        // onSelect(place);
                                        // setQuery(place.name);
                                        props.onSelect(place)
                                        setIsOpen(false);
                                    }}
                                    className="p-0 w-full"
                                >
                                    <NominatimLocationCard {...{
                                        location: place
                                    }} />
                                </CommandItem>
                            ))}
                        </CommandGroup>

                        {query && query != "" && (
                            <div className="flex w-full p-0 sticky bottom-0 z-100">
                                <Button variant={'outline'} className={'w-full'} size={'lg'} onClick={e => {
                                    setQuery("")
                                }} >
                                    <XIcon className="size-4 shrink-0 opacity-50" />
                                    Clear
                                </Button>
                            </div>
                        )}


                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}