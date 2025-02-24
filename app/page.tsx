"use client";
import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import NavBarDefault from "@/components/NavBarDefault";
import { useProjectContext } from "./contexts/ProjectContext";

export default function Home() {
  const [selectedLink] = useState("Tudo");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [hoveredId, setHoveredId] = useState<number | null>();

  const {
    projects,
    pageNumber,
    totalPages,
    segmentId,
    platformId,
    languageId,
    handlePageChange,
    fetchProjects,
    handleRemoveFilters
  } = useProjectContext();

  useEffect(() => {
    if (selectedLink === "Tudo") {
      fetchProjects(pageNumber, segmentId, platformId, languageId);
    }
  }, []);

  return (
    <div className="items-center bg-[#0C111C] justify-items-center min-h-screen">
      <nav className="w-full border-b border-[#222A3B] bg-[#141924]">
        <div className="container mx-auto flex md:px-0 px-4 py-4 items-center relative">
          <div className="block lg:hidden">
            <NavBarDefault />
          </div>
          <button
            onClick={handleRemoveFilters}
          >
          <div className="flex items-center w-full lg:w-auto lg:justify-between justify-start">
            <img
              src="/logoProjetil.png"
              className="mr-4 h-[28px] w-[42px] md:h-[39.84px] md:w-[59.77px]"
            />
            <h1 className="font-inter font-semibold text-[#EBEFF8] text-[24px] md:text-[28.46px]">
              Projétil
            </h1>
          </div>
          </button>
          <div className="hidden lg:flex items-center ml-16 text-[18px]">
            <NavBarDefault />
          </div>
        </div>
      </nav>

      {selectedLink === "Tudo" && (
        <div className="container mt-8 text-[#EBEFF8]">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center bg-banner mr-4 ml-4 md:mr-0 md:ml-0 p-4 rounded-xl mt-[2rem] h-auto md:h-[164px]">
            <img src="/logoBranca.png" className="w-[100px] md:w-[100px] lg:w-[122px] h-auto" />
            <h1 className="text-[20px] md:text-[32px] lg:text-[32px] md:text-left">
              Nosso propósito é impulsionar o seu projeto
            </h1>
          </div>

          <div className="flex flex-wrap justify-center mt-8 w-full">
            <div className="relative w-full md:w-auto ml-4 mr-4 md:mt-0">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#586175] text-lg" />
              <input
                type="text"
                placeholder="O que você procura?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-[750px] border border-[#222A3B] pl-10 bg-[#141924] text-[#AAB4CB] p-2 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {projects.map((project) => (
              <Link
                href={`/Details/${project.id}`}
                className="block"
                key={project.id}>
                <div
                  className="bg-[#141824] hover:border h-full hover:border-[#4761FF] p-4 rounded-xl shadow-lg cursor-pointer"
                  onMouseEnter={() => setHoveredId(project.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div className="relative w-full h-60 rounded-lg overflow-hidden">
                    <img
                      src={project.images?.find(img => img.isCover)?.urlImage || "/placeholder.jpg"}
                      alt={project.title}
                      className="w-full h-full object-cover rounded-lg transition-opacity duration-300"
                      style={{ opacity: hoveredId === project.id ? 0.2 : 1 }}
                    />
                    {hoveredId === project.id && (
                      <div className="absolute inset-0 flex items-start justify-center text-[#EBEFF8] text-lg font-bold p-4 text-start">
                        {project.description.length > 200
                          ? project.description.slice(0, 200) + "..."
                          : project.description}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <h2 className="text-[20px] md:text-[24px] text-[#EBEFF8] font-bold mt-4">
                      {project.title}
                    </h2>

                    <div
                      className={`relative mt-4 max-h-[40px] hidden lg:block rounded-md p-[1px] transition-all ${hoveredId === project.id
                        ? "bg-gradient-to-r from-[#00C0FF] via-[#4761FF] via-[#860DFF] via-[#C514C8] via-[#FF1A72] via-[#FF6F1E] to-[#FF8900]"
                        : "bg-transparent"
                        }`}
                    >
                      <button className="flex items-center justify-center w-full h-full bg-[#172250] text-[#EBEFF8] max-h-[40px] rounded-md px-3 py-2 transition-all hover:border-transparent">
                        <ArrowRight className="text-[#4761FF]" />
                      </button>
                    </div>
                  </div>

                  <p className="text-[#EBEFF8] mt-2 line-clamp-2">{project.description}</p>

                  <div className="flex gap-2 mt-4 flex-wrap">
                    {project.languages.map((language) => (
                      <div
                        key={language.id}
                        className="text-[#EBEFF8] border border-[#222A3B] rounded-md px-3 py-2 transition-all hover:bg-[#586175]"
                      >
                        {language.name}
                      </div>
                    ))}
                  </div>

                  <div className="lg:hidden mt-4 w-full">
                    <Button className="w-full bg-[#3C52EF] text-[#EBEFF8] hover:bg-[#3145D0]">
                      Ver detalhes
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="py-10">
            <div className="container flex flex-wrap justify-between mt-4 p-4 bg-[#141824] items-center">
              <button
                className="flex items-center bg-[#141924] text-[#AAB4CB] hover:text-[#EBEFF8] disabled:text-[#AAB4CB] p-2"
                onClick={() => handlePageChange(pageNumber - 1, segmentId, platformId, languageId)}
                disabled={pageNumber === 1}
              >
                <FaArrowLeft className={`mr-2 ${pageNumber === 1 ? 'text-[#586175]' : 'text-[#4761FF]'}`} />
                <span className="hidden sm:inline-flex">Anterior</span>
              </button>
              <span className="text-[#AAB4CB]">{pageNumber} de {totalPages}</span>
              <button
                className="flex items-center bg-[#141924] text-[#AAB4CB] hover:text-[#EBEFF8] disabled:text-[#AAB4CB] p-2"
                onClick={() => handlePageChange(pageNumber + 1, segmentId, platformId, languageId)}
                disabled={pageNumber === totalPages}
              >
                <span className="hidden sm:inline-flex">Próximo</span>
                <FaArrowRight className={`ml-2 ${pageNumber === totalPages ? 'text-[#586175]' : 'text-[#4761FF]'}`} />
              </button>
            </div>
          </div>
        </div>
      )
      }
    </div >
  );
}
