import { useEffect, useState } from "react";
import { readKeysApiV1AdminApiKeysGet } from "@/client/sdk.gen";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreateApiKeyModal } from "../components/modals/CreateApiKeyModal";
import { ViewApiKeyModal } from "../components/modals/ViewApiKeyModal";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Eye, MoreHorizontal, Trash } from "lucide-react";
import { deleteKeyApiV1AdminApiKeysApiKeyIdDelete } from "@/client/sdk.gen";

import type { ApiKeyResponse as ApiKey } from "@/client/types.gen";

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKey, setSelectedKey] = useState<ApiKey | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const loadKeys = () => {
    readKeysApiV1AdminApiKeysGet()
      .then(res => setKeys(res.data || []))
      .catch()
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure? This will revoke all access for this context.")) {
       await deleteKeyApiV1AdminApiKeysApiKeyIdDelete({
          path: { api_key_id: id }
       });
       loadKeys();
    }
  };

  useEffect(() => {
    loadKeys();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
        <Button onClick={() => setIsCreateOpen(true)} className="font-semibold">+ Add New Context</Button>
      </div>
      
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle>Managed Keys</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-6 text-center text-muted-foreground">Loading API Keys...</div>
          ) : keys.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground">No API keys found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keys.map((k) => (
                  <TableRow key={k.api_key_id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">{k.api_key_id}</TableCell>
                    <TableCell>{k.name}</TableCell>
                    <TableCell>
                      {k.is_admin ? (
                        <Badge variant="default" className="bg-primary text-primary-foreground">Admin</Badge>
                      ) : (
                        <Badge variant="secondary">Client</Badge>
                      )}
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
                          <DropdownMenuItem onClick={() => setSelectedKey(k)}>
                            <Eye className="mr-2 size-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            variant="destructive" 
                            onClick={() => handleDelete(k.api_key_id)}
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

      <CreateApiKeyModal open={isCreateOpen} onOpenChange={setIsCreateOpen} onSuccess={loadKeys} />
      <ViewApiKeyModal selectedKey={selectedKey} onClose={() => setSelectedKey(null)} />
    </div>
  );
}
