import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StatModule = ({
  title,
  value,
  evolution,
  icon,
}: {
  title: string;
  value: string;
  evolution: string;
  icon: JSX.Element;
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{evolution}</p>
      </CardContent>
    </Card>
  );
};

export default StatModule;
