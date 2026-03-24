import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createLinkApiV1AdminLinksPost, readKeysApiV1AdminApiKeysGet, readSecsApiV1AdminSecretsGet } from "@/client/sdk.gen";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function CreateLinkModal({ open, onOpenChange, onSuccess }: { open: boolean, onOpenChange: (open: boolean) => void, onSuccess: () => void }) {
  const [keyId, setKeyId] = useState("");
  const [secretId, setSecretId] = useState("");

  const [availableKeys, setAvailableKeys] = useState<{ api_key_id: string, name: string }[]>([]);
  const [availableSecrets, setAvailableSecrets] = useState<{ secret_id: string, key: string }[]>([]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setKeyId("");
      setSecretId("");
      setAvailableSecrets([]);
    }
    onOpenChange(newOpen);
  };

  // Initial fetch for API Keys only
  useEffect(() => {
    if (open) {
      readKeysApiV1AdminApiKeysGet().then(res => {
        setAvailableKeys(res.data || []);
      });
    }
  }, [open]);

  // Re-fetch available secrets when keyId changes
  useEffect(() => {
    if (open && keyId) {
      readSecsApiV1AdminSecretsGet({
        query: { for_api_key_id: keyId }
      }).then(res => {
        setAvailableSecrets(res.data || []);
      });
    } else {
      setAvailableSecrets([]);
      setSecretId("");
    }
  }, [open, keyId]);

  const handleSave = async () => {
    if (!keyId || !secretId) return;

    const res = await createLinkApiV1AdminLinksPost({
      body: { api_key_id: keyId, secret_id: secretId }
    });

    if (!res.error) {
      setKeyId("");
      setSecretId("");
      onSuccess();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Binding Link</DialogTitle>
          <DialogDescription>
            Map an API Key explicitly to a specific Secret ID to grant access.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 overflow-hidden max-w-full">
          <div className="grid grid-cols-[100px_1fr] items-center gap-4 min-w-0">
            <Label className="text-right">API Key</Label>
            <div className="min-w-0">
              <Select value={keyId} onValueChange={setKeyId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an API Key" />
                </SelectTrigger>
                <SelectContent>
                  {availableKeys.map(k => (
                    <SelectItem key={k.api_key_id} value={k.api_key_id}>
                      <span className="truncate">#{k.api_key_id} - {k.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-[100px_1fr] items-center gap-4 min-w-0">
            <Label className="text-right">Secret</Label>
            <div className="min-w-0">
              <Select value={secretId} onValueChange={setSecretId} disabled={!keyId}>
                <SelectTrigger disabled={!keyId}>
                  <SelectValue placeholder={!keyId ? "Select an API Key first..." : "Select a Datavault Secret"} />
                </SelectTrigger>
                <SelectContent>
                  {availableSecrets.map(s => (
                    <SelectItem key={s.secret_id} value={s.secret_id}>
                      <span className="truncate">#{s.secret_id} - {s.key}</span>
                    </SelectItem>
                  ))}
                  {availableSecrets.length === 0 && keyId && (
                    <div className="p-2 text-sm text-muted-foreground text-center">
                      No unlinked secrets found
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={!keyId || !secretId}>Bind Relationship</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
