import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ChartModule = ({
  children,
  headerRight,
  title,
  description,
  className,
}: {
  children: JSX.Element;
  headerRight?: JSX.Element;
  title: string;
  description: string;
  className?: string;
}) => {
  return (
    <Card className={className}>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {headerRight}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default ChartModule;
