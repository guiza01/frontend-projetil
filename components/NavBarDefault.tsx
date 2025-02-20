'use client'

import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { projectService } from "@/services/projectService";
import { Navbar, NavbarContent } from "@nextui-org/navbar";
import DropDown from "./Dropdown";

export default function NavBarDefault() {
    const [segments, setSegments] = useState<{ id: number; name: string }[]>([]);
    const [technologies, setTechnologies] = useState<{ id: number; name: string }[]>([]);
    const [platforms, setPlatforms] = useState<{ id: number; name: string }[]>([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedLink, setSelectedLink] = useState("Tudo");

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

    return (
        <>
            <Navbar className="bg-[#141924] text-[#EBEFF8]" isBlurred={false} maxWidth="xl">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-[#EBEFF8]">
                    {isMenuOpen ? <FaTimes size={24} className="text-[#8B8D98]" /> : <FaBars size={24} className="text-[#8B8D98]" />}
                </button>

                {isMenuOpen && (
                    <div className="absolute top-full left-[-18px] w-screen min-h-screen bg-[#141924] flex flex-col z-40 p-8 items-start">
                        <a
                            href="#"
                            className={`block text-[#EBEFF8] text-[18px] ${selectedLink === "Tudo" ? "text-[#4761FF]" : "hover:text-[#4761FF]"}`}
                            onClick={() => setSelectedLink("Tudo")}
                        >
                            Tudo
                        </a>
                        <DropDown ariaLabel="Negócio" buttonLabel="Segmento de negócio" type="Segment" dropdownItems={segments} />
                        <DropDown ariaLabel="Techs" buttonLabel="Tecnologia" type="Language" dropdownItems={technologies} />
                        <DropDown ariaLabel="Plataforma" buttonLabel="Plataforma" type="Platform" dropdownItems={platforms} />
                    </div>
                )}

                <NavbarContent className="hidden sm:flex gap-4" justify="start">
                    <a
                        href="#"
                        className={`block text-[#EBEFF8] text-[18px] ${selectedLink === "Tudo" ? "text-[#4761FF]" : "hover:text-[#4761FF]"}`}
                        onClick={() => setSelectedLink("Tudo")}
                    >
                        Tudo
                    </a>
                    <DropDown ariaLabel="Negócio" buttonLabel="Segmento de negócio" type="Segment" dropdownItems={segments} />
                    <DropDown ariaLabel="Techs" buttonLabel="Tecnologia" type="Language" dropdownItems={technologies} />
                    <DropDown ariaLabel="Plataforma" buttonLabel="Plataforma" type="Platform" dropdownItems={platforms} />
                </NavbarContent>
            </Navbar>
        </>
    );
}
