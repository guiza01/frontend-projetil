"use client";

import { useEffect, useState } from "react";
import { projectService } from "@/services/projectService";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Carousel from "@/components/Carousel";
import { ImageInterface } from "@/components/ImageInterface";
import NavBarDefault from "@/components/NavBarDefault";
import { useRouter } from "next/navigation";

interface Project {
    id: number;
    title: string;
    description: string;
    link: string;
    technicalDetails: string;
    statisticsResults: string;
    documentation: string;
    segments: { id: number; name: string }[] | string[];
    platforms: { id: number; name: string }[] | string[];
    languages: { id: number; name: string }[] | string[];
    images: ImageInterface[];
}


export default function DetailsPage() {
    const { id } = useParams();
    const [project, setProject] = useState<Project>();
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        const fetchProject = async () => {
            if (!id) return;

            try {
                const data = await projectService.getProjectById(Number(id));
                setProject({
                    ...data,
                    segments: data.segments || [],
                    platforms: data.platforms || [],
                    languages: data.languages || [],
                });
            } catch (error) {
                console.error("Erro ao buscar projeto:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <p className="text-gray-600 text-xl">Carregando...</p>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <p className="text-red-600 text-xl">Erro ao carregar o projeto.</p>
            </div>
        );
    }

    return (
        <div className="items-center bg-[#0C111C] justify-items-center mb-16 min-h-screen">
            <nav className="w-full border-b border-[#222A3B] bg-[#141924]">
                <div className="container mx-auto flex p-4 items-center relative">
                    <div className="block lg:hidden">
                        <NavBarDefault />
                    </div>
                    <div className="flex items-center w-full ml-4 lg:w-auto lg:justify-between justify-start">
                        <img
                            src="/logoProjetil.png"
                            className="mr-4 h-[28px] w-[42px] md:h-[39.84px] md:w-[59.77px]"
                        />
                        <h1 className="font-inter font-semibold text-[#EBEFF8] text-[24px] md:text-[28.46px]">
                            Projétil
                        </h1>
                    </div>
                    <div className="hidden lg:flex items-center ml-16 text-[18px]">
                        <NavBarDefault />
                    </div>
                </div>
            </nav>
            <div className="container sm:ml-8 md:ml-16 lg:ml-32 flex items-center gap-4 mt-4 justify-start w-full">
                <Button
                    onClick={() => router.push("/")}
                    className="bg-[#172250] ml-4 text-white hover:bg-[#374dc5] rounded-xl flex items-center justify-center w-[50px] sm:w-[60px] md:w-[70px] h-[44px] sm:h-[50px] md:h-[54px]"
                >
                    <ArrowLeft className="text-[#4761FF]" />
                </Button>
                <h1 className="text-[#EBEFF8] text-[18px] sm:text-[20px] md:text-[24px] font-inter">Voltar</h1>
            </div>

            <div className="container mt-6 sm:mt-8 p-6 sm:p-8 md:p-12 flex flex-col md:flex-row bg-[#141924] rounded-xl w-full text-[#EBEFF8]">
                <div className="w-full md:w-1/2 order-2 md:order-1">
                    <h1 className="text-[24px] sm:text-[28px] md:text-[32px] font-chakra">{project.title}</h1>
                    <p className="text-gray-300 font-inter text-[16px] sm:text-[18px] md:text-[20px] mt-4 w-full md:w-4/5">{project.description}</p>

                    <div className="flex gap-2 flex-wrap mt-4">
                        {project.languages.map((language, index) => (
                            <div key={index} className="text-[#EBEFF8] font-inter border border-[#222A3B] rounded-md px-2 py-1 text-sm sm:text-base">
                                {typeof language === "string" ? language : language.name}
                            </div>
                        ))}
                    </div>
                    <Button className="w-full sm:w-[80%] md:w-[60%] mt-4 bg-[#3C52EF] text-[#EBEFF8] hover:bg-[#3145D0]">
                        <Link href={`/Details/${project.id}`} className="text-[16px] sm:text-[18px] md:text-[20px] font-chakra">Ver ambiente de demonstração</Link>
                    </Button>
                </div>

                <div className="w-full md:w-1/2 flex justify-center items-center mb-4 md:mb-0 order-1 md:order-2">
                    {project.images.filter(img => img.isCover === true).map((img) => (
                        <img key={img.id} src={img.urlImage} alt={project.title} className="w-full h-56 sm:h-64 md:h-80 object-cover rounded-lg shadow-lg" />
                    ))}
                </div>
            </div>

            <div className="container p-6 sm:p-8 md:p-12 flex flex-col md:flex-row rounded-xl w-full text-[#EBEFF8]">
                <div className="w-full md:w-1/2 flex flex-col justify-center items-start">
                    <h1 className="text-[#EBEFF8] text-[32px] sm:text-[40px] md:text-[48px] font-chakra">Mais detalhes</h1>
                    <h2 className="text-[#EBEFF8] text-[24px] sm:text-[28px] md:text-[32px]">Sobre o projeto</h2>
                </div>
                <div className="w-full md:w-1/2 mt-4 md:mt-0">
                    <p className="text-gray-300 text-[16px] sm:text-[18px] md:text-[20px]">{project.technicalDetails}</p>
                </div>
            </div>

            <div className="container w-full bg-[#141924] p-6 sm:p-8 md:p-10 rounded-xl">
                {project.images && project.images.length > 0 ? (
                    <Carousel images={project.images.filter(img => !img.isCover).map(img => img.urlImage)} />
                ) : (
                    <p className="text-[#EBEFF8] text-center">Nenhuma imagem disponível</p>
                )}
            </div>

            <div className="container p-6 sm:p-8 md:p-12 gap-6 sm:gap-8 md:gap-10 flex flex-col md:flex-row w-full text-[#EBEFF8]">
                <div className="bg-[#141924] w-full md:w-1/2 p-6 sm:p-8 md:p-10 rounded-xl">
                    <h2 className="text-xl sm:text-2xl font-semibold text-[#EBEFF8]">Resultados</h2>
                    <p className="text-gray-300 mt-2">{project.statisticsResults}</p>
                </div>
                <div className="bg-[#141924] w-full md:w-1/2 p-6 sm:p-8 md:p-10 rounded-xl">
                    <h2 className="text-xl sm:text-2xl font-semibold text-[#EBEFF8]">Documentação</h2>
                    <p className="text-gray-300 mt-2">{project.documentation}</p>
                </div>
            </div>

        </div>
    );
}
