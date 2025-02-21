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
    const { handleChange } = useProjectContext();

    const handleSelect = (id: number) => {
        switch (type) {
            case "Segment":
                handleChange(id)
                break;
            case "Platform":
                handleChange(undefined, id)
                break;
            case "Language":
                handleChange(undefined, undefined, id)
                break;
            default:
                break;
        }
    };

    return (
        <Dropdown>
            <NavbarItem>
                <DropdownTrigger>
                    <Button
                        disableRipple
                        className="p-0 text-[18px] bg-transparent data-[hover=true]:bg-transparent"
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