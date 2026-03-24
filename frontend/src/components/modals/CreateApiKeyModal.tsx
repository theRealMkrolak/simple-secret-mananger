import { useState } from "react";
import { Check, Key } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, InputGroup, InputGroupButton, InputGroupAddon, InputGroupText } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy as CopyIcon } from "lucide-react";
import { createKeyApiV1AdminApiKeysPost } from "@/client/sdk.gen";

export function CreateApiKeyModal({ open, onOpenChange, onSuccess }: { open: boolean, onOpenChange: (open: boolean) => void, onSuccess: () => void }) {
  const [name, setName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [rawKeyResponse, setRawKeyResponse] = useState("");
  const [copied, setCopied] = useState(false);
  
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setName("");
      setIsAdmin(false);
      setRawKeyResponse("");
      setCopied(false);
    }
    onOpenChange(newOpen);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rawKeyResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    const res = await createKeyApiV1AdminApiKeysPost({
      body: { name, is_admin: isAdmin }
    });

    if (!res.error && res.data) {
      setRawKeyResponse(res.data.key_string);
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New API Key</DialogTitle>
          <DialogDescription>
            {rawKeyResponse ? "Key successfully generated! Please copy it now." : "Fill out the details below to generate a new context key."}
          </DialogDescription>
        </DialogHeader>
        {rawKeyResponse ? (
          <div className="pb-4 pt-2 min-w-0 max-w-full overflow-hidden">
            <InputGroup className="overflow-hidden max-w-full">
              <InputGroupAddon align="block-start" className="overflow-hidden">
                <Key className="w-4 h-4 text-muted-foreground shrink-0" />
                <InputGroupText className="font-mono overflow-hidden">
                  {rawKeyResponse}
                </InputGroupText>
                <InputGroupButton 
                  size="icon-xs" 
                  className="ml-auto shrink-0" 
                  onClick={handleCopy} 
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <CopyIcon />}
                  <span className="sr-only">Copy</span>
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-[100px_1fr] items-center gap-4 min-w-0">
              <Label className="text-right">Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} className="min-w-0" placeholder="Service Name..." />
            </div>
            <div className="grid grid-cols-[100px_1fr] items-center gap-4 min-w-0">
              <Label className="text-right">Admin</Label>
              <div className="flex items-center space-x-2">
                <Checkbox id="is-admin" checked={isAdmin} onCheckedChange={(checked) => setIsAdmin(!!checked)} />
                <Label htmlFor="is-admin" className="text-sm text-muted-foreground cursor-pointer">Grant Admin Access</Label>
              </div>
            </div>
          </div>
        )}
        <DialogFooter>
          {rawKeyResponse ? (
            <Button onClick={() => { onOpenChange(false); setRawKeyResponse(""); setName(""); setIsAdmin(false); }}>Done</Button>
          ) : (
            <Button onClick={handleSave}>Generate Key</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
