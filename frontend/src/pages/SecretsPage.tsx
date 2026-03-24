import { useEffect, useState } from "react";
import { readSecsApiV1AdminSecretsGet } from "@/client/sdk.gen";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreateSecretModal } from "../components/modals/CreateSecretModal";
import { ViewSecretModal } from "../components/modals/ViewSecretModal";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Eye, MoreHorizontal, Trash } from "lucide-react";
import { deleteSecApiV1AdminSecretsSecretIdDelete } from "@/client/sdk.gen";

import type { SecretResponse as Secret } from "@/client/types.gen";

export default function SecretsPage() {
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSecret, setSelectedSecret] = useState<Secret | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const loadSecrets = () => {
    readSecsApiV1AdminSecretsGet()
      .then(res => setSecrets(res.data || []))
      .catch()
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure? This will permanently delete this secret and all associated links.")) {
       await deleteSecApiV1AdminSecretsSecretIdDelete({
          path: { secret_id: id }
       });
       loadSecrets();
    }
  };

  useEffect(() => {
    loadSecrets();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Secrets</h1>
        <Button onClick={() => setIsCreateOpen(true)} className="font-semibold">+ Map New Secret</Button>
      </div>

      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle>Global Secret Vault</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-6 text-center text-muted-foreground">Loading Secrets...</div>
          ) : secrets.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground">No secrets found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Reference Tag</TableHead>
                  <TableHead>Secret Data (Hidden)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {secrets.map((s) => (
                  <TableRow key={s.secret_id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">{s.secret_id}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{s.key}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">•••••••••••••••••</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm">
                            <MoreHorizontal className="size-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32">
                          <DropdownMenuItem onClick={() => setSelectedSecret(s)}>
                            <Eye className="mr-2 size-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            variant="destructive" 
                            onClick={() => handleDelete(s.secret_id)}
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

      <CreateSecretModal open={isCreateOpen} onOpenChange={setIsCreateOpen} onSuccess={loadSecrets} />
      <ViewSecretModal selectedSecret={selectedSecret} onClose={() => setSelectedSecret(null)} />
    </div>
  );
}
