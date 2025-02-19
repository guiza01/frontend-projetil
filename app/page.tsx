"use client";
import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { FaArrowLeft, FaArrowRight, FaBars, FaTimes } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { projectService } from "@/services/projectService";
import Link from "next/link";

interface Project {
  id: number;
  title: string;
  description: string;
  link: string;
  segments: string[];
  platforms: string[];
  languages: { id: number; name: string }[];
  images?: { urlImage: string; isCover: boolean }[];
}

export default function Home() {
  const [selectedLink, setSelectedLink] = useState("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pageSize = 6;

  useEffect(() => {
    if (selectedLink === "Tudo") {
      fetchProjects();
    }
  }, [selectedLink, currentPage]);

  const fetchProjects = async () => {
    try {
      const response = await projectService.getAllProjects(currentPage, pageSize);

      const formattedProjects: Project[] = response.items.map((project) => ({
        ...project,
        languages: project.languages.map((lang) =>
          typeof lang === "string" ? { id: 0, name: lang } : lang
        ),
      }));

      setTotalPages(Math.ceil(response.totalItems / pageSize));
      setProjects(formattedProjects);
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
    }
  };

  return (
    <div className="items-center bg-[#0C111C] justify-items-center p-4 min-h-screen">
      <nav className="container border-b border-[#222A3B] m-auto bg-[#141924] flex p-4 items-center relative">
        <button
          onClick={() => setIsMenuOpen(true)}
          className="lg:hidden text-[#586175] p-2"
        >
          <FaBars size={24} />
        </button>

        <div className="flex items-center w-full ml-[3rem] lg:w-auto lg:justify-between justify-start">
          <img src="/logoProjetil.png" className="mr-4 h-[28] w-[42] md:h-[39.84px] md:w-[59.77px]" />
          <h1 className="font-inter font-semibold text-[#EBEFF8] text-[24px] md:text-[28.46px]">Projétil</h1>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden fixed top-0 left-0 w-full h-full bg-[#141924] bg-opacity-80 flex flex-col items-center justify-center z-10">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-4 right-4 text-white z-20"
            >
              <FaTimes size={24} />
            </button>
            <div className="text-center">
              <a
                href="#"
                className={`block text-[#EBEFF8] ${selectedLink === "Tudo" ? "text-[#4761FF]" : "hover:text-[#4761FF]"}`}
                onClick={() => setSelectedLink("Tudo")}
              >
                Tudo
              </a>
              <a
                href="#"
                className={`block text-[#EBEFF8] ${selectedLink === "Segmento" ? "text-[#4761FF]" : "hover:text-[#4761FF]"}`}
                onClick={() => setSelectedLink("Segmento")}
              >
                Segmento de negócio
              </a>
              <a
                href="#"
                className={`block text-[#EBEFF8] ${selectedLink === "Tecnologia" ? "text-[#4761FF]" : "hover:text-[#4761FF]"}`}
                onClick={() => setSelectedLink("Tecnologia")}
              >
                Tecnologia
              </a>
              <a
                href="#"
                className={`block text-[#EBEFF8] ${selectedLink === "Plataforma" ? "text-[#4761FF]" : "hover:text-[#4761FF]"}`}
                onClick={() => setSelectedLink("Plataforma")}
              >
                Plataforma
              </a>
            </div>
          </div>
        )}

        <div className="flex items-center ml-16 text-[24px] flex-wrap hidden lg:flex">
          <a
            href="#"
            className={`mr-4 text-[#EBEFF8] ${selectedLink === "Tudo" ? "text-[#4761FF]" : "hover:text-[#4761FF]"}`}
            onClick={() => setSelectedLink("Tudo")}
          >
            Tudo
          </a>
          <a
            href="#"
            className={`mr-4 text-[#EBEFF8] ${selectedLink === "Segmento" ? "text-[#4761FF]" : "hover:text-[#4761FF]"}`}
            onClick={() => setSelectedLink("Segmento")}
          >
            Segmento de negócio
          </a>
          <a
            href="#"
            className={`mr-4 text-[#EBEFF8] ${selectedLink === "Tecnologia" ? "text-[#4761FF]" : "hover:text-[#4761FF]"}`}
            onClick={() => setSelectedLink("Tecnologia")}
          >
            Tecnologia
          </a>
          <a
            href="#"
            className={`mr-4 text-[#EBEFF8] ${selectedLink === "Plataforma" ? "text-[#4761FF]" : "hover:text-[#4761FF]"}`}
            onClick={() => setSelectedLink("Plataforma")}
          >
            Plataforma
          </a>
        </div>
      </nav>

      {selectedLink === "Tudo" && (
        <div className="container mt-8 text-white">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center bg-banner p-4 rounded-xl mt-[2rem] h-auto md:h-[228px]">
            <img src="/logoBranca.png" className="w-[100px] md:w-[140px] lg:w-[180px] h-auto" />
            <h1 className="text-[20px] md:text-[32px] lg:text-[56px] md:text-left">
              Nosso propósito é impulsionar o seu projeto
            </h1>
          </div>

          <div className="flex flex-wrap justify-between mt-4 w-full">
            <h1 className="text-[28px] md:text-[32px] font-chakra">Projetos</h1>
            <div className="relative text-black flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
              <FiSearch className="absolute left-2 text-[#586175]" />
              <input
                type="text"
                placeholder="O que você procura?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-auto pl-10 bg-[#222A3B] text-[#AAB4CB] p-2 rounded"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {projects.map((project) => (
              <div key={project.id} className="bg-[#141824] p-4 rounded-lg shadow-lg">
                <img
                  src={project.images?.find(img => img.isCover)?.urlImage || "/placeholder.jpg"}
                  alt={project.title}
                  className="w-full h-60 object-cover rounded-lg"
                />
                <div className="flex justify-between">
                  <h2 className="text-[20px] md:text-[24px] text-[#EBEFF8] font-bold mt-4">
                    {project.title}
                  </h2>
                  <Button
                    className="mt-4 bg-[#172250] text-white hover:bg-[#374dc5] flex items-center justify-center hidden lg:block"
                  >
                    <Link href={`/Details/${project.id}`}>
                      <ArrowRight className="text-[#4761FF]" />
                    </Link>
                  </Button>
                </div>
                <p className="text-[#EBEFF8] mt-2 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex gap-2 mt-4 flex-wrap">
                  {project.languages.map((language) => (
                    <div key={language.id} className="text-[#EBEFF8] border border-[#222A3B] rounded-md px-3 py-2">
                      {language.name}
                    </div>
                  ))}
                </div>

                <div className="lg:hidden mt-4 w-full">
                  <Button
                    className="w-full bg-[#3C52EF] text-[#EBEFF8] hover:bg-[#3145D0]"
                  >
                    <Link href={`/Details/${project.id}`}>
                      Ver detalhes
                    </Link>
                  </Button>
                </div>
              </div>
            ))}

          </div>
          <div className="container flex flex-wrap justify-between mt-4 mb-16 bg-[#141824] items-center">
            <Button
              variant="outline"
              className="flex items-center bg-[#141924] text-[#AAB4CB] hover:bg-[#1f2635]"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <FaArrowLeft className="mr-2" />
              Anterior
            </Button>
            <span className="text-[#AAB4CB]">{currentPage} de {totalPages}</span>
            <Button
              variant="outline"
              className="flex items-center bg-[#141924] text-[#AAB4CB] hover:bg-[#1f2635]"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Próximo
              <FaArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
