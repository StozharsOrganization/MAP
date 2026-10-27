'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { localizePath, type Locale } from '../lib/i18n';
import { NewsItem, ProjectItem, TeamMember } from '../lib/types';
import { AdminRole, AdminSessionUser } from '../lib/auth';

interface AdminContextType {
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  currentUser: AdminSessionUser | null;
  setCurrentUser: (user: AdminSessionUser | null) => void;
  role: AdminRole | null;
  can: (action: 'content' | 'finances' | 'inbox') => boolean;
  toggleAdmin: () => void;
  
  // Admin Login Modal
  isAdminLoginOpen: boolean;
  openAdminLogin: () => void;
  closeAdminLogin: () => void;
  
  // Modals
  isCreateNewsOpen: boolean;
  editingNews: NewsItem | null;
  openCreateNews: (news?: NewsItem) => void;
  closeCreateNews: () => void;
  
  // Projects
  isProjectModalOpen: boolean;
  editingProject: ProjectItem | null;
  openProjectModal: (proj?: ProjectItem) => void;
  closeProjectModal: () => void;

  // Team
  isTeamModalOpen: boolean;
  editingTeam: TeamMember | null;
  openTeamModal: (member?: TeamMember) => void;
  closeTeamModal: () => void;

  // Donations
  isDonationOpen: boolean;
  donationProjectId: string | null;
  openDonation: (projectId?: string | React.MouseEvent | unknown) => void;
  closeDonation: () => void;

  // Volunteers
  isVolunteerOpen: boolean;
  openVolunteer: () => void;
  closeVolunteer: () => void;

  // Language
  language: 'ua' | 'en';
  setLanguage: (lang: 'ua' | 'en') => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({
  children,
  initialLanguage = 'ua',
}: {
  children: React.ReactNode;
  initialLanguage?: Locale;
}) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<AdminSessionUser | null>(null);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  const [isCreateNewsOpen, setIsCreateNewsOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);

  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<TeamMember | null>(null);

  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [donationProjectId, setDonationProjectId] = useState<string | null>(null);
  const [isVolunteerOpen, setIsVolunteerOpen] = useState(false);
  // Language comes from the URL (/en/... = English, everything else = Ukrainian)
  const language: Locale = initialLanguage;
  const router = useRouter();
  const pathname = usePathname();

  // Role permissions checker
  const can = (action: 'content' | 'finances' | 'inbox'): boolean => {
    if (!isAdmin || !currentUser) return false;
    if (currentUser.role === 'admin') return true;
    if (action === 'content' && currentUser.role === 'editor') return true;
    if (action === 'inbox' && (currentUser.role === 'coordinator' || currentUser.role === 'editor')) return true;
    return false;
  };

  // Verify server session on load
  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setIsAdmin(true);
          setCurrentUser(data.user);
        } else {
          setIsAdmin(false);
          setCurrentUser(null);
        }
      })
      .catch(() => {
        setIsAdmin(false);
        setCurrentUser(null);
      });

  }, []);

  const handleSetLanguage = (lang: 'ua' | 'en') => {
    if (lang === language) return;
    router.push(localizePath(pathname || '/', lang));
  };

  const openAdminLogin = () => setIsAdminLoginOpen(true);
  const closeAdminLogin = () => setIsAdminLoginOpen(false);

  const toggleAdmin = async () => {
    if (isAdmin) {
      // Logout
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
      } catch (err) {
        console.error('Logout error:', err);
      }
      setIsAdmin(false);
      setCurrentUser(null);
    } else {
      // Open password login modal
      setIsAdminLoginOpen(true);
    }
  };

  const openCreateNews = (news?: NewsItem) => {
    setEditingNews(news || null);
    setIsCreateNewsOpen(true);
  };

  const closeCreateNews = () => {
    setEditingNews(null);
    setIsCreateNewsOpen(false);
  };

  const openProjectModal = (proj?: ProjectItem) => {
    setEditingProject(proj || null);
    setIsProjectModalOpen(true);
  };

  const closeProjectModal = () => {
    setEditingProject(null);
    setIsProjectModalOpen(false);
  };

  const openTeamModal = (member?: TeamMember) => {
    setEditingTeam(member || null);
    setIsTeamModalOpen(true);
  };

  const closeTeamModal = () => {
    setEditingTeam(null);
    setIsTeamModalOpen(false);
  };

  const openDonation = (projectId?: string | React.MouseEvent | unknown) => {
    if (typeof projectId === 'string') {
      setDonationProjectId(projectId);
    } else {
      setDonationProjectId(null);
    }
    setIsDonationOpen(true);
  };
  const closeDonation = () => {
    setDonationProjectId(null);
    setIsDonationOpen(false);
  };

  const openVolunteer = () => setIsVolunteerOpen(true);
  const closeVolunteer = () => setIsVolunteerOpen(false);

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        setIsAdmin,
        currentUser,
        setCurrentUser,
        role: currentUser?.role || null,
        can,
        toggleAdmin,
        isAdminLoginOpen,
        openAdminLogin,
        closeAdminLogin,
        isCreateNewsOpen,
        editingNews,
        openCreateNews,
        closeCreateNews,
        isProjectModalOpen,
        editingProject,
        openProjectModal,
        closeProjectModal,
        isTeamModalOpen,
        editingTeam,
        openTeamModal,
        closeTeamModal,
        isDonationOpen,
        donationProjectId,
        openDonation,
        closeDonation,
        isVolunteerOpen,
        openVolunteer,
        closeVolunteer,
        language,
        setLanguage: handleSetLanguage,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
