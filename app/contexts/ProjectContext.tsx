"use client"
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
    segments: { id: number; name: string }[] | string[];
    platforms: { id: number; name: string }[] | string[];
    languages: { id: number; name: string }[] | string[];
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
    handlePageChange: (newPage: number) => void;
    setFilters: (segmentId: number, platformId: number, languageId: number) => void;
    fetchProjects: (pageNumber: number, segmentId?: number, platformId?: number, languageId?: number) => void;
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

    const itemsPerPage = 5;

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

    useEffect(() => {
        fetchProjects(pageNumber, segmentId, platformId, languageId)
    }, [pageNumber, segmentId, platformId, languageId]);

    const handlePageChange = (newPage: number) => {
        setPageNumber(newPage);
    };

    const setFilters = (segmentId: number, platformId: number, languageId: number) => {
        setSegmentId(segmentId);
        setPlatformId(platformId);
        setLanguageId(languageId);
    };

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
            fetchProjects
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
