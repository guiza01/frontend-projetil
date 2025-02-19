'use client'

import {
    Navbar,
    NavbarContent,
} from "@nextui-org/navbar";
import React, { useEffect, useState } from "react";

import DropDown from "./Dropdown";
import { projectService } from "@/services/projectService";

export default function NavBarDefault() {

    const [segments, setSegments] = useState<{ id: number; name: string }[]>([]);
    const [technologies, setTechnologies] = useState<{ id: number; name: string }[]>([]);
    const [platforms, setPlatforms] = useState<{ id: number; name: string }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categories = await projectService.getMenuCategories();

                setSegments(categories["Segmentos de Negócio"] || []);
                setTechnologies(categories["Tecnologia"] || []);
                setPlatforms(categories["Plataforma"] || []);
            } catch (error) {
                console.error("Erro ao buscar os dados: ", error);
            }
        };

        fetchData();
    }, []);

    const [isMenuOpen] = useState(true);
    const [selectedLink, setSelectedLink] = useState("Tudo");


    return (
        <>
            <Navbar className="static bg-[#141924] text-[#EBEFF8]" isBlurred={false} maxWidth="xl">
                {isMenuOpen && (
                    <div className="lg:hidden fixed top-0 left-0 w-full h-full bg-[#141924] bg-opacity-95 flex flex-col items-center z-10">
                        <div className="text-center mt-10">
                            <a
                                href="#"
                                className={`block text-[#EBEFF8] text-[24px] ${selectedLink === "Tudo" ? "text-[#4761FF]" : "hover:text-[#4761FF]"}`}
                                onClick={() => setSelectedLink("Tudo")}
                            >
                                Tudo
                            </a>
                            <DropDown
                                ariaLabel="Negócio"
                                buttonLabel="Segmento de negócio"
                                type="Segment"
                                dropdownItems={segments}
                            />

                            <DropDown
                                ariaLabel="Techs"
                                buttonLabel="Tecnologia"
                                type="Language"
                                dropdownItems={technologies}
                            />

                            <DropDown
                                ariaLabel="Plataforma"
                                buttonLabel="Plataforma"
                                type="Platform"
                                dropdownItems={platforms}
                            />
                        </div>
                    </div>
                )}
                <NavbarContent className="hidden sm:flex gap-4" justify="start">
                    <DropDown ariaLabel="Negócio" buttonLabel="Segmento de negócio" type="Segment" dropdownItems={segments} />
                    <DropDown ariaLabel="Techs" buttonLabel="Tecnologia" type="Language" dropdownItems={technologies} />
                    <DropDown ariaLabel="Plataforma" buttonLabel="Plataforma" type="Platform" dropdownItems={platforms} />
                </NavbarContent>
            </Navbar>
        </>
    );
}
