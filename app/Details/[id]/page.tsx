"use client";

import { useEffect, useState } from "react";
import { projectService } from "@/services/projectService";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Carousel from "@/components/Carousel";
import { ImageInterface } from "@/components/ImageInterface";
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
        <div className="items-center bg-[#0C111C] justify-items-center min-h-screen pt-[80px]">
            <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
                <nav className="w-full border-b border-[#222A3B] bg-[#141924] z-50">
                    <div className="container mx-auto flex items-center gap-4 py-4 justify-start w-full">
                        <button
                            onClick={() => router.push("/")}
                            className="bg-[#172250] hover:bg-[#172250] rounded-xl min-w-[60px] min-h-[50px] flex items-center justify-center ml-6 sm:ml-0"
                        >
                            <ArrowLeft className="text-[#4761FF] w-8 h-8" />
                        </button>
                        <h1 className="text-[#EBEFF8] text-[24px] sm:text-[24px] md:text-[24px] font-inter">Voltar</h1>
                    </div>
                </nav>
            </header>

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

            <div className="py-10">
                <div className="container gap-6 sm:gap-8 md:gap-10 flex flex-col md:flex-row w-full text-[#EBEFF8]">
                    <div className="bg-[#141924] w-full md:w-1/2 p-6 sm:p-8 md:p-10 rounded-xl border-2 border-transparent hover:border-[1px] hover:border-gradient-to-r hover:border-[#00C0FF] hover:border-t-[#4761FF] hover:border-l-[#860DFF] hover:border-r-[#C514C8] hover:border-b-[#FF1A72] hover:border-[#FF6F1E] hover:border-[#FF8900]">
                        <h2 className="text-xl sm:text-2xl font-semibold text-[#EBEFF8]">Resultados</h2>
                        <p className="text-gray-300 mt-2">{project.statisticsResults}</p>
                    </div>
                    <div className="bg-[#141924] w-full md:w-1/2 p-6 sm:p-8 md:p-10 rounded-xl border-2 border-transparent hover:border-[1px] hover:border-gradient-to-r hover:border-[#00C0FF] hover:border-t-[#00C0FF] hover:border-l-[#4761FF] hover:border-r-[#860DFF] hover:border-b-[#FF1A72] hover:border-[#FF6F1E] hover:border-[#FF8900]">
                        <h2 className="text-xl sm:text-2xl font-semibold text-[#EBEFF8]">Documentação</h2>
                        <p className="text-gray-300 mt-2">{project.documentation}</p>
                    </div>
                </div>
            </div>

        </div>
    );
}
