"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { projectService } from "@/services/projectService";
import { ImageInterface } from "@/components/ImageInterface";

interface Project {
    id: number;
    title: string;
    description: string;
    link: string;
    technicalDetails: string;
    statisticsResults: string;
    documentation: string;
    languages: { id: number; name: string }[];
    platforms: { id: number; name: string }[];
    segments: { id: number; name: string }[];
    images: ImageInterface[];
}

interface ProjectContextType {
    projects: Project[];
    loading: boolean;
    pageNumber: number;
    totalPages: number;
    segmentId?: number;
    platformId?: number;
    languageId?: number;
    handlePageChange: (newPage: number, segmentId?: number, platformId?: number, languageId?: number) => void;
    setFilters: (segmentId: number, platformId: number, languageId: number) => void;
    fetchProjects: (pageNumber: number, segmentId?: number, platformId?: number, languageId?: number) => void;
    setPageNumber: (pageNumber: number) => void;
    handleChange: (newSegmentId?: number, newPlatformId?: number, newLanguageId?: number) => void;
    handleRemoveFilters: VoidFunction;
    //handleFilterProject: (title: string) => Promise<void>;
}

interface ProjectProviderProps {
    children: ReactNode;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: ProjectProviderProps) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [segmentId, setSegmentId] = useState<number>();
    const [platformId, setPlatformId] = useState<number>();
    const [languageId, setLanguageId] = useState<number>();

    const itemsPerPage = 6;

    const fetchProjects = async (pageNumber: number, segmentId?: number, platformId?: number, languageId?: number) => {
        setLoading(true);
        try {
            const data = await projectService.getAllProjects(pageNumber, itemsPerPage, segmentId, platformId, languageId);

            setProjects(data.items);
            setTotalPages(Math.ceil(data.totalItems / itemsPerPage));
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (newSegmentId?: number, newPlatformId?: number, newLanguageId?: number) => {
        if (newSegmentId !== undefined) setSegmentId(newSegmentId);
        if (newPlatformId !== undefined) setPlatformId(newPlatformId);
        if (newLanguageId !== undefined) setLanguageId(newLanguageId);
    };

    useEffect(() => {
        fetchProjects(pageNumber, segmentId, platformId, languageId)
    }, [pageNumber, segmentId, platformId, languageId]);

    const handlePageChange = (newPage: number, segmentId?: number, platformId?: number, languageId?: number) => {
        setPageNumber(newPage);
        setFilters(segmentId, platformId, languageId);
    };

    const setFilters = (segmentId?: number, platformId?: number, languageId?: number) => {
        setSegmentId(segmentId);
        setPlatformId(platformId);
        setLanguageId(languageId);
    };

    const handleRemoveFilters = () => {
        setSegmentId(undefined);
        setPlatformId(undefined);
        setLanguageId(undefined);
    };

    // const handleFilterProject = async (title: string) => {
    //     if (title.length < 3) {
    //         const data = await projectService.getAllProjects(pageNumber, totalPages * itemsPerPage);
    //         setProjects(data.items);
    //         return;
    //     }

    //     try {
    //         const data = await projectService.getAllProjects(pageNumber, totalPages * itemsPerPage);

    //         const filteredProjects = data.items.filter((project) => {
    //             const projectTitle = project.title.toLowerCase().trim();
    //             const searchTitle = title.toLowerCase().trim();

    //             return projectTitle.includes(searchTitle);
    //         });

    //         setProjects(filteredProjects);
    //     } catch (error) {
    //         console.error("Error fetching projects:", error);
    //     }
    // };

    return (
        <ProjectContext.Provider value={{
            projects,
            loading,
            pageNumber,
            totalPages,
            segmentId,
            platformId,
            languageId,
            handlePageChange,
            setFilters,
            fetchProjects,
            setPageNumber,
            handleChange,
            handleRemoveFilters
        }}>
            {children}
        </ProjectContext.Provider>
    );
};

export const useProjectContext = () => {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error("useProjectContext must be used within a ProjectProvider");
    }
    return context;
};
