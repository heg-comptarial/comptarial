import { Button } from "@/components/ui/button";
import { FileText, Edit } from "lucide-react";

export default function RegistrationPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <h1 className="text-2xl font-semibold mb-8">
        Infos générales (page s&apos;inscrire)
      </h1>

      <div className="space-y-6 mb-12">
      
      </div>

      <div className="flex items-center justify-between mt-16">
        <h2 className="text-xl font-medium">Grand livre (pdf à consulter)</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon">
            <FileText className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
