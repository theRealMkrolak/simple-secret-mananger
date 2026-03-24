import { useEffect, useState } from "react";
import { readLinksApiV1AdminLinksGet } from "@/client/sdk.gen";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreateLinkModal } from "../components/modals/CreateLinkModal";
import { ViewLinkModal } from "../components/modals/ViewLinkModal";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Eye, MoreHorizontal, Trash } from "lucide-react";
import { deleteLinkApiV1AdminLinksLinkIdDelete } from "@/client/sdk.gen";

import type { ApiKeySecretLinkResponse as LinkObj } from "@/client/types.gen";

export default function LinksPage() {
  const [links, setLinks] = useState<LinkObj[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLink, setSelectedLink] = useState<LinkObj | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  const loadLinks = () => {
    readLinksApiV1AdminLinksGet()
      .then(res => setLinks(res.data || []))
      .catch()
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure? This will remove the access link between this key and secret.")) {
       await deleteLinkApiV1AdminLinksLinkIdDelete({
          path: { link_id: id }
       });
       loadLinks();
    }
  };

  useEffect(() => {
    loadLinks();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Bindings</h1>
        <Button onClick={() => setIsCreateOpen(true)} className="font-semibold">+ Create Relational Link</Button>
      </div>
      
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle>Key ↔ Secret Access Paths</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-6 text-center text-muted-foreground">Loading Bindings...</div>
          ) : links.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground">No bindings found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Link ID</TableHead>
                  <TableHead>API Key Target</TableHead>
                  <TableHead>Linked Vault Item</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {links.map((l) => (
                  <TableRow key={l.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">{l.id}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Key #{l.api_key_id}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Secret #{l.secret_id}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm">
                            <MoreHorizontal className="size-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32">
                          <DropdownMenuItem onClick={() => setSelectedLink(l)}>
                            <Eye className="mr-2 size-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            variant="destructive" 
                            onClick={() => handleDelete(l.id)}
                          >
                            <Trash className="mr-2 size-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <CreateLinkModal open={isCreateOpen} onOpenChange={setIsCreateOpen} onSuccess={loadLinks} />
      <ViewLinkModal selectedLink={selectedLink} onClose={() => setSelectedLink(null)} />
    </div>
  );
}
