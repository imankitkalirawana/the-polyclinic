interface OrganizationPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrganizationPage({ params }: OrganizationPageProps) {
  const { id } = await params;

  return <div>OrganizationPage: {id}</div>;
}
