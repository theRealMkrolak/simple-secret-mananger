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
import { Eye, MoreHorizontal, Trash, Key as KeyIcon } from "lucide-react";
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
      
      <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
            <KeyIcon className="size-5 text-primary" />
            Managed Keys
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-muted-foreground flex flex-col items-center gap-2">
              <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              Loading API Keys...
            </div>
          ) : keys.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
              No API keys found.
            </div>
          ) : (
            <div className="rounded-md border border-border/40">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[120px] font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">ID</TableHead>
                    <TableHead className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">Name</TableHead>
                    <TableHead className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">Role</TableHead>
                    <TableHead className="text-right font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {keys.map((k) => (
                    <TableRow key={k.api_key_id} className="border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors">
                      <TableCell className="py-4 font-medium text-sm">
                        {k.api_key_id}
                      </TableCell>
                      <TableCell className="font-medium text-sm">{k.name}</TableCell>
                      <TableCell>
                        {k.is_admin ? (
                          <Badge variant="default" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">Admin</Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-muted/50 text-muted-foreground border-transparent">Client</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8">
                              <MoreHorizontal className="size-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => setSelectedKey(k)} className="cursor-pointer">
                              <Eye className="mr-2 size-4 opacity-70" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              variant="destructive" 
                              onClick={() => handleDelete(k.api_key_id)}
                              className="cursor-pointer"
                            >
                              <Trash className="mr-2 size-4 opacity-70" />
                              Revoke Key
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateApiKeyModal open={isCreateOpen} onOpenChange={setIsCreateOpen} onSuccess={loadKeys} />
      <ViewApiKeyModal selectedKey={selectedKey} onClose={() => setSelectedKey(null)} />
    </div>
  );
}
