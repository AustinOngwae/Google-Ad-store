import { Navbar } from "@/components/Navbar";
import { AdManager } from "@/components/AdManager";

const Admin = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4 md:p-8">
        <header className="my-8">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">Manage your application's ads here.</p>
        </header>
        <main>
          <AdManager />
        </main>
      </div>
    </>
  );
};

export default Admin;