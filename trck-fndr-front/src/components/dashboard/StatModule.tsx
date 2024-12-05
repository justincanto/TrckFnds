import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";

const StatModule = ({
  title,
  value,
  evolution,
  icon,
}: {
  title: string;
  value: string | null;
  evolution: string | null;
  icon: JSX.Element;
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {value ? (
          <>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{evolution}</p>
          </>
        ) : (
          <>
            <Skeleton className="w-32 h-4 my-2 rounded-full" />
            <Skeleton className="w-32 h-3 my-1 rounded-full" />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StatModule;
