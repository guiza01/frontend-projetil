"use client";

import { useProjectContext } from "@/app/contexts/ProjectContext";
import { Button } from "@nextui-org/button";
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
} from "@nextui-org/dropdown";
import { NavbarItem } from "@nextui-org/navbar";
import { useEffect, useState } from "react";

interface DropdownItemProps {
    id: number;
    name: string;
}

interface DropdownProps {
    buttonLabel: string;
    ariaLabel: string;
    dropdownItems: DropdownItemProps[];
    type: "Segment" | "Platform" | "Language";
}

const DropDown: React.FC<DropdownProps> = ({ buttonLabel, ariaLabel, dropdownItems, type }) => {
    const { pageNumber, fetchProjects } = useProjectContext();

    const [segmentId, setSegmentId] = useState<number>();
    const [platformId, setPlatformId] = useState<number>();
    const [languageId, setLanguageId] = useState<number>();

    const handleSelect = (id: number) => {
        switch (type) {
            case "Segment":
                setSegmentId(id)
                break;
            case "Platform":
                setPlatformId(id)
                break;
            case "Language":
                setLanguageId(id)
                break;
            default:
                break;
        }
    };
    
    useEffect(() => {
        fetchProjects(pageNumber, segmentId, platformId, languageId);
    }, [pageNumber, segmentId, platformId, languageId]);

    return (
        <Dropdown>
            <NavbarItem>
                <DropdownTrigger>
                    <Button
                        disableRipple
                        className="p-0 text-[24px] bg-transparent data-[hover=true]:bg-transparent"
                        radius="sm"
                        variant="light"
                    >
                        {buttonLabel}
                    </Button>
                </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu
                aria-label={ariaLabel}
                className="w-[280px] bg-[#0C111C] rounded-xl p-1 shadow-lg list-none"
                itemClasses={{
                    base: 'gap-4',
                }}
            >
                {dropdownItems.map((item) => (
                    <DropdownItem
                        key={item.id}
                        className="text-start hover:bg-[#222A3B] p-2 rounded"
                        onPress={() => handleSelect(item.id)}
                    >
                        <span className="text-[16px] text-[#AAB4CB]">
                            {item.name}
                        </span>
                    </DropdownItem>
                ))}
            </DropdownMenu>
        </Dropdown>
    );
}

export default DropDown;