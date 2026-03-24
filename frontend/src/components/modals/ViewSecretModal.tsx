import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ViewSecretModal({ selectedSecret, onClose }: { selectedSecret: any, onClose: () => void }) {
  return (
    <Dialog open={!!selectedSecret} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Secret Inspector</DialogTitle>
          <DialogDescription>
            Review the sensitive contents and mapping of Secret #{selectedSecret?.id}.
          </DialogDescription>
        </DialogHeader>
        {selectedSecret && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm border-r pr-4 font-semibold">Ref Key</label>
              <div className="col-span-3">
                <Badge variant="outline" className="font-mono text-xs">{selectedSecret.key}</Badge>
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-4 border-t pt-4">
              <label className="text-sm font-semibold">Decrypted Payload</label>
              <div className="p-4 bg-muted text-muted-foreground font-mono text-xs rounded-md break-all">
                {selectedSecret.secret}
              </div>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button onClick={onClose} className="w-full">Dismiss</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
