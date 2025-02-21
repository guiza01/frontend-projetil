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
    segments: { id: number; name: string }[];
    platforms: { id: number; name: string }[];
    languages: { id: number; name: string }[];
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
        segmentId?: number,
        platformId?: number,
        languageId?: number
    ): Promise<{ items: Project[], totalItems: number }> {
        const token = localStorage.getItem('token');

        const httpHeaders = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };

        let API_URL = `${baseUrlApi}/Projects/All?PageNumber=${pageNumber}&PageSize=${pageSize}`;

        if (segmentId && segmentId > 0) {
            API_URL += `&SegmentId=${segmentId}`;
        }
        if (platformId && platformId > 0) {
            API_URL += `&PlatformId=${platformId}`;
        }
        if (languageId && languageId > 0) {
            API_URL += `&LanguageId=${languageId}`;
        }

        try {
            const { data } = await axios.get(API_URL, { headers: httpHeaders });

            const projects: Project[] = data.items.map((project: Project) => ({
                ...project,
                images: project.images,
            }));

            return {
                items: projects,
                totalItems: data.totalItems,
            };
        } catch (error) {
            console.error('Failed to fetch projects', error);
            throw new Error('Failed to fetch projects');
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