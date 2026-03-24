import { useEffect, useState } from "react";
import { readSecsApiV1AdminSecretsGet, readMySecretsApiV1ClientSecretsGet } from "@/client/sdk.gen";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupButton } from "@/components/ui/input";
import { CreateSecretModal } from "../components/modals/CreateSecretModal";
import { ViewSecretModal } from "../components/modals/ViewSecretModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Eye, MoreHorizontal, Trash, Key as KeyIcon, Vault, Copy, Check } from "lucide-react";
import {
  deleteSecApiV1AdminSecretsSecretIdDelete,
  readSecApiV1AdminSecretsSecretIdGet,
  readMySecretApiV1ClientSecretsKeyGet
} from "@/client/sdk.gen";

import type { SecretResponse, SecretListResponse } from "@/client/types.gen";

export default function SecretsPage({ isAdmin }: { isAdmin: boolean }) {
  const [secrets, setSecrets] = useState<SecretListResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSecret, setSelectedSecret] = useState<SecretResponse | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isFetchingDetail, setIsFetchingDetail] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(val);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const loadSecrets = () => {
    const fetchFunc = isAdmin ? readSecsApiV1AdminSecretsGet : readMySecretsApiV1ClientSecretsGet;
    fetchFunc()
      .then(res => setSecrets(res.data || []))
      .catch()
      .finally(() => setLoading(false));
  };

  const handleView = async (secret: SecretListResponse) => {
    setIsFetchingDetail(true);
    try {
      if (isAdmin) {
        const { data } = await readSecApiV1AdminSecretsSecretIdGet({
          path: { secret_id: secret.secret_id }
        });
        if (data) setSelectedSecret(data);
      } else {
        const { data } = await readMySecretApiV1ClientSecretsKeyGet({
          path: { key: secret.key }
        });
        if (data) setSelectedSecret(data);
      }
    } catch (err) {
      console.error("Failed to fetch secret detail", err);
    } finally {
      setIsFetchingDetail(false);
    }
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
        {isAdmin && <Button onClick={() => setIsCreateOpen(true)} className="font-semibold">+ Map New Secret</Button>}
      </div>

      <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Vault className="size-5 text-primary" />
            Global Secret Vault
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-muted-foreground flex flex-col items-center gap-2">
              <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              Loading Secrets...
            </div>
          ) : secrets.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
              No secrets found.
            </div>
          ) : (
            <div className="rounded-md border border-border/40">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[120px] font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">ID</TableHead>
                    <TableHead className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">Reference Tag</TableHead>
                    <TableHead className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">Secret Data</TableHead>
                    <TableHead className="text-right font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {secrets.map((s) => (
                    <TableRow key={s.secret_id} className="border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors">
                      <TableCell className="py-4 font-medium text-sm">
                        {s.secret_id}
                      </TableCell>
                      <TableCell>
                        <InputGroup className="h-8 w-fit min-w-[140px] px-4 py-0 transition-all border-muted-foreground/20 bg-muted/40 rounded-4xl">
                          <InputGroupAddon className="gap-2.5">
                            <KeyIcon className="size-3 text-primary/60 shrink-0" />
                            <InputGroupText className="font-mono text-[11px] text-foreground font-semibold whitespace-nowrap">
                              {s.key}
                            </InputGroupText>
                            <InputGroupButton 
                              size="icon" 
                              className="size-6 shrink-0 -mr-2 bg-transparent hover:bg-background/20 rounded-full"
                              onClick={() => handleCopy(s.key)}
                            >
                              {copiedKey === s.key ? (
                                <Check className="size-3 text-green-500" />
                              ) : (
                                <Copy className="size-3 opacity-50 hover:opacity-100" />
                              )}
                            </InputGroupButton>
                          </InputGroupAddon>
                        </InputGroup>
                      </TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs tracking-widest">
                        •••••••••••••••••
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
                            <DropdownMenuItem
                              onClick={() => handleView(s)}
                              disabled={isFetchingDetail}
                              className="cursor-pointer"
                            >
                              <Eye className="mr-2 size-4 opacity-70" />
                              View Secret
                            </DropdownMenuItem>
                            {isAdmin && (
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() => handleDelete(s.secret_id)}
                                className="cursor-pointer"
                              >
                                <Trash className="mr-2 size-4 opacity-70" />
                                Delete Secret
                              </DropdownMenuItem>
                            )}
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

      <CreateSecretModal open={isCreateOpen} onOpenChange={setIsCreateOpen} onSuccess={loadSecrets} />
      <ViewSecretModal selectedSecret={selectedSecret} onClose={() => setSelectedSecret(null)} />
    </div>
  );
}
