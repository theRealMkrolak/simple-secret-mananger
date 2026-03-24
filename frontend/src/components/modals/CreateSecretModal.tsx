import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSecApiV1AdminSecretsPost } from "@/client/sdk.gen";

export function CreateSecretModal({ open, onOpenChange, onSuccess }: { open: boolean, onOpenChange: (open: boolean) => void, onSuccess: () => void }) {
  const [keyRef, setKeyRef] = useState("");
  const [secretVal, setSecretVal] = useState("");

  const handleSave = async () => {
    const res = await createSecApiV1AdminSecretsPost({
      body: { key: keyRef, secret: secretVal }
    });
    
    if (!res.error) {
      setKeyRef("");
      setSecretVal("");
      onSuccess();
      onOpenChange(false);
    }
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
            <Input value={keyRef} onChange={e => setKeyRef(e.target.value)} className="col-span-3" placeholder="Secret_Name" />
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
