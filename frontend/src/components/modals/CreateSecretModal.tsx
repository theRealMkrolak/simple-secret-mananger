import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, InputGroup, InputGroupAddon, InputGroupTextarea, InputGroupButton } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
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
  const [showSecret, setShowSecret] = useState(true);
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Vault Secret</DialogTitle>
          <DialogDescription>
            Inject a new highly sensitive configuration parameter.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-5 py-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold">Ref Key</label>
            <Input value={keyRef} onChange={handleKeyChange} className={error ? "border-destructive focus-visible:ring-destructive" : ""} placeholder="secretName" />
            {error && <p className="text-[10px] font-medium text-destructive">{error}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold">Value</label>
            <InputGroup className="h-auto py-3 items-start px-3">
              <InputGroupAddon className="flex-col !items-start gap-2 w-full">
                <InputGroupTextarea
                  value={showSecret ? secretVal : ""}
                  readOnly={!showSecret}
                  onChange={e => setSecretVal(e.target.value)}
                  placeholder={showSecret ? "Paste your secret value here…" : (secretVal ? "••••••••••••••••" : "Paste your secret value here…")}
                  className="font-mono text-sm min-h-[160px] w-full resize-none"
                  spellCheck={false}
                  autoComplete="off"
                />
                <div className="flex justify-end w-full border-t pt-2 border-input/20">
                  <InputGroupButton
                    type="button"
                    onClick={() => setShowSecret(s => !s)}
                    className="h-7 px-3 text-xs gap-1.5 bg-muted/50 hover:bg-muted"
                  >
                    {showSecret ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                    {showSecret ? "Hide" : "Show"}
                  </InputGroupButton>
                </div>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Store Secret</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
