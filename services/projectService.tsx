import axios from "axios";

const baseUrlApi = process.env.NEXT_PUBLIC_URL_API;

interface Image {
    id: number,
    urlImage: string,
    projectId: number,
    isCover: boolean
}

interface Project {
    id: number;
    title: string;
    description: string;
    link: string;
    technicalDetails: string;
    statisticsResults: string;
    documentation: string;
    segments: string[];
    platforms: string[];
    languages: string[];
    images: Image[];
}

interface Category {
    id: number;
    name: string;
}

interface MenuCategories {
    [category: string]: Category[];
}

export const projectService = {
    async getMenuCategories(): Promise<MenuCategories> {
        try {
            const [segmentsRes, languagesRes, platformsRes] = await Promise.all([
                axios.get(`${baseUrlApi}/Segments`),
                axios.get(`${baseUrlApi}/Languages`),
                axios.get(`${baseUrlApi}/Platforms`),
            ]);

            const [segmentsData, languagesData, platformsData] = await Promise.all([
                segmentsRes.data,
                languagesRes.data,
                platformsRes.data,
            ]);

            return {
                "Segmentos de Negócio": segmentsData.map((segment: Category) => ({
                    id: segment.id,
                    name: segment.name,
                })),
                "Tecnologia": languagesData.map((language: Category) => ({
                    id: language.id,
                    name: language.name,
                })),
                "Plataforma": platformsData.map((platform: Category) => ({
                    id: platform.id,
                    name: platform.name,
                })),
            };
        }
        catch (error) {
            console.error("Erro ao buscar categorias do menu:", error);
            throw error;
        }
    },

    async getAllProjects(
        pageNumber: number,
        pageSize: number,
        segmentId?: number | null,
        platformId?: number | null,
        languageId?: number | null
    ): Promise<{ items: Project[], totalItems: number }> {
        try {
            const params = new URLSearchParams({
                PageNumber: pageNumber.toString(),
                PageSize: pageSize.toString(),
            });
    
            if (segmentId !== null && segmentId !== undefined) {
                params.append("SegmentId", segmentId.toString());
            }
            if (platformId !== null && platformId !== undefined) {
                params.append("PlatformId", platformId.toString());
            }
            if (languageId !== null && languageId !== undefined) {
                params.append("LanguageId", languageId.toString());
            }
    
            const response = await axios.get(`${baseUrlApi}/Projects/All?PageNumber=${pageNumber}&PageSize=${pageSize}`);
            
            if (!Array.isArray(response.data.items)) {
                console.error("Resposta inesperada da API:", response.data);
                throw new Error("Formato de resposta inválido.");
            }
    
            return {
                items: response.data.items.map((project: Project) => ({
                    id: project.id,
                    title: project.title,
                    description: project.description,
                    link: project.link,
                    technicalDetails: project.technicalDetails,
                    statisticsResults: project.statisticsResults,
                    documentation: project.documentation,
                    languages: project.languages || [],
                    platforms: project.platforms || [],
                    segments: project.segments || [],
                    images: project.images || [],
                })),
                totalItems: response.data.totalItems
            };
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error("Erro ao buscar projetos:", error.response?.data || error.message);
                throw new Error(error.response?.data?.message || "Erro ao carregar projetos.");
            }
            throw new Error("Erro ao carregar projetos.");
        }
    },       

    async getProjectById(id: number): Promise<Project> {
        try {
            const response = await axios.get(`${baseUrlApi}/Projects/${id}`);
            const project = response.data;
    
            const formattedProject: Project = {
                id: project.id || null,
                title: project.title || '',
                description: project.description || '',
                link: project.link || '',
                technicalDetails: project.technicalDetails || '',
                statisticsResults: project.statisticsResults || [],
                documentation: project.documentation || '',
                languages: project.languages || [],
                platforms: project.platforms || [],
                segments: project.segments || [],
                images: project.images || [],
            };
    
            return formattedProject;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Erro ao buscar projeto:", error.response?.data || error.message);
            } else {
                console.error("Erro inesperado:", error);
            }
            throw error;
        }
    },    

    async addSubcategory(category: string, name: string): Promise<Category> {
        try {
            const categoryUrlMap: { [key: string]: string } = {
                "Segmentos de Negócio": `${baseUrlApi}/Segments`,
                "Linguagens": `${baseUrlApi}/Languages`,
                "Plataforma": `${baseUrlApi}/Platforms`,
            };

            const url = categoryUrlMap[category];

            const response = await axios.post(url, { name });
            return response.data;
        } catch (error) {
            console.error("Erro ao adicionar subcategoria:", error);
            throw error;
        }
    },

    async deleteProject(id: number): Promise<void> {
        try {
            await axios.delete(`${baseUrlApi}/Projects/${id}`);
        } catch (error) {
            console.error("Erro ao excluir o projeto:", error);
            throw new Error("Não foi possível excluir o projeto. Tente novamente.");
        }
    },
};