import { useEffect, useState } from "react";
import { readLinksApiV1AdminLinksGet } from "@/client/sdk.gen";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreateLinkModal } from "../components/modals/CreateLinkModal";
import { ViewLinkModal } from "../components/modals/ViewLinkModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Eye, MoreHorizontal, Trash, Key as KeyIcon, Lock, Link2 } from "lucide-react";
import {
  deleteLinkApiV1AdminLinksLinkIdDelete,
  readKeyApiV1AdminApiKeysApiKeyIdGet,
  readSecApiV1AdminSecretsSecretIdGet
} from "@/client/sdk.gen";
import { ViewApiKeyModal } from "../components/modals/ViewApiKeyModal";
import { ViewSecretModal } from "../components/modals/ViewSecretModal";

import type {
  ApiKeySecretLinkResponse as LinkObj,
  ApiKeyResponse,
  SecretResponse
} from "@/client/types.gen";

export default function LinksPage() {
  const [links, setLinks] = useState<LinkObj[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLink, setSelectedLink] = useState<LinkObj | null>(null);
  const [selectedKey, setSelectedKey] = useState<ApiKeyResponse | null>(null);
  const [selectedSecret, setSelectedSecret] = useState<SecretResponse | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isFetchingSub, setIsFetchingSub] = useState(false);

  const handleViewKey = async (id: string) => {
    setIsFetchingSub(true);
    try {
      const { data } = await readKeyApiV1AdminApiKeysApiKeyIdGet({
        path: { api_key_id: id }
      });
      if (data) setSelectedKey(data);
    } catch (err) {
      console.error("Failed to fetch key details", err);
    } finally {
      setIsFetchingSub(false);
    }
  };

  const handleViewSecret = async (id: string) => {
    setIsFetchingSub(true);
    try {
      const { data } = await readSecApiV1AdminSecretsSecretIdGet({
        path: { secret_id: id }
      });
      if (data) setSelectedSecret(data);
    } catch (err) {
      console.error("Failed to fetch secret details", err);
    } finally {
      setIsFetchingSub(false);
    }
  };

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

      <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Link2 className="size-5 text-primary" />
            Key ↔ Secret Access Paths
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-muted-foreground flex flex-col items-center gap-2">
              <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              Loading Bindings...
            </div>
          ) : links.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
              No bindings found.
            </div>
          ) : (
            <div className="rounded-md border border-border/40">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[120px] font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">Link ID</TableHead>
                    <TableHead className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">API Key Target</TableHead>
                    <TableHead className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">Linked Vault Item</TableHead>
                    <TableHead className="text-right font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {links.map((l) => (
                    <TableRow key={l.id} className="border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors">
                      <TableCell className="py-4 font-medium text-sm">
                        {l.id}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewKey(l.api_key_id)}
                          disabled={isFetchingSub}
                          className="h-7 gap-1.5 font-mono text-[11px] border-muted-foreground/20 bg-muted/40 hover:bg-muted/60 rounded-full px-3 whitespace-nowrap"
                        >
                          <KeyIcon className="size-3 text-muted-foreground/70" />
                          Key:{l.api_key_id}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewSecret(l.secret_id)}
                          disabled={isFetchingSub}
                          className="h-7 gap-1.5 font-mono text-[11px] border-muted-foreground/20 bg-muted/40 hover:bg-muted/60 rounded-full px-3 whitespace-nowrap"
                        >
                          <Lock className="size-3 text-muted-foreground/70" />
                          Secret:{l.secret_id}
                        </Button>
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
                            <DropdownMenuItem onClick={() => setSelectedLink(l)} className="cursor-pointer">
                              <Eye className="mr-2 size-4 opacity-70" />
                              View Link
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => handleDelete(l.id)}
                              className="cursor-pointer"
                            >
                              <Trash className="mr-2 size-4 opacity-70" />
                              Remove Link
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

      <CreateLinkModal open={isCreateOpen} onOpenChange={setIsCreateOpen} onSuccess={loadLinks} />
      <ViewLinkModal selectedLink={selectedLink} onClose={() => setSelectedLink(null)} />
      <ViewApiKeyModal selectedKey={selectedKey} onClose={() => setSelectedKey(null)} />
      <ViewSecretModal selectedSecret={selectedSecret} onClose={() => setSelectedSecret(null)} />
    </div>
  );
}
