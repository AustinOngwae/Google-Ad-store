import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Ban } from "lucide-react";
import { AdWithStatus } from "@/types";

interface AdCardProps {
  ad: AdWithStatus;
  onSave: (adId: string, isSaved: boolean) => void;
  onBlock: (adId: string) => void;
}

export const AdCard = ({ ad, onSave, onBlock }: AdCardProps) => {
  return (
    <Card className="w-full max-w-sm overflow-hidden">
      <CardHeader className="p-0">
        <img src={ad.image_url} alt={ad.title} className="object-cover h-48 w-full" />
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle>{ad.title}</CardTitle>
        <p className="text-sm text-muted-foreground mt-2">{ad.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0">
        <Button variant="outline" asChild>
          <a href={ad.cta_url} target="_blank" rel="noopener noreferrer">{ad.cta_text}</a>
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => onSave(ad.id, !ad.is_saved)}>
            <Bookmark className={ad.is_saved ? "fill-primary text-primary" : ""} />
            <span className="sr-only">Save</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onBlock(ad.id)}>
            <Ban />
            <span className="sr-only">Block</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};