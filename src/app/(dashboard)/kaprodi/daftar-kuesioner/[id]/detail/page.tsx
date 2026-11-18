type DetailKuesionerPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DetailKuesionerPage({ params }: DetailKuesionerPageProps) {
  const { id } = await params;

  return <div>Detail Kuesioner {id}</div>;
}
