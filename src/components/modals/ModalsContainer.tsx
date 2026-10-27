'use client';

import dynamic from 'next/dynamic';

import AdminLoginModal from './AdminLoginModal';

const CreateNewsModal = dynamic(() => import('./CreateNewsModal'), { ssr: false });
const ProjectModal = dynamic(() => import('./ProjectModal'), { ssr: false });
const TeamModal = dynamic(() => import('./TeamModal'), { ssr: false });
const DonationModal = dynamic(() => import('./DonationModal'), { ssr: false });
const VolunteerModal = dynamic(() => import('./VolunteerModal'), { ssr: false });

export default function ModalsContainer() {
  return (
    <>
      <AdminLoginModal />
      <CreateNewsModal />
      <ProjectModal />
      <TeamModal />
      <DonationModal />
      <VolunteerModal />
    </>
  );
}
