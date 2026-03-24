import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ViewLinkModal({ selectedLink, onClose }: { selectedLink: any, onClose: () => void }) {
  return (
    <Dialog open={!!selectedLink} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Binding Inspector</DialogTitle>
          <DialogDescription>
            Details for relational database link #{selectedLink?.id}.
          </DialogDescription>
        </DialogHeader>
        {selectedLink && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm border-r pr-4 font-semibold">Key ID</label>
              <div className="col-span-3">
                <Badge variant="secondary" className="font-mono">#{selectedLink.api_key_id}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm border-r pr-4 font-semibold">Secret ID</label>
              <div className="col-span-3">
                <Badge variant="outline" className="font-mono">#{selectedLink.secret_id}</Badge>
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
