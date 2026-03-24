import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSecApiV1AdminSecretsPost } from "@/client/sdk.gen";

const toCamelCase = (str: string) => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "")
    .replace(/[_-]+/g, "");
};

export function CreateSecretModal({ open, onOpenChange, onSuccess }: { open: boolean, onOpenChange: (open: boolean) => void, onSuccess: () => void }) {
  const [keyRef, setKeyRef] = useState("");
  const [secretVal, setSecretVal] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Auto-fix to camelCase as they type for immediate UX
    const camel = toCamelCase(raw);
    setKeyRef(camel);
    
    // Explicitly check for validity (must start with lowercase)
    if (raw && !/^[a-z][a-zA-Z0-9]*$/.test(camel)) {
      setError("Must be valid camelCase (e.g., mySecret)");
    } else {
      setError(null);
    }
  };

  const handleSave = async () => {
    if (!keyRef || error) {
      setError("Please provide a valid camelCase key");
      return;
    }

    const { error: apiErr } = await createSecApiV1AdminSecretsPost({
      body: { key: keyRef, secret: secretVal }
    });
    
    if (apiErr) {
      setError(typeof apiErr === 'string' ? apiErr : "Failed to store secret - check format");
      return;
    }

    setKeyRef("");
    setSecretVal("");
    setError(null);
    onSuccess();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Vault Secret</DialogTitle>
          <DialogDescription>
            Inject a new highly sensitive configuration parameter.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-semibold">Ref Key</label>
            <div className="col-span-3 space-y-1">
              <Input value={keyRef} onChange={handleKeyChange} className={error ? "border-destructive focus-visible:ring-destructive" : ""} placeholder="secretName" />
              {error && <p className="text-[10px] font-medium text-destructive">{error}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-semibold">Value</label>
            <Input value={secretVal} onChange={e => setSecretVal(e.target.value)} type="password" className="col-span-3" placeholder="••••••••" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Store Secret</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
