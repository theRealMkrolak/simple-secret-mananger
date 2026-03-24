import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupTextarea, InputGroupButton } from "@/components/ui/input";
import { Eye, EyeOff, Copy, Check } from "lucide-react";

export function ViewSecretModal({ selectedSecret, onClose }: { selectedSecret: any, onClose: () => void }) {
  const [showSecret, setShowSecret] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (selectedSecret?.secret) {
      navigator.clipboard.writeText(selectedSecret.secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setShowSecret(false);
    onClose();
  };

  return (
    <Dialog open={!!selectedSecret} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Secret Inspector: {selectedSecret?.key}</DialogTitle>
          {selectedSecret && (
            <p className="text-sm text-muted-foreground">
              Global ID: <span className="font-medium text-foreground">{selectedSecret.secret_id}</span>
            </p>
          )}
        </DialogHeader>
        {selectedSecret && (
          <div className="space-y-6 py-2">
            <div className="space-y-3">
              <InputGroup className="h-auto py-4 items-start px-4">
                <InputGroupAddon className="flex-col !items-start gap-4">
                  <InputGroupTextarea
                    readOnly
                    value={showSecret ? selectedSecret.secret : "••••••••••••••••••••••••••••••••"}
                    className={`font-mono text-sm min-h-[150px] transition-all duration-200 ${!showSecret ? "select-none tracking-widest opacity-40" : "opacity-100"}`}
                  />
                  <div className="flex items-center gap-2 w-full justify-end border-t pt-2 border-input/20">
                    <InputGroupButton
                      onClick={() => setShowSecret(!showSecret)}
                      className="h-8 px-3 text-xs gap-2 bg-muted/50 hover:bg-muted"
                    >
                      {showSecret ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                      {showSecret ? "Hide" : "Show"}
                    </InputGroupButton>
                    <InputGroupButton
                      onClick={handleCopy}
                      disabled={!showSecret}
                      className="h-8 px-3 text-xs gap-2 bg-muted/50 hover:bg-muted"
                    >
                      {copied ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />}
                      {copied ? "Copied" : "Copy"}
                    </InputGroupButton>
                  </div>
                </InputGroupAddon>
              </InputGroup>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button onClick={handleClose} variant="secondary" className="w-full">Dismiss</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
