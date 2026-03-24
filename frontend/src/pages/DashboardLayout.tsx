import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import ApiKeysPage from "./ApiKeysPage";
import SecretsPage from "./SecretsPage";
import LinksPage from "./LinksPage";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter,
  SidebarHeader
} from "@/components/ui/sidebar";

export default function DashboardLayout() {
  const token = localStorage.getItem("apiKey");
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("keys");

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const logout = () => {
    localStorage.removeItem("apiKey");
    navigate("/login");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "keys": return <ApiKeysPage />;
      case "secrets": return <SecretsPage />;
      case "links": return <LinksPage />;
      default: return <ApiKeysPage />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-muted/10 text-foreground w-full">
        <Sidebar>
          <SidebarHeader className="border-b h-16 flex items-center justify-center font-bold text-xl tracking-tight">
            SecretsManager
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === 'keys'} onClick={() => setActiveTab('keys')}>
                      API Keys
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === 'secrets'} onClick={() => setActiveTab('secrets')}>
                      Secrets Vault
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === 'links'} onClick={() => setActiveTab('links')}>
                      Key Bindings
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={logout} className="text-destructive hover:bg-destructive/10">
                  Logout
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col overflow-hidden w-full">
          <header className="h-16 border-b bg-background flex items-center px-4 shrink-0 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 w-full">
            <SidebarTrigger />
            <span className="font-bold text-lg ml-4">Dashboard</span>
          </header>
          <div className="flex-1 overflow-auto p-6 md:p-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
