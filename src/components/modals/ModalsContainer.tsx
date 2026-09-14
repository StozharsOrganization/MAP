'use client';

import dynamic from 'next/dynamic';

const CreateNewsModal = dynamic(() => import('./CreateNewsModal'), { ssr: false });
const ProjectModal = dynamic(() => import('./ProjectModal'), { ssr: false });
const TeamModal = dynamic(() => import('./TeamModal'), { ssr: false });
const DonationModal = dynamic(() => import('./DonationModal'), { ssr: false });
const VolunteerModal = dynamic(() => import('./VolunteerModal'), { ssr: false });
const AdminLoginModal = dynamic(() => import('./AdminLoginModal'), { ssr: false });

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
