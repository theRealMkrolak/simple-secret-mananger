import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function ViewApiKeyModal({ selectedKey, onClose }: { selectedKey: any, onClose: () => void }) {
  return (
    <Dialog open={!!selectedKey} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>View API Key</DialogTitle>
          <DialogDescription>
            Details of API Key #{selectedKey?.id}.
          </DialogDescription>
        </DialogHeader>
        {selectedKey && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm border-r pr-4 font-semibold">Name</label>
              <Input value={selectedKey.name} readOnly disabled className="col-span-3 text-muted-foreground" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm border-r pr-4 font-semibold">Role</label>
              <div className="col-span-3">
                {selectedKey.is_admin ? (
                  <Badge variant="default">Admin Context</Badge>
                ) : (
                  <Badge variant="secondary">Client Context</Badge>
                )}
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
