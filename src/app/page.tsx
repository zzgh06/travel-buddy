
export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">
        Welcome to Travel Buddy{session?.user?.name ? `, ${session.user.name}` : ''}!
      </h1>
      <p className="text-xl">Start planning your next adventure today.</p>
    </div>
  );
}